import {json} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";
import {z} from "zod";

const recipeSchema = z.object({
    name: z.string().min(4, 'Recipe name is required.').max(60, 'Recipe name is too long'),
    description: z.string().min(1, 'Description is required.').max(300, 'Try to keep the description shorter'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane'], { invalid_type_error: 'Difficulty is required.' }),
    imageFile: z.instanceof(File, { message: 'Image file is required' }),
    selectedCategories: z.array(z.number()).min(1, 'At least one category is required.'),
    selectedIngredients: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            amount: z.number().positive('Amount must be greater than 0'),
            units: z.string(),
        })
    ).min(1, 'At least one ingredient is required.'),
});

export async function POST({ request, locals }) {
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

    // VALIDATION
    const validationResult = recipeSchema.safeParse({ name, description, difficulty, imageFile, selectedCategories, selectedIngredients });
    if (!validationResult.success) {
        console.error('Validation failed.');
        console.groupEnd();
        return json({ success: false, message: validationResult.error.errors.map((err) => err.message).join(', ') });
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
    let currentUser = locals.currentUser;
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
            return json({ success: false, error: `Failed to associate ingredients: ${ingredientError.message}` });
        }
        console.log('Ingredients successfully inserted');
    }

    console.log('Recipe created.');
    console.groupEnd();

    return json({ success: true, message: 'Recipe created.' });
}