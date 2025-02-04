import {z} from "zod";
import {json} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";

const signUpSchema = z.object({
    name: z.string().min(1, 'Name is required.').max(50, 'Name can be maximum of 50 characters.'),
    surname: z.string().min(1, 'Surname is required.').max(50, 'Surname can be maximum of 50 characters.'),
    email: z.string().email('Please enter a valid email address.').max(50, 'Email too long.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.').max(50, 'Password can be maximum of 50 characters long.'),
    gender: z.enum(['Male', 'Female', 'Other'], { invalid_type_error: 'Gender is required.' }),
});

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