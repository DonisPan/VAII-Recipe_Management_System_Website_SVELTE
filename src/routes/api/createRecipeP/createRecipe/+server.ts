import {json} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";
import {recipeSchema} from "$lib/zodSchemas";
import {goto} from "$app/navigation";

export async function POST({ request, locals }) {
    let currentUser = locals.currentUser;

    if (!currentUser) {
        await goto('/');
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const difficulty = formData.get('difficulty') as string;
    const imageFile = formData.get('image') as File | null;

    console.group('Request Create Recipe');

    const categoriesJson = formData.get('categories') as string;
    let selectedCategories: { id: any }[];
    selectedCategories = JSON.parse(categoriesJson);

    const ingredientsJson = formData.get('ingredients') as string;
    let selectedIngredients: { id: any; amount: any; }[];
    selectedIngredients = JSON.parse(ingredientsJson);

    const stepsJson = formData.get('steps') as string;
    let stepList: { index: any; description: any }[];
    stepList = JSON.parse(stepsJson);

    // VALIDATION
    const validationResult = recipeSchema.safeParse({ name, description, difficulty, imageFile, selectedCategories, selectedIngredients, stepList });
    if (!validationResult.success) {
        console.error('Validation failed.');
        console.error(validationResult);
        console.groupEnd();
        return json({ success: false, message: validationResult.error.errors.map(err => err.message).join('\n') });
    }

    // IF NEW IMAGE
    let imagePath = null;
    if (imageFile) {
        const { data: newImageData, error: newImageError } = await supabase.storage
            .from('images')
            .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);
        if (newImageError) {
            console.error('Image upload failed:', newImageError.message);
            console.groupEnd();
            return json({ success: false, message: newImageError.message });
        }
        imagePath = newImageData?.path;
    }

    // INSERT RECIPE
    const { data: recipeData, error: recipeError } = await supabase.from('ck_recipe').insert({
        name,
        user_id: currentUser,
        description,
        difficulty,
        image: imagePath,
    }).select('id').single();
    if (recipeError) {
        console.error(recipeError.message);
        console.groupEnd();
        return json({ success: false, message: recipeError.message });
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
            console.error(categoryError.message);
            console.groupEnd();
            return json({ success: false, message: categoryError.message });
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
            console.error(ingredientError.message);
            console.groupEnd();
            return json({ success: false, message: ingredientError.message });
        }
        console.log('Ingredients successfully inserted');
    }

    // INSERT STEPS
    if (stepList.length > 0) {
        const stepsInsertData = stepList.map((step) => ({
            recipe_id: recipeData.id,
            index: step.index,
            description: step.description,
        }));

        const { error: stepsError } = await supabase.from('ck_recipe_steps').insert(stepsInsertData);
        if (stepsError) {
            console.error(stepsError.message);
            console.groupEnd();
            return json({ success: false, message: stepsError.message });
        }
        console.log('Steps successfully inserted');
    }


    console.log('Recipe created.');
    console.groupEnd();

    return json({ success: true, message: 'Recipe created.' });
}