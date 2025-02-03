import {json} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";

export async function POST({ request, locals }) {
    let currentRole = locals.currentRole;

    const formData = await request.formData();
    const userId = formData.get('user_id') as string;

    console.group('Accept promotion request');

    // USER ID DOES NOT EXIST
    if (!userId) {
        console.error('No User ID.');
        return json({ success: false, message: 'No User ID.' });
    }

    console.info('User ID: ', userId);

    // CURRENT USER ROLE DOES NOT HAVE PERMISSIONS
    if (currentRole !== 'superadmin') {
        console.error('No permissions for this action.');
        return json({ success: false, message: 'You do not have permissions for this action.' });
    }

    // UPDATE USER ROLE TO COOK
    const { error: updateError } = await supabase
        .from("ck_person")
        .update({ role: "cook" })
        .eq("id", userId);
    if (updateError) {
        console.error(updateError.message);
        return json({ success: false, message: updateError.message });
    }

    console.log('Role updated.');

    // DELETE REQUEST AFTER ACCEPTING
    const { error: deleteError } = await supabase
        .from("ck_requests_cook")
        .delete()
        .eq("user_id", userId);
    if (deleteError) {
        console.error(deleteError.message);
        return json({ success: false, message: deleteError.message });
    }

    console.log('Request deleted.');
    console.log('Promotion done.');
    console.groupEnd();

    return json({ success: true, message: 'Promotion request accepted.' });
}