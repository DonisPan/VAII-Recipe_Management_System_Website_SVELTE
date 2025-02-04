import {json} from "@sveltejs/kit";
import {supabase} from "$lib/supabase";
import {z} from "zod";

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address.').max(50, 'Email too long.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.').max(50, 'Password can be maximum of 50 characters long.'),
});

export async function POST({ request, cookies }) {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    console.group('Requested role upgrade');
    console.info('Email: ', email, ' Password: ', password);

    // FORM VALIDATION
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
        console.error('Validation failed.');
        console.groupEnd();
        return json({ success: false, message: validationResult.error.errors.map((err) => err.message).join(', ') });
    }

    console.log('Validation passed.');

    // SIGN IN
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (loginError) {
        console.error(loginError.message);
        console.groupEnd();
        return json({ success: false, message: 'Invalid email or password.' });
    }

    console.log('User logged in.');

    // SET COOKIE
    cookies.set('sb-access-token', loginData.session?.access_token || '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 DAYS
        path: '/',
    });

    console.log('Cookie set.');
    console.groupEnd();

    return json({ success: true, message: 'User Logged In.' });
}