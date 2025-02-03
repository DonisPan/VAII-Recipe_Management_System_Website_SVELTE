import { supabase } from '$lib/supabase';
import type {PageServerLoad} from "../../../.svelte-kit/types/src/routes/$types";

export const load: PageServerLoad = async ({locals}): Promise<any> => {
    const currentUser = locals.currentUser;
    try {

        const { data: favouriteData, error:favouriteError } = await supabase
            .from('ck_user_favourites')
            .select('recipe_id, liked_at')
            .eq('user_id', currentUser);

        if (favouriteError) {
            console.error('Error fetching favourite recipes:', favouriteError.message);
            return {
                recipes: [],
            };
        }

        const favoriteRecipes = favouriteData?.map(fav => ({
            recipe_id: fav.recipe_id,
            liked_at: fav.liked_at,
        })) || [];

        const recipeIds = favoriteRecipes.map(fav => fav.recipe_id);

        const { data: recipeData, error:recipeError } = await supabase
            .from('ck_recipe')
            .select('id, name, image, difficulty')
            .in('id', recipeIds);

        if (recipeError) {
            console.error('Error fetching recipes:', recipeError.message);
            return {
                recipes: [],
            };
        }

        const urls = recipeData.map((recipe) => {
            const { data } = supabase.storage.from('images').getPublicUrl(recipe.image);
            return { id: recipe.id, image: data.publicUrl };
        });

        const recipes = recipeData.map((recipe) => {
            const urlObj = urls.find((url) => url.id === recipe.id); // Match by ID
            const favData = favoriteRecipes.find(fav => fav.recipe_id === recipe.id); // Match liked_at
            return {
                id: BigInt(recipe.id),
                name: recipe.name,
                image: urlObj?.image || '/images/default-image.jpg',
                difficulty: recipe.difficulty,
                liked_at: favData?.liked_at || null,
            };
        });
        return {recipes};

    } catch (err) {
        console.error('Unexpected error:', err);
        return {
            recipes: [],
        };
    }
};
