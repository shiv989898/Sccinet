import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
let envUrl = '';
let envKey = '';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const match = line.trim().match(/^([^=]+)=(.*)$/);
    if (match) {
      if (match[1].trim() === 'EXPO_PUBLIC_SUPABASE_URL') envUrl = match[2].trim();
      if (match[1].trim() === 'EXPO_PUBLIC_SUPABASE_ANON_KEY') envKey = match[2].trim();
    }
  }
}

const c = createClient(envUrl, envKey);

async function main() {
  const testEmail = `sccinet.audit.${Date.now()}@gmail.com`;
  const pwd = 'TestPassword123!Secure';

  console.log('Testing signUp with:', testEmail);
  const { data, error } = await c.auth.signUp({
    email: testEmail,
    password: pwd,
    options: {
      data: {
        full_name: 'Test Builder',
        username: `tb_${Date.now().toString().slice(-6)}`,
      },
    },
  });

  if (error) {
    console.error('SignUp Error:', error.message);
  } else {
    console.log('SignUp Success! User ID:', data.user?.id, 'Session active:', !!data.session);
    if (!data.session) {
      console.log('Notice: Email confirmation is enabled in this Supabase project (session is null).');
    }
  }
}

main().catch(console.error);
