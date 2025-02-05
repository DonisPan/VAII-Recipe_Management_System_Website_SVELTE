import type {PageServerLoad} from "../../../.svelte-kit/types/src/routes/$types";
import {supabase} from "$lib/supabase";
import {fail} from "@sveltejs/kit";
import {goto} from "$app/navigation";

export const load: PageServerLoad = async ({locals}): Promise<any> => {
    let currentUser = locals.currentUser;
    let currentRole = locals.currentRole;

    if (!currentUser) {
        await goto('/');
    }

    console.group('Load Profile Page')

    // LOAD RECIPES CREATED BY ME
    const { data: recipeData, error:recipeError } = await supabase
        .from('ck_recipe')
        .select('id, name, image, difficulty')
        .eq('user_id', currentUser);
    if (recipeError) {
        console.error('Error fetching recipes:', recipeError.message);
        console.groupEnd();
        return { recipes: [] };
    }

    console.log('Recipes Loaded.')

    // GET URLS FOR IMAGES
    const urls = recipeData.map((recipe) => {
        const { data } = supabase.storage.from('images').getPublicUrl(recipe.image);
        return { id: recipe.id, image: data.publicUrl };
    });

    console.log('Image URLs Loaded.');

    // CREATE DATA FOR RECIPES
    const recipes = recipeData.map((recipe) => {
        const urlObj = urls.find((url) => url.id === recipe.id); // Match by ID
        return {
            id: BigInt(recipe.id),
            name: recipe.name,
            image: urlObj?.image || '/images/default-image.jpg',
            difficulty: recipe.difficulty,
        };
    });

    console.log('Recipes Created.');

    const { data: currentUserData, error: currentUserError} = await supabase
        .from('ck_person')
        .select('name, surname')
        .eq('id', currentUser)
        .single();
    if (currentUserError) {
        console.error(currentUserError.message);
        console.groupEnd();
        return fail(400, { error: currentUserError.message });
    }

    console.log('User Data Loaded.');

    let profile = {
        name: currentUserData.name,
        surname: currentUserData.surname,
        role: currentRole,
    }

    console.log('Profile Created.');

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
        console.groupEnd();
    }

    console.log('Requests Loaded.');

    console.log('Page Loaded');
    console.groupEnd();

    return { profile, recipes, requests };
}