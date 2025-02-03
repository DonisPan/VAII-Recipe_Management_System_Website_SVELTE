import { supabase } from '$lib/supabase';
import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async ({params, locals}): Promise<any> => {
    const id = BigInt(params.slug);
    let currentUser = locals.currentUser;
    let currentRole = locals.currentRole;

    console.group('Load Recipe Page');

    // LOAD RECIPE DATA
    const { data: recipeData, error: recipeError } = await supabase
        .from('ck_recipe')
        .select('name, user_id, description, image, difficulty')
        .eq('id', id)
        .single();
    if (recipeError) {
        console.error(recipeError.message);
        return { recipe: null };
    }

    console.log('Load recipe data.');

    // LOAD RECIPE OWNER
    const { data: authorData, error: authorError } = await supabase
        .from('ck_person')
        .select('name, surname')
        .eq('id', recipeData.user_id)
        .single();
    if (authorError) {
        console.error(authorError.message);
        return { recipe: null };
    }

    console.log('Load recipe owner.');

    // LOAD RECIPE IMAGE
    const imagePath = recipeData.image;
    let imageUrl = '';
    if (imagePath) {
        const { data: storageData } = supabase.storage.from('images').getPublicUrl(imagePath);
        imageUrl = storageData.publicUrl || '';
    }

    console.log('Load recipe image.');

    // LOAD RECIPE CATEGORIES
    const { data: recipeCategories, error: recipeCategoriesError } = await supabase
        .from('ck_recipe_categories')
        .select('category_id')
        .eq('recipe_id', id);
    if (recipeCategoriesError) {
        console.error(recipeCategoriesError.message);
        return { recipe: null };
    }

    console.log('Load recipe categories.');

    // LOAD CATEGORIES DATA
    const categoryIds = recipeCategories?.map(category => category.category_id) ?? [];
    const { data: categoriesData, error: categoriesDataError } = await supabase
        .from('ck_category')
        .select('id, name, description')
        .in('id', categoryIds);
    if (categoriesDataError) {
        console.error(categoriesDataError.message);
        return { recipe: null };
    }

    console.log('Load recipe categories data.');

    // COMBINE CATEGORIES AND DATA
    const categories = recipeCategories?.map(rc => {
        const categoryDetails = categoriesData?.find(cat => cat.id === rc.category_id);
        return {
            name: categoryDetails?.name || 'Unknown',
            description: categoryDetails?.description || 'Unknown',
        };
    });

    console.log('Combine categories and data.');

    // LOAD RECIPE INGREDIENTS
    const { data: recipeIngredients, error: recipeIngredientsError } = await supabase
        .from('ck_recipe_ingredients')
        .select('ingredient_id, amount')
        .eq('recipe_id', id);
    if (recipeIngredientsError) {
        console.error(recipeIngredientsError.message);
        return { recipe: null };
    }

    console.log('Load recipe ingredients.');

    // LOAD INGREDIENTS DATA
    const ingredientIds = recipeIngredients?.map(ingredient => ingredient.ingredient_id) ?? [];
    const { data: ingredientsData, error: ingredientsDataError } = await supabase
        .from('ck_ingredient')
        .select('id, name, units')
        .in('id', ingredientIds);
    if (ingredientsDataError) {
        console.error(ingredientsDataError.message);
        return { recipe: null };
    }

    console.log('Load recipe ingredients data.');

    // COMBINE INGREDIENTS AND DATA
    const ingredients = recipeIngredients?.map(ri => {
        const ingredientDetails = ingredientsData?.find(ing => ing.id === ri.ingredient_id);
        return {
            name: ingredientDetails?.name || 'Unknown',
            amount: ri.amount,
            units: ingredientDetails?.units || '',
        };
    });

    console.log('Combine ingredients and data.');

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

    console.log('Create recipe.');

    // CHECK IF IS FAVOURITE
    const { data: favouriteData, error: favouriteError } = await supabase
        .from('ck_user_favourites')
        .select('recipe_id')
        .eq('recipe_id', id)
        .eq('user_id', currentUser)
        .maybeSingle();
    if (favouriteError) {
        console.error(favouriteError.message);
        return { recipe: null };
    }
    let isFavourite = !!favouriteData;

    console.log('Recipe page loaded.');
    console.groupEnd();

    return { recipe, id, currentUser, currentRole, isFavourite };
};