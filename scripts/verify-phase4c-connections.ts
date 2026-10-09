import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env
const envPath = path.resolve(process.cwd(), '.env');
let envUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
let envKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key === 'EXPO_PUBLIC_SUPABASE_URL' && !envUrl) envUrl = value;
      if (key === 'EXPO_PUBLIC_SUPABASE_ANON_KEY' && !envKey) envKey = value;
    }
  }
}

if (!envUrl || !envKey) {
  console.error('Error: Supabase environment variables not found.');
  process.exit(1);
}

const SUPABASE_URL = envUrl;
const SUPABASE_ANON_KEY = envKey;

async function runSecurityAudit() {
  console.log('==================================================');
  console.log('PHASE 4C CONNECTION SECURITY & INTEGRATION AUDIT');
  console.log('==================================================\n');

  // 1. Authenticate three distinct test users
  const userAClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const userBClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const userCClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const emailA = 'sccinet.owner.test@gmail.com';
  const emailB = 'sccinet.collab.test@gmail.com';
  const emailC = 'sccinet.outsider.test@gmail.com';
  const password = 'Pass12345!Secure';

  console.log('Step 1: Authenticating test clients...');
  const { data: authA, error: errA } = await userAClient.auth.signInWithPassword({ email: emailA, password });
  if (errA) throw new Error(`User A sign-in failed: ${errA.message}`);
  const userAId = authA.user.id;

  const { data: authB, error: errB } = await userBClient.auth.signInWithPassword({ email: emailB, password });
  if (errB) throw new Error(`User B sign-in failed: ${errB.message}`);
  const userBId = authB.user.id;

  const { data: authC, error: errC } = await userCClient.auth.signInWithPassword({ email: emailC, password });
  if (errC) throw new Error(`User C sign-in failed: ${errC.message}`);
  const userCId = authC.user.id;

  console.log('✓ Successfully authenticated User A, User B, and User C (Outsider).\n');

  // Pre-cleanup any existing connection records between test users
  await userAClient.from('connections').delete().or(
    `and(requester_id.eq.${userAId},recipient_id.eq.${userBId}),and(requester_id.eq.${userBId},recipient_id.eq.${userAId})`
  );

  let passedTests = 0;
  let totalTests = 0;

  function recordResult(testName: string, passed: boolean, details: string) {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName}: ${details}`);
    }
  }

  // TEST 1: User A cannot connect to self
  {
    const { data, error } = await userAClient.from('connections').insert({
      requester_id: userAId,
      recipient_id: userAId,
      status: 'PENDING',
    }).select();

    const blocked = !!error || !data || data.length === 0;
    recordResult(
      'Test 1: Self-connection blocked',
      blocked,
      `Expected failure but received error: ${error?.message || 'none'}`
    );
  }

  // TEST 2: User A sends a legitimate request to User B
  let connectionId = '';
  {
    const { data, error } = await userAClient.from('connections').insert({
      requester_id: userAId,
      recipient_id: userBId,
      status: 'PENDING',
    }).select().single();

    const success = !error && data?.status === 'PENDING';
    if (data) connectionId = data.id;
    recordResult(
      'Test 2: User A sends pending request to User B',
      success,
      `Error: ${error?.message}`
    );
  }

  // TEST 3: Duplicate pending request (A -> B) is blocked
  {
    const { data, error } = await userAClient.from('connections').insert({
      requester_id: userAId,
      recipient_id: userBId,
      status: 'PENDING',
    }).select();

    const blocked = !!error || !data || data.length === 0;
    recordResult(
      'Test 3: Duplicate request from User A to User B blocked',
      blocked,
      `Expected constraint error, got: ${error?.message || 'none'}`
    );
  }

  // TEST 4: Reciprocal simultaneous request (B -> A) is blocked while PENDING
  {
    const { data, error } = await userBClient.from('connections').insert({
      requester_id: userBId,
      recipient_id: userAId,
      status: 'PENDING',
    }).select();

    const blocked = !!error || !data || data.length === 0;
    recordResult(
      'Test 4: Reciprocal request from User B to User A blocked by unique pair index',
      blocked,
      `Expected constraint error, got: ${error?.message || 'none'}`
    );
  }

  // TEST 5: User A cannot accept their own outgoing request
  {
    const { data, error } = await userAClient.from('connections').update({
      status: 'ACCEPTED',
    }).eq('id', connectionId).select();

    const blocked = !!error || !data || data.length === 0;
    recordResult(
      'Test 5: Requester User A cannot self-accept outgoing request',
      blocked,
      `Expected rejection, got: ${error?.message || 'none'}`
    );
  }

  // TEST 6: Outsider User C cannot view, accept, or mutate the pending request
  {
    const { data: readData, error: readErr } = await userCClient.from('connections').select().eq('id', connectionId);
    const readBlocked = (!readData || readData.length === 0);

    const { data: updateData, error: updateErr } = await userCClient.from('connections').update({
      status: 'ACCEPTED',
    }).eq('id', connectionId).select();
    const updateBlocked = !!updateErr || (!updateData || updateData.length === 0);

    const { data: delData, error: delErr } = await userCClient.from('connections').delete().eq('id', connectionId).select();
    const deleteBlocked = !!delErr || (!delData || delData.length === 0);

    recordResult(
      'Test 6: Outsider User C cannot view, update, or delete pending request',
      readBlocked && updateBlocked && deleteBlocked,
      `Read: ${readData?.length} rows, Update: ${updateData?.length} rows, Delete: ${delData?.length} rows`
    );
  }

  // TEST 7: Withdrawal of pending request by User A
  {
    const { data, error } = await userAClient.from('connections').delete().eq('id', connectionId).select();
    const success = !error && data && data.length > 0;
    recordResult(
      'Test 7: Requester User A can withdraw pending request',
      success,
      `Error: ${error?.message}`
    );
  }

  // TEST 8: Rejection workflow
  let rejectedConnId = '';
  {
    // Re-create request A -> B
    const { data: newReq } = await userAClient.from('connections').insert({
      requester_id: userAId,
      recipient_id: userBId,
      status: 'PENDING',
    }).select().single();

    rejectedConnId = newReq?.id || '';

    // User B rejects it
    const { data: rejectedData, error: rejectErr } = await userBClient.from('connections').update({
      status: 'REJECTED',
    }).eq('id', rejectedConnId).select().single();

    const success = !rejectErr && rejectedData?.status === 'REJECTED';
    recordResult(
      'Test 8: Recipient User B can reject incoming request',
      success,
      `Error: ${rejectErr?.message}`
    );
  }

  // TEST 9: Legitimate retry after rejection
  let retriedConnId = '';
  {
    // User A sends a new request to User B after rejection
    const { data: retriedReq, error: retryErr } = await userAClient.from('connections').insert({
      requester_id: userAId,
      recipient_id: userBId,
      status: 'PENDING',
    }).select().single();

    const success = !retryErr && retriedReq?.status === 'PENDING';
    if (retriedReq) retriedConnId = retriedReq.id;

    recordResult(
      'Test 9: User A can legitimately retry request after rejection (stale rejected row purged)',
      success,
      `Error: ${retryErr?.message}`
    );
  }

  // TEST 10: Recipient User B accepts request
  {
    const { data: acceptedData, error: acceptErr } = await userBClient.from('connections').update({
      status: 'ACCEPTED',
    }).eq('id', retriedConnId).select().single();

    const success = !acceptErr && acceptedData?.status === 'ACCEPTED';
    recordResult(
      'Test 10: Recipient User B accepts request',
      success,
      `Error: ${acceptErr?.message}`
    );
  }

  // TEST 11: Both User A and User B see accepted connection; Outsider User C does not
  {
    const { data: connA } = await userAClient.from('connections').select().eq('status', 'ACCEPTED').or(
      `requester_id.eq.${userAId},recipient_id.eq.${userAId}`
    );
    const { data: connB } = await userBClient.from('connections').select().eq('status', 'ACCEPTED').or(
      `requester_id.eq.${userBId},recipient_id.eq.${userBId}`
    );
    const { data: connC } = await userCClient.from('connections').select().eq('id', retriedConnId);

    const aSees = (connA || []).some(c => c.id === retriedConnId);
    const bSees = (connB || []).some(c => c.id === retriedConnId);
    const cDoesNotSee = !connC || connC.length === 0;

    recordResult(
      'Test 11: Both participants see accepted connection; outsider cannot see it',
      aSees && bSees && cDoesNotSee,
      `A sees: ${aSees}, B sees: ${bSees}, C isolated: ${cDoesNotSee}`
    );
  }

  // TEST 12: Either participant can remove accepted connection
  {
    const { data, error } = await userBClient.from('connections').delete().eq('id', retriedConnId).select();
    const success = !error && data && data.length > 0;

    const { data: checkA } = await userAClient.from('connections').select().eq('id', retriedConnId);
    const fullyRemoved = !checkA || checkA.length === 0;

    recordResult(
      'Test 12: Participant User B can remove accepted connection, removed for both',
      success && fullyRemoved,
      `Error: ${error?.message}, remaining: ${checkA?.length}`
    );
  }

  // Final cleanup of any lingering rows
  await userAClient.from('connections').delete().or(
    `and(requester_id.eq.${userAId},recipient_id.eq.${userBId}),and(requester_id.eq.${userBId},recipient_id.eq.${userAId})`
  );

  console.log(`\n==================================================`);
  console.log(`AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log(`==================================================`);
}

runSecurityAudit().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
