import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }): Promise<any> => {
    // const {session} = await supabase.

    const { currentName, currentRole } = locals;

    return {
        user: {
            id: currentName ?? '',
            role: currentRole ?? '',
        }
    };
};