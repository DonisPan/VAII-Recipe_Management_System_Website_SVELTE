import { supabase } from '$lib/supabase';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';

const recipeSchema = z.object({
    name: z.string().min(1, 'Recipe name is required.'),
    description: z.string().min(1, 'Description is required.'),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane']),
    imageFile: z.instanceof(File).optional(),
});

export const actions: Actions = {
    // CREATE RECIPE
    createRecipe: async ({ request, locals }) => {
        const formData = await request.formData();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const difficulty = formData.get('difficulty') as string;
        const imageFile = formData.get('image') as File | null;

        const validationResult = recipeSchema.safeParse({ name, description, difficulty, imageFile });

        if (!validationResult.success) {
            return fail(400, {
                error: validationResult.error.errors.map((err) => err.message).join(', '),
            });
        }

        let imagePath = null;

        // IF IMAGE
        if (imageFile) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                return fail(500, { error: `Image upload failed: ${error.message}` });
            }

            imagePath = data?.path;
        }

        // INSERT RECIPE
        let currentUser = locals.currentUser;
        const { error } = await supabase.from('ck_recipe').insert({
            name,
            user_id: currentUser,
            description,
            difficulty,
            image: imagePath,
        });

        if (error) {
            return fail(500, { error: `Failed to create recipe: ${error.message}` });
        }

        throw redirect(303, '/');
    },
};
