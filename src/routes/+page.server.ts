import { supabase } from '$lib/supabase';
import type {PageServerLoad} from "../../.svelte-kit/types/src/routes/$types";

export const load: PageServerLoad = async (): Promise<any> => {
    try {
        const { data, error } = await supabase.from('ck_recipe').select('id, name, image, difficulty');

        if (error) {
            console.error('Error fetching recipes:', error.message);
            return {
                recipes: [],
            };
        }

        const urls = data.map((recipe) => {
            const { data } = supabase.storage.from('images').getPublicUrl(recipe.image);
            return { id: recipe.id, image: data.publicUrl };
        });

        const recipes = data.map((recipe) => {
            const urlObj = urls.find((url) => url.id === recipe.id); // Match by ID
            return {
                id: BigInt(recipe.id),
                name: recipe.name,
                image: urlObj?.image || '/images/default-image.jpg',
                difficulty: recipe.difficulty,
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
