import {json} from '@sveltejs/kit';
import {supabase} from "$lib/supabase";

export async function POST({ locals }) {
    const currentUser = locals.currentUser;
    const currentRole = locals.currentRole;

    console.group('Requested role upgrade');
    console.info('User ID: ', currentUser);

    if (!currentUser || currentRole !== 'regular') {
        console.error('Invalid role upgrade request.');
        return json({ success: false, message: 'Invalid role upgrade request.' });
    }

    // CHECK IF USER ALREADY REQUESTED PROMOTION
    const { data: requestCookData, error: requestCookError } = await supabase
        .from('ck_requests_cook')
        .select('user_id')
        .eq('user_id', currentUser);
    if (requestCookError) {
        console.error(requestCookError.message);
        return json({ success: false, message: requestCookError.message });
    }

    if (requestCookData.length > 0) {
        console.error('User cook request already exists.');
        return json({ success: false, message: 'User cook request already exists.' });
    }

    // INSERT INTO REQUEST TABLE
    const { error: requestInsertError } = await supabase
        .from('ck_requests_cook')
        .insert({ user_id: currentUser });
    if (requestInsertError) {
        console.error(requestInsertError.message);
        return json({ success: false, message: requestInsertError.message });
    }

    console.log('Request successfully submitted.');
    console.groupEnd();

    return json({success: true, message: 'Request successfully submitted.'});
}