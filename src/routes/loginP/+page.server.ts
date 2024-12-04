import { supabase } from '$lib/supabase';
import {fail} from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const actions: Actions = {
    // LOGIN
    login: async ({ request, cookies }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const validationResult = loginSchema.safeParse({ email, password });

        if (!validationResult.success) {
            return fail(400, {
                error: validationResult.error.errors.map((err) => err.message).join(', '),
            });
        }

        const { data: session, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return fail(401, { error: 'Invalid email or password.' });
        }

        // COOKIE
        cookies.set('sb-access-token', session.session?.access_token || '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 DAYS
            path: '/',
        });

        return { success: true };
    },

    logout: async ({ locals }) => {
        await supabase.auth.signOut();
        locals.currentUser = null;
        locals.currentRole = null;
        locals.currentName = null;
    }
};
