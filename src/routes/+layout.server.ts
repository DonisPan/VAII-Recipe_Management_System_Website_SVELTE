import type { LayoutServerLoad } from './$types';
import {supabase} from "$lib/supabase";

export const load: LayoutServerLoad = async ({ locals }): Promise<any> => {
    const logout = false;
    if (logout) {
        await supabase.auth.signOut();
        locals.currentUser = null;
        locals.currentRole = null;
        locals.currentName = null;
    }

    const { currentName, currentRole } = locals;

    return {
        user: {
            id: currentName ?? '',
            role: currentRole ?? '',
        }
    };
};