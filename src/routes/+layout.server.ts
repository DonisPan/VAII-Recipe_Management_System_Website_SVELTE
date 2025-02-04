import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }): Promise<any> => {

    const { currentName, currentRole } = locals;

    console.log('Loaded layout data.');

    return {
        user: {
            id: currentName ?? '',
            role: currentRole ?? '',
        }
    };
};