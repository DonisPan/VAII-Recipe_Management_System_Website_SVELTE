import {supabase} from "$lib/supabase";
import {json} from "@sveltejs/kit";

export async function POST({ params, locals }) {
    const id = BigInt(params.slug);
    const currentUser = locals.currentUser;

    console.group('Unlike Recipe')
    console.log('Unlike action triggered for: ', id);

    // CHECK IF USER IS LOGGED IN
    if (!currentUser) {
        console.error('Unauthorized: User not logged in.');
        return json({ success: false, message: 'Unauthorized: User not logged in.' });
    }

    // DELETE FROM FAVOURITES
    const { error: favouritesError } = await supabase
        .from('ck_user_favourites')
        .delete()
        .eq('user_id', currentUser)
        .eq('recipe_id', id.toString());
    if (favouritesError) {
        console.error(favouritesError.message);
        return json({ success: false, message: favouritesError.message });
    }

    console.log('Recipe unliked.');
    console.groupEnd();
    return json({ success: true, message: 'Recipe unliked.' });
}