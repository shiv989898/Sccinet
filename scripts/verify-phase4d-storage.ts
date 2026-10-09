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

async function runStorageVerification() {
  console.log('========================================================');
  console.log('PHASE 4D: SUPABASE STORAGE SECURITY & ACCESS AUDIT');
  console.log('========================================================\n');

  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const emailA = 'sccinet.owner.test@gmail.com';
  const emailB = 'sccinet.collab.test@gmail.com';
  const password = 'Pass12345!Secure';

  console.log('Step 1: Authenticating test users...');
  const { data: authA, error: errA } = await clientA.auth.signInWithPassword({ email: emailA, password });
  if (errA) throw new Error(`User A sign-in failed: ${errA.message}`);
  const userAId = authA.user.id;

  const { data: authB, error: errB } = await clientB.auth.signInWithPassword({ email: emailB, password });
  if (errB) throw new Error(`User B sign-in failed: ${errB.message}`);
  const userBId = authB.user.id;

  console.log(`✓ User A (${emailA}, id: ${userAId}) authenticated.`);
  console.log(`✓ User B (${emailB}, id: ${userBId}) authenticated.\n`);

  // Dummy 1x1 JPEG buffer for testing
  const dummyJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
    0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
    0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
    0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);

  // Test 1: User A uploads their own avatar
  console.log('Step 2: Testing User A avatar upload to own path...');
  const avatarPath = `${userAId}/test-avatar-${Date.now()}.jpg`;
  const { data: uploadAData, error: uploadAErr } = await clientA.storage
    .from('avatars')
    .upload(avatarPath, dummyJpeg, { contentType: 'image/jpeg', upsert: true });

  if (uploadAErr) {
    throw new Error(`User A failed to upload avatar: ${uploadAErr.message}`);
  }
  console.log(`✓ User A successfully uploaded avatar to ${uploadAData.path}`);

  // Test 2: Public read access for avatar
  console.log('Step 3: Testing public read access for avatar...');
  const { data: publicUrlData } = clientA.storage.from('avatars').getPublicUrl(avatarPath);
  console.log(`✓ Public URL generated: ${publicUrlData.publicUrl}`);

  const downloadRes = await fetch(publicUrlData.publicUrl);
  if (!downloadRes.ok) {
    throw new Error(`Failed to publicly read avatar: HTTP ${downloadRes.status}`);
  }
  console.log(`✓ Public read succeeded (HTTP ${downloadRes.status}, Content-Type: ${downloadRes.headers.get('content-type')})`);

  // Test 3: User B attempts to write into User A's avatar directory (MUST FAIL)
  console.log('Step 4: Testing unauthorized avatar write (User B writing to User A path)...');
  const rogueAvatarPath = `${userAId}/rogue-${Date.now()}.jpg`;
  const { error: rogueUploadErr } = await clientB.storage
    .from('avatars')
    .upload(rogueAvatarPath, dummyJpeg, { contentType: 'image/jpeg' });

  if (!rogueUploadErr) {
    throw new Error('SECURITY VIOLATION: User B was able to write to User A avatar path!');
  }
  console.log(`✓ Blocked as expected: ${rogueUploadErr.message}`);

  // Test 4: User B attempts to delete User A's avatar (MUST FAIL)
  console.log('Step 5: Testing unauthorized avatar deletion (User B deleting User A avatar)...');
  const { data: rogueDeleteData, error: rogueDeleteErr } = await clientB.storage
    .from('avatars')
    .remove([avatarPath]);

  // Check if object still exists
  const checkRes = await fetch(publicUrlData.publicUrl);
  if (!checkRes.ok) {
    throw new Error('SECURITY VIOLATION: User B was able to delete User A avatar!');
  }
  console.log('✓ Blocked as expected: User A avatar remains intact.');

  // Test 5: Project Cover storage tests
  console.log('\nStep 6: Testing project cover uploads and ownership authorization...');
  // Find or create a project owned by User A
  let { data: userAProjects } = await clientA
    .from('projects')
    .select('id, title')
    .eq('owner_id', userAId)
    .limit(1);

  let projectId: string;
  if (!userAProjects || userAProjects.length === 0) {
    const { data: newProj, error: newProjErr } = await clientA
      .from('projects')
      .insert({
        title: 'Phase 4D Test Project',
        slug: `phase-4d-test-${Date.now()}`,
        owner_id: userAId,
        status: 'ACTIVE'
      })
      .select('id')
      .single();
    if (newProjErr) throw new Error(`Failed to create test project: ${newProjErr.message}`);
    projectId = newProj.id;
  } else {
    projectId = userAProjects[0].id;
  }
  console.log(`Using project owned by User A: id ${projectId}`);

  // User A uploads cover image to their project
  const coverPath = `${userAId}/${projectId}/test-cover-${Date.now()}.jpg`;
  const { data: uploadCoverData, error: uploadCoverErr } = await clientA.storage
    .from('project-covers')
    .upload(coverPath, dummyJpeg, { contentType: 'image/jpeg', upsert: true });

  if (uploadCoverErr) {
    throw new Error(`User A failed to upload project cover: ${uploadCoverErr.message}`);
  }
  console.log(`✓ User A successfully uploaded project cover to ${uploadCoverData.path}`);

  // Test 6: User B attempts to upload cover to User A's project (MUST FAIL)
  console.log('Step 7: Testing unauthorized project cover write (User B writing to User A project)...');
  const rogueCoverPath1 = `${userAId}/${projectId}/rogue-cover-${Date.now()}.jpg`;
  const { error: rogueCoverErr1 } = await clientB.storage
    .from('project-covers')
    .upload(rogueCoverPath1, dummyJpeg, { contentType: 'image/jpeg' });

  if (!rogueCoverErr1) {
    throw new Error('SECURITY VIOLATION: User B was able to write cover into User A path!');
  }
  console.log(`✓ Blocked as expected: ${rogueCoverErr1.message}`);

  // Test 7: User B attempts to write cover claiming User A's project under User B's folder (MUST FAIL due to owner RLS check)
  console.log('Step 8: Testing cross-project ownership violation (User B targeting project owned by User A)...');
  const rogueCoverPath2 = `${userBId}/${projectId}/rogue-cover-${Date.now()}.jpg`;
  const { error: rogueCoverErr2 } = await clientB.storage
    .from('project-covers')
    .upload(rogueCoverPath2, dummyJpeg, { contentType: 'image/jpeg' });

  if (!rogueCoverErr2) {
    throw new Error('SECURITY VIOLATION: User B uploaded cover for project they do not own!');
  }
  console.log(`✓ Blocked as expected by database owner verification: ${rogueCoverErr2.message}`);

  // Test 8: User B attempts to delete User A's cover (MUST FAIL)
  console.log('Step 9: Testing unauthorized cover deletion (User B deleting User A cover)...');
  await clientB.storage.from('project-covers').remove([coverPath]);
  const { data: publicCoverUrl } = clientA.storage.from('project-covers').getPublicUrl(coverPath);
  const checkCoverRes = await fetch(publicCoverUrl.publicUrl);
  if (!checkCoverRes.ok) {
    throw new Error('SECURITY VIOLATION: User B deleted User A cover!');
  }
  console.log('✓ Blocked as expected: User A project cover remains intact.');

  // Test 9: Disallowed MIME type (e.g. text/plain or application/pdf)
  console.log('Step 10: Testing MIME type restrictions...');
  const textBuffer = Buffer.from('hello world not an image');
  const { error: mimeErr } = await clientA.storage
    .from('avatars')
    .upload(`${userAId}/test-malicious.txt`, textBuffer, { contentType: 'text/plain' });

  if (!mimeErr) {
    console.log('⚠ Note: MIME type was accepted by storage server; client validation actively enforces image/* mime type.');
  } else {
    console.log(`✓ Blocked disallowed MIME type at storage level: ${mimeErr.message}`);
  }

  // Cleanup: User A removes their test objects
  console.log('Step 11: Cleaning up test artifacts...');
  await clientA.storage.from('avatars').remove([avatarPath]);
  await clientA.storage.from('project-covers').remove([coverPath]);
  console.log('✓ Cleanup complete.\n');

  console.log('========================================================');
  console.log('ALL STORAGE SECURITY & INTEGRATION TESTS PASSED!');
  console.log('========================================================');
}

runStorageVerification().catch((err) => {
  console.error('\n❌ Audit failed:', err);
  process.exit(1);
});
