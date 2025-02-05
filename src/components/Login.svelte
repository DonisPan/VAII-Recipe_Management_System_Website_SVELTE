<script lang="ts">
    import {goto} from "$app/navigation";
    import {writable} from "svelte/store";
    import {loginSchema} from "$lib/zodSchemas";

    let email = '';
    let password = '';
    let clientError = writable<string | null>(null);

    async function handleLogin(event: SubmitEvent) {
        event.preventDefault();

        clientError.set(null);

        const validationResult = loginSchema.safeParse({ email, password });
        if (!validationResult.success) {
            clientError.set(validationResult.error.errors.map(err => err.message).join(', '));
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        const response = await fetch('/api/loginP/login', {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();
        if (!responseData.success) {
            clientError.set(responseData.message);
            return;
        }

        await goto('/');
        location.reload();
    }
</script>

<div class="page-container">
    <div class="login_container">
        <div class="login_container_box">
            <h1>Login</h1>
            {#if $clientError}
                <p class="error-message">{$clientError}</p>
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
    .page-container {
        margin: 0;
        transform: translateX(-30px);
        display: flex;
        justify-items: center;
    }

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

    .error-message {
        color: #dc2626;
        font-size: 14px;
        text-align: center;
        margin: 10px 0;
        padding: 8px;
        background-color: #fef2f2;
        border: 1px solid #fee2e2;
        border-radius: 8px;
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
