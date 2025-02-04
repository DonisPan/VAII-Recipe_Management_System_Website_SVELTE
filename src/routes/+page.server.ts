import { supabase } from '$lib/supabase';
import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/$types";

export const load: PageServerLoad = async (): Promise<any> => {

    console.group('Load Main Page');

    const { data: recipeData, error: recipeError } = await supabase
        .from('ck_recipe')
        .select('id, name, image, difficulty');
    if (recipeError) {
        console.error(recipeError.message);
        console.groupEnd();
        return {
            recipes: [],
        };
    }

    console.log('Recipe data loaded.');

    const urls = recipeData.map((recipe) => {
        const { data } = supabase.storage.from('images').getPublicUrl(recipe.image);
        return { id: recipe.id, image: data.publicUrl };
    });

    console.log('Recipe images loaded.');

    const recipes = recipeData.map((recipe) => {
        const urlObj = urls.find((url) => url.id === recipe.id); // Match by ID
        return {
            id: BigInt(recipe.id),
            name: recipe.name,
            image: urlObj?.image || '/images/default-image.jpg',
            difficulty: recipe.difficulty,
        };
    });

    console.log('Recipe data combined.');
    console.log('Page loaded.');
    console.groupEnd();

    return {recipes};
};
