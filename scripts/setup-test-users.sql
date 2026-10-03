-- Clean up any existing test accounts
DELETE FROM auth.users 
WHERE email IN (
    'sccinet.owner.test@gmail.com',
    'sccinet.collab.test@gmail.com',
    'sccinet.outsider.test@gmail.com'
);

-- Define helper variables and insert test accounts with exact Supabase GoTrue schema
DO $$
DECLARE
    owner_uid UUID := gen_random_uuid();
    collab_uid UUID := gen_random_uuid();
    outsider_uid UUID := gen_random_uuid();
    hashed_pwd TEXT := extensions.crypt('Pass12345!Secure', extensions.gen_salt('bf'));
BEGIN
    -- 1. Owner
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, confirmed_at, confirmation_token,
        is_anonymous, is_sso_user,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', owner_uid, 'authenticated', 'authenticated',
        'sccinet.owner.test@gmail.com', hashed_pwd,
        now(), now(), '',
        false, false,
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('sub', owner_uid, 'email', 'sccinet.owner.test@gmail.com', 'full_name', 'Alex Owner', 'email_verified', true),
        now(), now()
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, provider, identity_data, email,
        last_sign_in_at, created_at, updated_at
    ) VALUES (
        owner_uid, owner_uid, owner_uid::text, 'email',
        jsonb_build_object('sub', owner_uid, 'email', 'sccinet.owner.test@gmail.com', 'full_name', 'Alex Owner', 'email_verified', true),
        'sccinet.owner.test@gmail.com', now(), now(), now()
    );

    -- 2. Collaborator
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, confirmed_at, confirmation_token,
        is_anonymous, is_sso_user,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', collab_uid, 'authenticated', 'authenticated',
        'sccinet.collab.test@gmail.com', hashed_pwd,
        now(), now(), '',
        false, false,
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('sub', collab_uid, 'email', 'sccinet.collab.test@gmail.com', 'full_name', 'Devin Collaborator', 'email_verified', true),
        now(), now()
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, provider, identity_data, email,
        last_sign_in_at, created_at, updated_at
    ) VALUES (
        collab_uid, collab_uid, collab_uid::text, 'email',
        jsonb_build_object('sub', collab_uid, 'email', 'sccinet.collab.test@gmail.com', 'full_name', 'Devin Collaborator', 'email_verified', true),
        'sccinet.collab.test@gmail.com', now(), now(), now()
    );

    -- 3. Outsider
    INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, confirmed_at, confirmation_token,
        is_anonymous, is_sso_user,
        raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at
    ) VALUES (
        '00000000-0000-0000-0000-000000000000', outsider_uid, 'authenticated', 'authenticated',
        'sccinet.outsider.test@gmail.com', hashed_pwd,
        now(), now(), '',
        false, false,
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('sub', outsider_uid, 'email', 'sccinet.outsider.test@gmail.com', 'full_name', 'Outsider Attacker', 'email_verified', true),
        now(), now()
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, provider, identity_data, email,
        last_sign_in_at, created_at, updated_at
    ) VALUES (
        outsider_uid, outsider_uid, outsider_uid::text, 'email',
        jsonb_build_object('sub', outsider_uid, 'email', 'sccinet.outsider.test@gmail.com', 'full_name', 'Outsider Attacker', 'email_verified', true),
        'sccinet.outsider.test@gmail.com', now(), now(), now()
    );
END $$;

-- Verify
SELECT u.id, u.email, p.username, p.full_name 
FROM auth.users u
JOIN public.profiles p ON p.id = u.id
WHERE u.email IN (
    'sccinet.owner.test@gmail.com',
    'sccinet.collab.test@gmail.com',
    'sccinet.outsider.test@gmail.com'
);
