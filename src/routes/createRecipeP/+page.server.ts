import { supabase } from '$lib/supabase';
import { fail, redirect } from '@sveltejs/kit';
import type {Actions, PageServerLoad} from './$types';
import { z } from 'zod';

const recipeSchema = z.object({
    name: z.string().min(4, 'Recipe name is required.').max(60, 'Recipe name is too long'),
    description: z.string().min(1, 'Description is required.').max(300, 'Try to keep the description shorter'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']),
    imageFile: z.instanceof(File),
});

export const load: PageServerLoad = async (): Promise<any> => {
    try {
        const { data: categories, error: categoriesError } = await supabase
            .from('ck_category')
            .select('id, name, description');
        if (categoriesError) {
            console.error('Error fetching categories:', categoriesError.message);
            return { categories: [] };
        }

        const { data: ingredients, error: ingredientsError } = await supabase
            .from('ck_ingredient')
            .select('id, name, units');
        if (ingredientsError) {
            console.error('Error fetching ingredients:', ingredientsError.message);
            return { categories, ingredients: [] };
        }

        return { categories, ingredients };

    } catch (err) {
        console.error('Unexpected error:', err);
        return { categories: [], ingredients: [] };
    }
};

export const actions: Actions = {
    // CREATE RECIPE
    createRecipe: async ({ request, locals }) => {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const difficulty = formData.get('difficulty') as string;
        const imageFile = formData.get('image') as File | null;

        const selectedCategories = formData.getAll('selectedCategories[]').map(Number);

        const ingredientsJson = formData.get('ingredients') as string;
        let selectedIngredients: { id: any; amount: any; }[] = [];
        try {
            selectedIngredients = JSON.parse(ingredientsJson);
        } catch (error) {
            return fail(400, { error: 'Invalid ingredient format' });
        }

        // VALIDATION
        const validationResult = recipeSchema.safeParse({ name, description, difficulty, imageFile });
        if (!validationResult.success) {
            return fail(400, {
                error: validationResult.error.errors.map((err) => err.message).join(', '),
            });
        }

        // IF NEW IMAGE
        let imagePath = null;
        if (imageFile) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);
            if (error) {
                return fail(500, { error: `Image upload failed: ${error.message}` });
            }
            imagePath = data.path;
        }

        // INSERT RECIPE
        let currentUser = locals.currentUser;
        const { data: recipeData, error } = await supabase.from('ck_recipe').insert({
            name,
            user_id: currentUser,
            description,
            difficulty,
            image: imagePath,
        }).select('id').single();
        if (error || !recipeData) {
            return fail(500, { error: `Failed to create recipe: ${error.message}` });
        }
        console.log('Recipe id: ', recipeData.id ,'successfully created');

        // INSERT CATEGORIES
        if (selectedCategories.length > 0) {
            const categoryInsertData = selectedCategories.map(categoryId => ({
                recipe_id: recipeData.id,
                category_id: categoryId
            }));

            const { error: categoryError } = await supabase.from('ck_recipe_categories').insert(categoryInsertData);
            if (categoryError) {
                return fail(500, { error: `Failed to associate categories: ${categoryError.message}` });
            }
            console.log('Categories successfully inserted');
        }

        // INSERT INGREDIENTS
        if (selectedIngredients.length > 0) {
            const ingredientInsertData = selectedIngredients.map((ingredient) => ({
                recipe_id: recipeData.id,
                ingredient_id: ingredient.id,
                amount: ingredient.amount,
            }));

            const { error: ingredientError } = await supabase.from('ck_recipe_ingredients').insert(ingredientInsertData);
            if (ingredientError) {
                return fail(500, { error: `Failed to associate ingredients: ${ingredientError.message}` });
            }
            console.log('Ingredients successfully inserted');
        }


        throw redirect(303, '/');
    },
};
