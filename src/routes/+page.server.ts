import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (): Promise<any> => {
    try {
        const { data, error } = await supabase.from('ck_recipe').select('id');

        if (error) {
            console.error('Error fetching recipes:', error.message);
            return {
                recipes: [],
            };
        }

        const recipes = data.map((recipe) => ({
            id: BigInt(recipe.id),
        }));

        return {
            recipes,
        };
    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            recipes: [],
        };
    }
};
