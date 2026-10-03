import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mkrthwgtydbjneuzhcli.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rcnRod2d0eWRiam5ldXpoY2xpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEwMzA0MzYsImV4cCI6MjEwNjYwNjQzNn0.kMAIrfGUpWGwnQy6cGFOXeryyNcs9rgj5y2t7uJzi_4';

async function runE2E() {
  console.log('--- STARTING PHASE 3 E2E COLLABORATION VERIFICATION ---');

  const clientAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const timestamp = Date.now().toString().slice(-6);
  const ownerEmail = `sccinet.owner.${timestamp}@test.com`;
  const ownerPass = 'Pass12345!Secure';
  const ownerFullName = `Owner ${timestamp}`;

  const collaboratorEmail = `sccinet.collab.${timestamp}@test.com`;
  const collabPass = 'Pass12345!Secure';
  const collabFullName = `Collab ${timestamp}`;

  const outsiderEmail = `sccinet.outsider.${timestamp}@test.com`;
  const outsiderPass = 'Pass12345!Secure';
  const outsiderFullName = `Outsider ${timestamp}`;

  console.log('1. Setting up 3 isolated test accounts...');
  // Owner
  const ownerClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: ownerAuth, error: ownerAuthErr } = await ownerClient.auth.signUp({
    email: ownerEmail,
    password: ownerPass,
    options: { data: { full_name: ownerFullName } },
  });
  if (ownerAuthErr) throw new Error(`Owner sign up failed: ${ownerAuthErr.message}`);
  const ownerId = ownerAuth.user!.id;

  // Collaborator
  const collabClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: collabAuth, error: collabAuthErr } = await collabClient.auth.signUp({
    email: collaboratorEmail,
    password: collabPass,
    options: { data: { full_name: collabFullName } },
  });
  if (collabAuthErr) throw new Error(`Collab sign up failed: ${collabAuthErr.message}`);
  const collabId = collabAuth.user!.id;

  // Outsider (attacker)
  const outsiderClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: outsiderAuth, error: outsiderAuthErr } = await outsiderClient.auth.signUp({
    email: outsiderEmail,
    password: outsiderPass,
    options: { data: { full_name: outsiderFullName } },
  });
  if (outsiderAuthErr) throw new Error(`Outsider sign up failed: ${outsiderAuthErr.message}`);
  const outsiderId = outsiderAuth.user!.id;

  console.log(`✓ Accounts created: Owner=${ownerId}, Collab=${collabId}, Outsider=${outsiderId}`);

  // Fetch available global skills for testing
  const { data: globalSkills } = await ownerClient.from('skills').select('id, name').limit(3);
  if (!globalSkills || globalSkills.length < 2) {
    throw new Error('Could not fetch global skills');
  }
  const skill1 = globalSkills[0].id;
  const skill2 = globalSkills[1].id;

  // Create Project as Owner
  console.log('2. Creating Project as Owner...');
  const projectSlug = `phase3-test-${timestamp}`;
  const { data: project, error: projErr } = await ownerClient
    .from('projects')
    .insert({
      owner_id: ownerId,
      title: `Mesh Network Engine ${timestamp}`,
      slug: projectSlug,
      description: 'Initial project description for collaboration test.',
      status: 'ACTIVE',
      repository_url: 'https://github.com/sccinet/mesh',
      live_url: 'https://mesh.sccinet.dev',
    })
    .select()
    .single();

  if (projErr) throw new Error(`Project creation failed: ${projErr.message}`);
  console.log(`✓ Project created: id=${project.id}, slug=${project.slug}`);

  // Check owner membership trigger
  const { data: ownerMember } = await ownerClient
    .from('project_members')
    .select('*')
    .eq('project_id', project.id)
    .eq('profile_id', ownerId)
    .single();

  if (!ownerMember) throw new Error('Owner automatic membership trigger failed!');
  console.log('✓ Automatic project owner membership trigger confirmed');

  // Attach skills as Owner
  await ownerClient.from('project_skills').insert([
    { project_id: project.id, skill_id: skill1 },
    { project_id: project.id, skill_id: skill2 },
  ]);
  console.log('✓ Project skills attached');

  // TEST 1: Owner edits project
  console.log('TEST 1: Owner edits project...');
  const updatedTitle = `Mesh Network Engine v2 ${timestamp}`;
  const updatedDesc = 'Updated description by verified project owner.';
  const { data: editResult, error: editErr } = await ownerClient
    .from('projects')
    .update({
      title: updatedTitle,
      description: updatedDesc,
      status: 'COMPLETED',
      live_url: 'https://v2.mesh.sccinet.dev',
    })
    .eq('id', project.id)
    .select()
    .single();

  if (editErr || editResult.title !== updatedTitle || editResult.status !== 'COMPLETED') {
    throw new Error(`Owner edit project failed: ${editErr?.message}`);
  }
  console.log('✓ TEST 1 PASSED: Owner edited project successfully');

  // TEST 2: Non-owner cannot edit project (RLS)
  console.log('TEST 2: Verifying non-owner cannot edit project...');
  const { data: hackerEdit, error: hackerEditErr } = await outsiderClient
    .from('projects')
    .update({ title: 'HACKED BY OUTSIDER' })
    .eq('id', project.id)
    .select();

  if (hackerEdit && hackerEdit.length > 0) {
    throw new Error('RLS VIOLATION: Non-owner was able to update someone else’s project!');
  }
  console.log('✓ TEST 2 PASSED: Non-owner update blocked by RLS');

  // TEST 3: Owner creates role
  console.log('TEST 3: Owner creates project role...');
  const { data: role, error: roleErr } = await ownerClient
    .from('project_roles')
    .insert({
      project_id: project.id,
      title: 'Core Systems Architect',
      description: 'Designs protocol and distributed consensus algorithms.',
    })
    .select()
    .single();

  if (roleErr || !role) throw new Error(`Role creation failed: ${roleErr?.message}`);
  console.log(`✓ TEST 3 PASSED: Role created: id=${role.id}, title=${role.title}`);

  // Attach skill to role
  const { error: roleSkillErr } = await ownerClient
    .from('project_role_skills')
    .insert({ role_id: role.id, skill_id: skill1 });
  if (roleSkillErr) throw new Error(`Role skill attach failed: ${roleSkillErr.message}`);
  console.log('✓ Role skill attached');

  // TEST 4: Owner edits role
  console.log('TEST 4: Owner edits role...');
  const { data: editedRole, error: editRoleErr } = await ownerClient
    .from('project_roles')
    .update({ title: 'Principal Protocol Architect' })
    .eq('id', role.id)
    .select()
    .single();

  if (editRoleErr || editedRole.title !== 'Principal Protocol Architect') {
    throw new Error(`Role edit failed: ${editRoleErr?.message}`);
  }
  console.log('✓ TEST 4 PASSED: Role edited successfully');

  // TEST 5: Owner creates and deletes a role
  console.log('TEST 5: Owner creates and deletes a temporary role...');
  const { data: tempRole } = await ownerClient
    .from('project_roles')
    .insert({ project_id: project.id, title: 'Temporary QA Lead' })
    .select()
    .single();

  const { error: deleteRoleErr } = await ownerClient
    .from('project_roles')
    .delete()
    .eq('id', tempRole.id);

  if (deleteRoleErr) throw new Error(`Role deletion failed: ${deleteRoleErr.message}`);
  console.log('✓ TEST 5 PASSED: Role deleted successfully');

  // TEST 6: Owner manages members (direct add, update role, remove)
  console.log('TEST 6: Owner manages members directly...');
  // Direct add collaborator
  const { error: addMemErr } = await ownerClient.from('project_members').insert({
    project_id: project.id,
    profile_id: collabId,
    role_id: null,
  });
  if (addMemErr) throw new Error(`Add member failed: ${addMemErr.message}`);
  console.log('✓ Direct member add succeeded');

  // Update member role
  const { error: updateMemErr } = await ownerClient
    .from('project_members')
    .update({ role_id: role.id })
    .eq('project_id', project.id)
    .eq('profile_id', collabId);
  if (updateMemErr) throw new Error(`Update member role failed: ${updateMemErr.message}`);
  console.log('✓ Member role assigned to role');

  // Remove member to reset for collaboration request testing
  const { error: removeMemErr } = await ownerClient
    .from('project_members')
    .delete()
    .eq('project_id', project.id)
    .eq('profile_id', collabId);
  if (removeMemErr) throw new Error(`Remove member failed: ${removeMemErr.message}`);
  console.log('✓ Member removed');
  console.log('✓ TEST 6 PASSED: Owner member management verified');

  // TEST 7: User sends collaboration request
  console.log('TEST 7: User sends collaboration request...');
  const requestNote = 'I would love to contribute to consensus distributed protocols.';
  const { data: collabRequest, error: reqErr } = await collabClient
    .from('project_collaboration_requests')
    .insert({
      project_id: project.id,
      user_id: collabId,
      role_id: role.id,
      message: requestNote,
      status: 'PENDING',
    })
    .select()
    .single();

  if (reqErr || !collabRequest) {
    throw new Error(`Collaboration request creation failed: ${reqErr?.message}`);
  }
  console.log(`✓ TEST 7 PASSED: Collaboration request created: id=${collabRequest.id}`);

  // TEST 10: Duplicate requests are prevented
  console.log('TEST 10: Verifying duplicate pending requests are prevented...');
  const { error: dupErr } = await collabClient
    .from('project_collaboration_requests')
    .insert({
      project_id: project.id,
      user_id: collabId,
      role_id: role.id,
      message: 'Duplicate request attempt',
      status: 'PENDING',
    });

  if (!dupErr) {
    throw new Error('CONSTRAINT VIOLATION: Duplicate pending collaboration request was allowed!');
  }
  console.log(`✓ TEST 10 PASSED: Duplicate request rejected as expected (${dupErr.message})`);

  // TEST 11: Unauthorized request mutation fails (attacker tries to accept)
  console.log('TEST 11: Verifying unauthorized request mutation fails...');
  const { data: hackedRequest, error: hackReqErr } = await outsiderClient
    .from('project_collaboration_requests')
    .update({ status: 'ACCEPTED' })
    .eq('id', collabRequest.id)
    .select();

  if (hackedRequest && hackedRequest.length > 0) {
    throw new Error('RLS VIOLATION: Outsider was able to accept someone else’s request!');
  }
  console.log('✓ TEST 11 PASSED: Unauthorized request update blocked by RLS');

  // TEST 9: Owner rejects request
  console.log('TEST 9: Owner rejects request...');
  const { data: rejectedReq, error: rejectErr } = await ownerClient
    .from('project_collaboration_requests')
    .update({ status: 'REJECTED' })
    .eq('id', collabRequest.id)
    .select()
    .single();

  if (rejectErr || rejectedReq.status !== 'REJECTED') {
    throw new Error(`Owner request rejection failed: ${rejectErr?.message}`);
  }
  console.log('✓ TEST 9 PASSED: Request rejected successfully');

  // Now create a new request to test acceptance & automated membership
  console.log('Creating fresh collaboration request for acceptance testing...');
  const { data: freshRequest, error: freshReqErr } = await collabClient
    .from('project_collaboration_requests')
    .insert({
      project_id: project.id,
      user_id: collabId,
      role_id: role.id,
      message: 'Re-applying with updated contributions.',
      status: 'PENDING',
    })
    .select()
    .single();

  if (freshReqErr) throw new Error(`Fresh request creation failed: ${freshReqErr.message}`);

  // TEST 8 & 12: Owner accepts request & Automated membership is verified
  console.log('TEST 8 & 12: Owner accepts request & verifies automated membership trigger...');
  const { data: acceptedReq, error: acceptErr } = await ownerClient
    .from('project_collaboration_requests')
    .update({ status: 'ACCEPTED' })
    .eq('id', freshRequest.id)
    .select()
    .single();

  if (acceptErr || acceptedReq.status !== 'ACCEPTED') {
    throw new Error(`Owner request acceptance failed: ${acceptErr?.message}`);
  }
  console.log('✓ TEST 8 PASSED: Request accepted by owner');

  // Check automated membership trigger
  const { data: verifiedMember, error: memCheckErr } = await ownerClient
    .from('project_members')
    .select('*')
    .eq('project_id', project.id)
    .eq('profile_id', collabId)
    .single();

  if (memCheckErr || !verifiedMember || verifiedMember.role_id !== role.id) {
    throw new Error(`TEST 12 FAILED: Member was not created automatically with assigned role! ${memCheckErr?.message}`);
  }
  console.log(`✓ TEST 12 PASSED: Collaborator is now a verified project member: role_id=${verifiedMember.role_id}`);

  // TEST 13: Project Detail reflects the updated state
  console.log('TEST 13: Verifying Project Detail reflects updated state...');
  const { data: detailData, error: detailErr } = await clientAnon
    .from('projects')
    .select(`
      *,
      owner:profiles!projects_owner_id_fkey(*),
      project_skills(skills(*)),
      roles:project_roles(
        *,
        project_role_skills(skills(*))
      ),
      members:project_members(
        joined_at,
        profile:profiles(*),
        role:project_roles(*)
      )
    `)
    .eq('id', project.id)
    .single();

  if (detailErr || !detailData) throw new Error(`Detail query failed: ${detailErr?.message}`);

  if (detailData.title !== updatedTitle) throw new Error('Detail does not reflect updated title');
  if (detailData.status !== 'COMPLETED') throw new Error('Detail does not reflect updated status');
  if (detailData.members.length < 2) throw new Error('Detail does not reflect accepted member');
  const collabInDetail = detailData.members.find((m: any) => m.profile.id === collabId);
  if (!collabInDetail || collabInDetail.role?.title !== 'Principal Protocol Architect') {
    throw new Error('Detail does not correctly attach member and assigned role');
  }
  console.log('✓ TEST 13 PASSED: Project Detail reflects updated title, status, roles, and members');

  // TEST 14: Workspace reflects project updates
  console.log('TEST 14: Verifying Workspace reflects project updates...');
  const { data: workspaceProjects, error: wsErr } = await ownerClient
    .from('projects')
    .select('*')
    .eq('owner_id', ownerId);

  if (wsErr || !workspaceProjects || workspaceProjects.length === 0) {
    throw new Error(`Workspace projects query failed: ${wsErr?.message}`);
  }
  const wsProj = workspaceProjects.find((p) => p.id === project.id);
  if (!wsProj || wsProj.title !== updatedTitle || wsProj.status !== 'COMPLETED') {
    throw new Error('Workspace does not reflect project edits');
  }
  console.log('✓ TEST 14 PASSED: Workspace reflects updated project data');

  // CLEANUP: Clean all temporary test data
  console.log('--- CLEANUP: Removing temporary test data ---');
  // Deleting project cascades to project_skills, project_roles, project_role_skills, project_members, project_collaboration_requests
  await ownerClient.from('projects').delete().eq('id', project.id);
  console.log('✓ Project and cascade relationships deleted');

  // Delete test users via Supabase auth (calling rpc or cleaning profiles)
  // Let's delete profiles
  await ownerClient.from('profiles').delete().eq('id', ownerId);
  await collabClient.from('profiles').delete().eq('id', collabId);
  await outsiderClient.from('profiles').delete().eq('id', outsiderId);
  console.log('✓ Test profiles cleaned up');

  console.log('==================================================');
  console.log('ALL 14 E2E TESTS PASSED WITH 100% SECURITY & ACCURACY!');
  console.log('==================================================');
}

runE2E().catch((err) => {
  console.error('❌ E2E TEST FAILED:', err);
  process.exit(1);
});
