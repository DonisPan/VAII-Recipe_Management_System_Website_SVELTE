import {supabase} from "$lib/supabase";
import {json} from "@sveltejs/kit";

export async function POST({ locals, cookies }) {
    await supabase.auth.signOut();
    locals.currentUser = null;
    locals.currentRole = null;
    locals.currentName = null;

    cookies.delete('sb-access-token', { path: '/' });

    return json({success: true, message: 'User logged out.' });
}