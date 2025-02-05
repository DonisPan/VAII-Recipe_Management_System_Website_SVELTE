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
        return { recipes: [] };
    }

    console.log('Recipe data loaded.');

    const urls = recipeData.map((recipe) => {
        const { data } = supabase.storage.from('images').getPublicUrl(recipe.image);
        return { id: recipe.id, image: data.publicUrl };
    });

    console.log('Recipe images loaded.');

    const { data: recipeCategories, error: recipeCategoryError } = await supabase
        .from('ck_recipe_categories')
        .select('recipe_id, category_id');
    if (recipeCategoryError) {
        console.error(recipeCategoryError.message);
        console.groupEnd();
        return { recipes: [] };
    }

    const { data: categoryData, error: categoryError } = await supabase
        .from('ck_category')
        .select('id, name');
    if (categoryError) {
        console.error(categoryError.message);
        console.groupEnd();
        return { recipes: [] };
    }
    const categoryMap = new Map(categoryData.map(cat => [cat.id, cat.name]));

    console.log('Recipe categories loaded.');

    const recipes = recipeData.map((recipe) => {
        const urlObj = urls.find((url) => url.id === recipe.id);
        const categories = recipeCategories
            .filter((rc) => rc.recipe_id === recipe.id)
            .map((rc) => categoryMap.get(rc.category_id) || 'Unknown');
        return {
            id: BigInt(recipe.id),
            name: recipe.name,
            image: urlObj?.image || '/images/default-image.jpg',
            difficulty: recipe.difficulty,
            categories: categories,
        };
    });

    console.log('Recipe data combined.');
    console.log('Page loaded.');
    console.groupEnd();

    return {recipes};
};
