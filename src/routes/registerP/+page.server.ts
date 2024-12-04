import { supabase } from '$lib/supabase';
import {fail, redirect} from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';

const signUpSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    surname: z.string().min(1, 'Surname is required.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
    gender: z.enum(['Male', 'Female', 'Other'], { invalid_type_error: 'Gender is required.' }),
});

export const actions: Actions = {
    signUp: async ({ request, cookies }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const surname = formData.get('surname') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const gender = formData.get('gender') as string;

        const validationResult = signUpSchema.safeParse({ name, surname, email, password, gender });

        if (!validationResult.success) {
            return fail(400, {
                error: validationResult.error.errors.map(err => err.message).join(', '),
            });
        }

        // SIGN UP
        const { data: userData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return fail(400, { error: `Sign up failed: ${authError.message}` });
        }

        // ADD ADDITIONAL INFORMATION TO TABLE CK_RECIPE
        if (userData.user) {
            const { error: profileError } = await supabase
                .from('ck_person')
                .insert({
                    id: userData.user.id,
                    name,
                    surname,
                    gender,
                });

            if (profileError) {
                return fail(500, { error: `Failed to save profile: ${profileError.message}` });
            }

            // SET COOKIE FOR SESSION
            cookies.set('sb-access-token', userData.session?.access_token || '', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 7 DAYS
                path: '/',
            });

            throw redirect(302, '/');
        } else {
            return fail(500, { error: 'Unexpected error occurred during sign up.' });
        }
    },
};
