import {z} from "zod";

export const recipeSchema = z.object({
    name: z.string()
        .min(1, 'Recipe name is required.')
        .max(60, 'Recipe name is too long'),
    description: z.string()
        .min(1, 'Description is required.')
        .max(300, 'Try to keep the description shorter')
        .regex(/^[^;#$&]*$/, "Special characters like ';', '#', '$', and '&' are not allowed"),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane'], { invalid_type_error: 'Difficulty is required' }),
    imageFile: z.instanceof(File, { message: 'Image file is required' }),
    selectedCategories: z.array(
        z.number())
        .min(1, 'At least one category is required.'),
    selectedIngredients: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            amount: z.number().positive('Amount must be greater than 0'),
            units: z.string(),
        })
    ).min(1, 'At least one ingredient is required.'),
    stepList: z.array(
        z.object({
            index: z.number(),
            description: z.string()
                .min(1, 'Step description is required.')
                .max(200, 'Try to keep the step description shorter')
                .regex(/^[^;#$&]*$/, "Special characters like ';', '#', '$', and '&' are not allowed"),
        })
    ).min(1, 'At least one step is required.'),
});

export const loginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address.')
        .max(50, 'Email is too long.'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long.')
        .max(50, 'Password can be maximum of 50 characters long.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/[0-9]/, 'Password must contain at least one number.'),
});

export const signUpSchema = z.object({
    name: z.string()
        .min(1, 'Name is required.')
        .max(30, 'Name can be maximum of 30 characters long.'),
    surname: z.string()
        .min(1, 'Surname is required.')
        .max(30, 'Surname can be maximum of 30 characters long.'),
    email: z.string()
        .email('Invalid email address.')
        .max(50, 'Email is too long.'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long.')
        .max(50, 'Password can be maximum of 50 characters long.')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
        .regex(/[0-9]/, 'Password must contain at least one number.'),
    gender: z.enum(['Male', 'Female', 'Other'], { invalid_type_error: 'Gender is required.' }),
});

export const updateSchema = z.object({
    name: z.string()
        .min(1, 'Recipe name is required.')
        .max(60, 'Recipe name is too long'),
    description: z.string()
        .min(1, 'Description is required.')
        .max(300, 'Try to keep the description shorter')
        .regex(/^[^;#$&]*$/, "Special characters like ';', '#', '$', and '&' are not allowed"),
    difficulty: z.enum(['Easy', 'Medium', 'Hard', 'Insane'], { invalid_type_error: 'Difficulty is required' }),
})