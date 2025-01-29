import { supabase } from '$lib/supabase';
import type {PageServerLoad, Actions} from './$types';

export const load: PageServerLoad = async ({params, locals}): Promise<any> => {
    const id = BigInt(params.slug);

    //LOAD LOCALS
    let currentUser = locals.currentUser;
    let currentRole = locals.currentRole;

    //LOAD RECIPE
    const { data: recipeData, error: recipeError } = await supabase
        .from('ck_recipe')
        .select('name, user_id, description, image, difficulty')
        .eq('id', id)
        .single();

    if (recipeError) {
        console.error(`Error fetching recipe with ID ${id}:`, recipeError.message);
        return { recipe: null };
    }

    //LOAD RECIPE OWNER
    const { data: authorData, error: authorError } = await supabase
        .from('ck_person')
        .select('name, surname')
        .eq('id', recipeData.user_id)
        .single();

    if (authorError) {
        console.error('Error fetching author data:', authorError.message);
    }

    //LOAD RECIPE IMAGE
    const imagePath = recipeData.image;
    let imageUrl = '';

    if (imagePath) {
        const { data: publicData } = supabase.storage.from('images').getPublicUrl(imagePath);
        imageUrl = publicData.publicUrl || '';
    }

    //CREATE RECIPE FOR CLIENT
    const recipe = {
        user_id: recipeData.user_id,
        name: recipeData.name,
        author: authorData ? `${authorData.name} ${authorData.surname}` : 'Unknown',
        description: recipeData.description,
        image: imageUrl,
        difficulty: recipeData.difficulty || 'Unknown',
    };

    //CHECK IF IS FAVOURITE
    const { data: favouriteData, error: favouriteError } = await supabase
        .from('ck_user_favourites')
        .select('recipe_id')
        .eq('recipe_id', id)
        .eq('user_id', currentUser)
        .single();

    if (favouriteError) {
        console.error('Error fetching favourite data:', favouriteError.message);
    }
    let isFavourite = !!favouriteData;

    return { recipe, id, currentUser, currentRole, isFavourite };
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

        //console.log(recipeData);

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

    favouriteRecipe: async ({ params, locals }) => {
        console.log(`Received request for favouriteRecipe with recipe ID: ${params.slug}`);

        const id = BigInt(params.slug);
        const currentUser = locals.currentUser;

        console.log('User ID:', currentUser ? currentUser : 'No user');

        if (!currentUser) {
            console.error('Unauthorized: User not logged in.');
            return { status: 401, body: { error: 'Unauthorized' } };
        }

        try {
            const { error } = await supabase
                .from('ck_user_favourites')
                .insert({ user_id: currentUser, recipe_id: id.toString() });

            if (error) {
                console.error('Database Error - Adding favorite:', error.message);
                return { status: 500, body: { error: 'Failed to add favorite' } };
            }

            console.log(`Successfully added recipe ${id} to favorites for user ${currentUser}`);
            return { status: 200, body: { success: true } };
        } catch (error) {
            console.error('Unexpected error in favouriteRecipe:', error);
            return { status: 500, body: { error: 'Internal server error' } };
        }
    },


    unFavouriteRecipe: async ({ params, locals }) => {
        console.log(`Received request for unFavouriteRecipe with recipe ID: ${params.slug}`);

        const id = BigInt(params.slug);
        const currentUser = locals.currentUser;

        console.log('User ID:', currentUser ? currentUser : 'No user');

        if (!currentUser) {
            console.error('Unauthorized: User not logged in.');
            return { status: 401, body: { error: 'Unauthorized' } };
        }

        try {
            const { error } = await supabase
                .from('ck_user_favourites')
                .delete()
                .eq('user_id', currentUser)
                .eq('recipe_id', id.toString());

            if (error) {
                console.error('Database Error - Removing favorite:', error.message);
                return { status: 500, body: { error: 'Failed to remove favorite' } };
            }

            console.log(`Successfully removed recipe ${id} from favorites for user ${currentUser}`);
            return { status: 200, body: { success: true } };
        } catch (error) {
            console.error('Unexpected error in unFavouriteRecipe:', error);
            return { status: 500, body: { error: 'Internal server error' } };
        }
    },


};