import { supabase } from '$lib/supabase';
import type {PageServerLoad, Actions} from './$types';
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({params, locals}): Promise<any> => {
    const id = BigInt(params.slug);

    // LOAD LOCALS
    let currentUser = locals.currentUser;
    let currentRole = locals.currentRole;

    // LOAD RECIPE
    const { data: recipeData, error: recipeError } = await supabase
        .from('ck_recipe')
        .select('name, user_id, description, image, difficulty')
        .eq('id', id)
        .single();
    if (recipeError) {
        console.error(`Error fetching recipe with ID ${id}:`, recipeError.message);
        return { recipe: null };
    }

    // LOAD RECIPE OWNER
    const { data: authorData, error: authorError } = await supabase
        .from('ck_person')
        .select('name, surname')
        .eq('id', recipeData.user_id)
        .single();
    if (authorError) {
        console.error('Error fetching author data:', authorError.message);
    }

    // LOAD RECIPE IMAGE
    const imagePath = recipeData.image;
    let imageUrl = '';
    if (imagePath) {
        const { data: storageData } = supabase.storage.from('images').getPublicUrl(imagePath);
        imageUrl = storageData.publicUrl || '';
    }

    // LOAD RECIPE CATEGORIES
    const { data: recipeCategories, error: recipeCategoriesError } = await supabase
        .from('ck_recipe_categories')
        .select('category_id')
        .eq('recipe_id', id);
    if (recipeCategoriesError) {
        console.error('Error fetching recipe ingredients:', recipeCategoriesError.message);
    }

    // LOAD CATEGORIES DATA
    const categoryIds = recipeCategories?.map(category => category.category_id) ?? [];
    const { data: categoriesData, error: categoriesDataError } = await supabase
        .from('ck_category')
        .select('id, name, description')
        .in('id', categoryIds);
    if (categoriesDataError) {
        console.error('Error fetching ingredients:', categoriesDataError.message);
    }

    // MERGE CATEGORIES DATA
    const categories = recipeCategories?.map(rc => {
        const categoryDetails = categoriesData?.find(cat => cat.id === rc.category_id);
        return {
            name: categoryDetails?.name || 'Unknown',
            description: categoryDetails?.description || 'Unknown',
        };
    });

    // LOAD RECIPE INGREDIENTS
    const { data: recipeIngredients, error: recipeIngredientsError } = await supabase
        .from('ck_recipe_ingredients')
        .select('ingredient_id, amount')
        .eq('recipe_id', id);
    if (recipeIngredientsError) {
        console.error('Error fetching recipe ingredients:', recipeIngredientsError.message);
    }

    // LOAD INGREDIENTS DATA
    const ingredientIds = recipeIngredients?.map(ingredient => ingredient.ingredient_id) ?? [];
    const { data: ingredientsData, error: ingredientsDataError } = await supabase
        .from('ck_ingredient')
        .select('id, name, units')
        .in('id', ingredientIds);
    if (ingredientsDataError) {
        console.error('Error fetching ingredients:', ingredientsDataError.message);
    }

    // COMBINE INGREDIENTS DATA
    const ingredients = recipeIngredients?.map(ri => {
        const ingredientDetails = ingredientsData?.find(ing => ing.id === ri.ingredient_id);
        return {
            name: ingredientDetails?.name || 'Unknown',
            amount: ri.amount,
            units: ingredientDetails?.units || '',
        };
    });

    // CREATE RECIPE FOR CLIENT
    const recipe = {
        user_id: recipeData.user_id,
        name: recipeData.name,
        author: authorData ? `${authorData.name} ${authorData.surname}` : 'Unknown',
        description: recipeData.description,
        image: imageUrl,
        difficulty: recipeData.difficulty || 'Unknown',
        ingredients: ingredients,
        categories: categories,
    };

    // CHECK IF IS FAVOURITE
    const { data: favouriteData, error: favouriteError } = await supabase
        .from('ck_user_favourites')
        .select('recipe_id')
        .eq('recipe_id', id)
        .eq('user_id', currentUser)
        .maybeSingle();

    if (favouriteError) {
        console.error('Error fetching favourite data:', favouriteError.message);
    }
    let isFavourite = !!favouriteData;

    return { recipe, id, currentUser, currentRole, isFavourite };
};

export const actions: Actions = {
    // DELETE RECIPE
    deleteRecipe: async ({ params, locals }) => {

        const id = BigInt(params.slug);

        console.log('Delete action triggered for:', params.slug);

        const { data: recipeData, error: fetchError } = await supabase
            .from('ck_recipe')
            .select('user_id')
            .eq('id', id)
            .single();
        if (fetchError || !recipeData) {
            return fail(500, { error: 'Recipe not found' });
        }

        // VALIDATION
        if (locals.currentUser !== recipeData.user_id || locals.currentRole !== 'superadmin') {
            console.error('Not authorised to delete this recipe');
            return fail(400, { error: 'Not authorised to delete this recipe' });
        }

        const { error: deleteError } = await supabase
            .from('ck_recipe')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return fail(401, { error: deleteError.message });
        }
        return true;
    },

    // UPDATE RECIPE
    updateRecipe: async ({ params, request, locals }) => {
        const id = BigInt(params.slug);

        const formData = await request.formData();

        const name = formData.get('name') as string;
        const difficulty = formData.get('difficulty') as string;
        const description = formData.get('description') as string;
        const imageFile = formData.get('image') as File;

        const {data: imageData }= await supabase.from('ck_recipe').select('image, user_id').eq('id', id).single()
        let imagePath = imageData?.image;

        // IF NEW IMAGE
        if (imageFile && imageFile.size > 0) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                console.error('Image upload failed:', error.message);
                return fail(401, { error: 'Image upload failed' });
            }

            imagePath = data.path;
        }

        // VALIDATION
        if (locals.currentUser !== imageData?.user_id || locals.currentRole !== 'superadmin') {
            console.error('Not authorised to update this recipe');
            return fail(400, { error: 'Not authorised to update this recipe' });
        }

        // UPDATE RECIPE
        const { error } = await supabase
            .from('ck_recipe')
            .update({
                name,
                difficulty,
                description,
                image: imagePath,
            })
            .eq('id', id);

        if (error) {
            console.error('Failed to update recipe:', error.message);
            return fail(401, { error: 'Failed to update recipe' });
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