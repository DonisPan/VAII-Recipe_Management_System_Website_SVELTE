<script lang="ts">
    import { z } from 'zod';
    import {goto} from "$app/navigation";

    const loginSchema = z.object({
        email: z.string().email('Please enter a valid email address.'),
        password: z.string().min(6, 'Password must be at least 6 characters long.'),
    });

    export let error: string | null = null;

    let email = '';
    let password = '';
    let clientError: string | null = null;

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();

        const validationResult = loginSchema.safeParse({ email, password });
        if (!validationResult.success) {
            clientError = validationResult.error.errors.map(err => err.message).join(', ');
            return;
        }

        clientError = null;

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('?/login', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) {
            clientError = result.error || 'Unexpected error occurred.';
        } else {
            await goto('/');
            location.reload();
        }
    }
</script>

<div class="page-container">
    <div class="login_container">
        <div class="login_container_box">
            <h1>Login</h1>
            {#if clientError}
                <p class="error-message">{clientError}</p>
            {/if}

            {#if error}
                <p class="error-message">{error}</p>
            {/if}
        </div>

        <form on:submit={handleLogin}>
            <div class="login_container_box login_container_box2">
                <label for="email">E-mail:</label>
                <input type="email" id="email" bind:value={email} placeholder="Enter your email" required>
            </div>

            <div class="login_container_box login_container_box2">
                <label for="password">Password:</label>
                <input type="password" id="password" bind:value={password} placeholder="Enter your password" required>
            </div>

            <div class="login_container_box login_container_box3">
                <button type="reset" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Sign in</button>
            </div>
        </form>
    </div>
</div>



<style>
    .login_container {
        width: 400px;
        display: grid;
        grid-template-rows: auto auto auto auto;
        transform: translateY(-80px);
        border: 4px solid #49306B;
        border-radius: 15px;
        padding: 20px;
        background-color: #F9F5F1;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .login_container_box h1 {
        margin: 0;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: bold;
        font-size: 30px;
        text-align: center;
        color: #49306B;
    }

    .login_container_box2 {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .login_container_box2 label {
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: bold;
        font-size: 14px;
        color: #635380;
    }

    .login_container_box2 input {
        flex-grow: 1;
        margin-left: 15px;
        padding: 10px;
        border: 1px solid #635380;
        border-radius: 10px;
        background-color: #FFFFFF;
        font-size: 14px;
        color: #49306B;
        outline: none;
        transition: box-shadow 0.3s ease;
    }

    .login_container_box2 input:focus {
        box-shadow: 0 0 5px #635380;
    }

    .login_container_box3 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 0;
    }

    button {
        all: unset;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-size: 14px;
        font-weight: bold;
        padding: 10px 15px;
        border-radius: 10px;
        border: 2px solid #635380;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .btn-primary {
        background-color: #635380;
        color: #E7D8C5;
    }

    .btn-primary:hover {
        background-color: #49306B;
    }

    .btn-secondary {
        background-color: transparent;
        color: #635380;
    }

    .btn-secondary:hover {
        background-color: #E7D8C5;
        color: #49306B;
    }

    @media (max-width: 500px) {
        .login_container {
            width: 90%;
        }

        .login_container_box2 input {
            width: 100%;
        }

        .login_container_box3 {
            flex-direction: column;
            gap: 10px;
        }

        .btn-primary,
        .btn-secondary {
            width: 100%;
        }
    }
</style>
