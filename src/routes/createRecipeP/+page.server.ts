import { supabase } from '$lib/supabase';
import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async ({locals}): Promise<any> => {
    let currentRole = locals.currentRole;

    if (!currentRole) {
        return { categories: [], ingredients: [], currentRole: currentRole };
    }

    console.group('Load Create Recipe Page Data');

    const { data: categories, error: categoriesError } = await supabase
        .from('ck_category')
        .select('id, name, description');
    if (categoriesError) {
        console.error(categoriesError.message);
        console.groupEnd();
        return { categories: [], ingredients: [], currentRole: currentRole };
    }

    const { data: ingredients, error: ingredientsError } = await supabase
        .from('ck_ingredient')
        .select('id, name, units');
    if (ingredientsError) {
        console.error(ingredientsError.message);
        console.groupEnd();
        return { categories, ingredients: [], currentRole: currentRole };
    }

    console.log('Data loaded.');
    console.groupEnd();
    return { categories, ingredients, currentRole: currentRole };
};
