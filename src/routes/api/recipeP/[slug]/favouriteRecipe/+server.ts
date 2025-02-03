import {supabase} from "$lib/supabase";
import {json} from "@sveltejs/kit";

export async function POST({ params, locals }) {
    const id = BigInt(params.slug);
    const currentUser = locals.currentUser;

    console.group('Like Recipe')
    console.log('Like action triggered for: ', id);

    // CHECK IF USER IS LOGGED IN
    if (!currentUser) {
        console.error('Unauthorized: User not logged in.');
        return json({ success: false, message: 'Unauthorized: User not logged in.' });
    }

    // INSERT INTO FAVOURITES
    const { error: favouritesError } = await supabase
        .from('ck_user_favourites')
        .insert({ user_id: currentUser, recipe_id: id.toString() });
    if (favouritesError) {
        console.error(favouritesError.message);
        return json({ success: false, message: favouritesError.message });
    }

    console.log('Recipe Liked.');
    console.groupEnd();
    return json({ success: true, message: 'Recipe liked.' });
}