import { supabase } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
    // console.log('HANDLE: Initializing');

    // Parse cookies from the request
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const accessToken = cookies['sb-access-token'];
    // console.log('Access Token:', accessToken);

    if (accessToken) {
        try {
            // Validate the access token and fetch the user
            const { data: user, error } = await supabase.auth.getUser(accessToken);

            if (error) {
                console.error('Error fetching user:', error.message);
                event.locals.currentUser = null;
                event.locals.currentRole = null;
                event.locals.currentName = null;
            } else if (user?.user) {

                // Fetch additional user details from your database

                const { data: profile, error: profileError } = await supabase
                    .from('ck_person')
                    .select('id, role, name')
                    .eq('id', user.user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching profile:', profileError.message);
                    event.locals.currentUser = null;
                    event.locals.currentRole = null;
                    event.locals.currentName = null;
                } else {
                    event.locals.currentUser = profile.id;
                    event.locals.currentRole = profile.role;
                    event.locals.currentName = profile.name;
                    console.log('User Profile:', profile);
                }
            }
        } catch (err) {
            console.error('Unexpected error during user fetch:', err);
            event.locals.currentUser = null;
            event.locals.currentRole = null;
            event.locals.currentName = null;
        }
    } else {
        console.log('No access token found.');
        event.locals.currentUser = null;
        event.locals.currentRole = null;
        event.locals.currentName = null;
    }

    return resolve(event);
};
