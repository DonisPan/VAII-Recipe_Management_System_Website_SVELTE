import { supabase } from '$lib/supabase';
import type {PageServerLoad, Actions} from './$types';

export const load: PageServerLoad = async ({params, locals}) => {
    const id = BigInt(params.slug);

    const { data: recipeData, error: recipeError } = await supabase
        .from('ck_recipe')
        .select('name, user_id, description, image, difficulty')
        .eq('id', id)
        .single();

    if (recipeError) {
        console.error(`Error fetching recipe with ID ${id}:`, recipeError.message);
        return { recipe: null };
    }

    const { data: authorData, error: authorError } = await supabase
        .from('ck_person')
        .select('name, surname')
        .eq('id', recipeData.user_id)
        .single();

    if (authorError) {
        console.error('Error fetching author data:', authorError.message);
    }

    const imagePath = recipeData.image;
    let imageUrl = '';

    if (imagePath) {
        const { data: publicData } = supabase.storage.from('images').getPublicUrl(imagePath);
        imageUrl = publicData.publicUrl || '';
    }

    const recipe = {
        user_id: recipeData.user_id,
        name: recipeData.name,
        author: authorData ? `${authorData.name} ${authorData.surname}` : 'Unknown',
        description: recipeData.description,
        image: imageUrl,
        difficulty: recipeData.difficulty || 'Unknown',
    };

    let currentUser = locals.currentUser;
    let currentRole = locals.currentRole;

    return { recipe, id, currentUser, currentRole };
};

export const actions: Actions = {
    // DELETE RECIPE
    deleteRecipe: async ({ params }) => {
        const id = BigInt(params.slug);

        console.log('Delete action triggered for:', params.slug);

        const { data: recipeData, error: fetchError } = await supabase
            .from('ck_recipe')
            .select('user_id')
            .eq('id', id)
            .single();

        console.log(recipeData);

        if (fetchError || !recipeData) {
            return { error: 'Recipe not found' };
        }

        const { error: deleteError } = await supabase
            .from('ck_recipe')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return { error: deleteError.message };
        }
        return true;
    },

    // UPDATE RECIPE
    updateRecipe: async ({ params, request }) => {
        const id = BigInt(params.slug);

        const formData = await request.formData();
        console.log(formData);
        const name = formData.get('name') as string;
        const difficulty = formData.get('difficulty') as string;
        const description = formData.get('description') as string;
        const imageFile = formData.get('image') as File;
        const {data: imageData }= await supabase.from('ck_recipe').select('image').eq('id', id).single()
        let imagePath = imageData?.image;

        // IF NEW IMAGE
        if (imageFile && imageFile.size > 0) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                console.error('Image upload failed:', error.message);
                return { error: 'Image upload failed' };
            }

            imagePath = data.path;
        }

        // UPDATE RECIPE
        const { error } = await supabase.from('ck_recipe').update({
            name,
            difficulty,
            description,
            image: imagePath,
        }).eq('id', id);

        if (error) {
            console.error('Failed to update recipe:', error.message);
            return { error: 'Failed to update recipe' };
        }

        return { success: true };
    },

};