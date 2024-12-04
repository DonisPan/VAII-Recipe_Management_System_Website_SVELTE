import { supabase } from '$lib/supabase';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Retrieve session from Supabase
    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session) {
    console.log('got here handle ' + sessionData.session.user.id)
        // Fetch user data from Supabase
        const { data: profile, error } = await supabase
            .from('ck_person')
            .select('id, role')
            .eq('id', sessionData.session.user.id)
            .single();

        if (!error && profile) {
            event.locals.currentUser = profile.id;
            event.locals.currentRole = profile.role;
        } else {
            event.locals.currentUser = 'none';
            event.locals.currentRole = 'none';
        }
    } else {
        event.locals.currentUser = 'none';
        event.locals.currentRole = 'none';
    }

    return resolve(event);
};
