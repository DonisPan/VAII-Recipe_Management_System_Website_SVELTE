import type {PageServerLoad} from "../../../.svelte-kit/types/src/routes/$types";
import {supabase} from "$lib/supabase";
import type {Actions} from "../../../.svelte-kit/types/src/routes/recipeP/[slug]/$types";
import {fail} from "@sveltejs/kit";

export const load: PageServerLoad = async ({locals}): Promise<any> => {
    let currentUser = locals.currentUser;
    let currentRole = locals.currentRole;

    // LOAD RECIPES CREATED BY ME
    const { data: recipeData, error:recipeError } = await supabase
        .from('ck_recipe')
        .select('id, name, image, difficulty')
        .eq('user_id', currentUser);

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
        return {
            id: BigInt(recipe.id),
            name: recipe.name,
            image: urlObj?.image || '/images/default-image.jpg',
            difficulty: recipe.difficulty,
        };
    });

    const { data: currentUserData, error: currentUserError} = await supabase
        .from('ck_person')
        .select('name, surname')
        .eq('id', currentUser)
        .single();
    if (currentUserError) {
        return fail(400, { error: currentUserError.message });
    }

    let profile = {
        name: currentUserData.name,
        surname: currentUserData.surname,
        role: currentRole,
    }

    const {data: requestsData} = await supabase
        .from('ck_requests_cook')
        .select('user_id, created_at')

    const requestUserIds = requestsData?.map(user => user.user_id) ?? [];
    const { data: requests, error: userDataError } = await supabase
        .from('ck_person')
        .select('id, name, surname, registered_at')
        .in('id', requestUserIds)
    if (userDataError) {
        console.error('Error fetching user data:', userDataError.message);
    }

    return { profile, recipes, requests };
}

export const actions: Actions = {
    requestCookRole: async ({ locals }) => {
        console.log('Requested role upgrade');
        const currentUser = locals.currentUser;
        const currentRole = locals.currentRole;

        if (!currentUser || currentRole !== 'regular') {
            console.error('Invalid role upgrade request');
            return fail(400, { message: 'Invalid role upgrade request' });
        }

        // Check if request already exists
        const { data: requestCookData, error: requestCookError } = await supabase
            .from('ck_requests_cook')
            .select('user_id')
            .eq('user_id', currentUser);

        if (requestCookError) {
            console.error(requestCookError.message);
            return fail(400, { message: requestCookError.message });
        }

        if (requestCookData.length > 0) {  // Ensure check works properly
            console.error('User cook request already exists');
            return fail(400, { error: 'User cook request already exists' });
        }

        // Insert new request
        const { error: requestInsertError } = await supabase
            .from('ck_requests_cook')
            .insert({ user_id: currentUser });

        if (requestInsertError) {
            console.error(requestInsertError.message);
            return fail(400, { message: requestInsertError.message });
        }

        return { success: true }; // ✅ Return success for frontend
    },

    acceptCookRequest: async ({ request }) => {
        const formData = await request.formData();
        const userId = formData.get("user_id") as string;

        if (!userId) {
            return fail(400, { error: "User ID is required" });
        }

        // UPDATE USER ROLE TO COOK
        const { error: updateError } = await supabase
            .from("ck_person")
            .update({ role: "cook" })
            .eq("id", userId);

        if (updateError) {
            return fail(500, { error: `Failed to update user role: ${updateError.message}` });
        }

        // DELETE REQUEST AFTER ACCEPTING
        const { error: deleteError } = await supabase
            .from("ck_requests_cook")
            .delete()
            .eq("user_id", userId);

        if (deleteError) {
            return fail(500, { error: `Failed to delete request: ${deleteError.message}` });
        }

        return { success: true };
    },

    rejectCookRequest: async ({ request }) => {
        const formData = await request.formData();
        const userId = formData.get("user_id") as string;

        if (!userId) {
            return fail(400, { error: "User ID is required" });
        }

        // DELETE REQUEST WITHOUT CHANGING ROLE
        const { error: deleteError } = await supabase
            .from("ck_requests_cook")
            .delete()
            .eq("user_id", userId);

        if (deleteError) {
            return fail(500, { error: `Failed to delete request: ${deleteError.message}` });
        }

        return { success: true };
    },
};
