import {json} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";
import {signUpSchema} from "$lib/zodSchemas";


export async function POST({ request }) {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const surname = formData.get('surname') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const gender = formData.get('gender') as string;

    console.group('Request Login');
    console.info('Email: ', email);

    // VALIDATION
    const validationResult = signUpSchema.safeParse({ name, surname, email, password, gender });
    if (!validationResult.success) {
        console.error('Validation failed.');
        console.groupEnd();
        return json({ success: false, error: validationResult.error.errors.map(err => err.message).join(', ') });
    }

    // SIGN UP
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });
    if (signUpError) {
        console.error(signUpError.message);
        console.groupEnd();
        return json({ success: false, message: signUpError.message });
    }

    // INSERT ADDITIONAL DATA INTO CK_PERSON TABLE
    const { error: profileError } = await supabase
        .from('ck_person')
        .insert({
            id: signUpData.user?.id,
            name,
            surname,
            gender,
        });
    if (profileError) {
        console.error(profileError.message);
        console.groupEnd();
        return json({ success: false, message: profileError.message });
    }

    console.log('User registered.');
    console.groupEnd();

    return json({ success: true, message: 'User signed up.' });
}