import { supabase } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const accessToken = cookies['sb-access-token'];

    event.locals.currentUser = null;
    event.locals.currentRole = null;
    event.locals.currentName = null;

    if (accessToken) {
        const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
        if (userError) {
            console.error(userError.message);
        }

        if (userData.user) {
            const { data: profile, error: profileError } = await supabase
                .from('ck_person')
                .select('id, role, name')
                .eq('id', userData.user.id)
                .single();
            if (profileError) {
                console.error(profileError.message);
            } else {
                event.locals.currentUser = profile.id;
                event.locals.currentRole = profile.role;
                event.locals.currentName = profile.name;
            }
        }
    } else {
        console.log('No access token found.');
    }

    return resolve(event);
};
