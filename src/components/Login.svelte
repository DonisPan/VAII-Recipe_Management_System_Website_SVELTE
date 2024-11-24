<script lang="ts">
    import {supabase} from "$lib/supabase";
    import { goto } from '$app/navigation';

    let email: string;
    let password: string;
    let message: string;

    async function login() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            message = `Login failed: ${error.message}`;
            console.error(error);
        } else {
            message = 'Login successful!';
            await goto('/');
            console.log('User session:', data);
        }
    }
</script>

<div class="login_container">
    <div class="login_container_box">
        <h1>Login</h1>
        <p>{message}</p>
    </div>
    <div class="login_container_box login_container_box2">
        <label for="email">E-mail:</label>
        <input type="email" bind:value={email} id="email" name="Email" placeholder="Enter your email">
    </div>
    <div class="login_container_box login_container_box2">
        <label for="password">Password:</label>
        <input type="password" bind:value={password} id="password" name="Password" placeholder="Enter your password">
    </div>
    <div class="login_container_box login_container_box3">
        <button type="button" class="btn-secondary">Cancel</button>
        <div>
            <button type="submit" on:click={login} class="btn-primary">Sign in</button>
            <button type="button" class="btn-secondary">Sign up</button>
        </div>
    </div>
</div>

<style>
    .login_container {
        width: 400px;
        display: grid;
        grid-template-rows: auto auto auto auto;
        gap: 15px;
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
    }

    button {
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
