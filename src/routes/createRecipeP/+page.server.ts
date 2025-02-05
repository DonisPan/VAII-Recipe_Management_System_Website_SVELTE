import { supabase } from '$lib/supabase';
import type {PageServerLoad} from './$types';
import {goto} from "$app/navigation";

export const load: PageServerLoad = async ({locals}): Promise<any> => {
    let currentUser = locals.currentUser;

    if (!currentUser) {
        await goto('/');
    }

    console.group('Load Create Recipe Page Data');

    const { data: categories, error: categoriesError } = await supabase
        .from('ck_category')
        .select('id, name, description');
    if (categoriesError) {
        console.error(categoriesError.message);
        console.groupEnd();
        return { categories: [] };
    }

    const { data: ingredients, error: ingredientsError } = await supabase
        .from('ck_ingredient')
        .select('id, name, units');
    if (ingredientsError) {
        console.error(ingredientsError.message);
        console.groupEnd();
        return { categories, ingredients: [] };
    }

    console.log('Data loaded.');
    console.groupEnd();
    return { categories, ingredients };
};
