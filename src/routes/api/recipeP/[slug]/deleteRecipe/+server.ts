import {supabase} from "$lib/supabase";
import {json} from "@sveltejs/kit";

export async function POST({ params, locals }) {
    const id = BigInt(params.slug);
    const currentUser = locals.currentUser;
    const currentRole = locals.currentRole;

    console.group('Delete Recipe');
    console.info('Delete action triggered for:', id);

    // LOAD RECIPE OWNER
    const { data: recipeData, error: fetchError } = await supabase
        .from('ck_recipe')
        .select('user_id')
        .eq('id', id)
        .single();
    if (fetchError) {
        console.error(fetchError.message);
        return json({ success: false, message: 'Recipe not found' });
    }

    console.log('Load Recipe Owner.');

    // CHECK RIGHTS FOR DELETE
    if (!(currentRole === 'superadmin' || currentUser === recipeData.user_id)) {
        console.error('Not authorised to delete this recipe.');
        return json({ success: false, message: 'Not authorised to delete this recipe' });
    }

    const { error: deleteError } = await supabase
        .from('ck_recipe')
        .delete()
        .eq('id', id);
    if (deleteError) {
        console.error(deleteError.message);
        return json({ success: false, message: deleteError.message });
    }

    console.log('Recipe Deleted.');
    console.groupEnd();

    return json({ success: true, message: 'Recipe deleted.' });
}