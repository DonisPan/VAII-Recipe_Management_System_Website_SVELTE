<script lang="ts">
    import {goto} from "$app/navigation";
    import {writable} from "svelte/store";
    import {signUpSchema} from "$lib/zodSchemas";

    let name = '';
    let surname = '';
    let email = '';
    let password = '';
    let gender = '';
    let clientError = writable<string | null>(null);

    async function handleSignUp(event: SubmitEvent) {
        event.preventDefault();

        clientError.set(null);

        const validationResult = signUpSchema.safeParse({ name, surname, email, password, gender });
        if (!validationResult.success) {
            clientError.set(validationResult.error.errors.map(err => err.message).join(', '));
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('gender', gender);

        const response = await fetch('/api/registerP/register', {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();
        clientError.set(responseData.message);

        if (!responseData.success) {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // SLEEP FOR 1 SECOND
        await goto('/loginP');
    }
</script>

<div class="register_container">
    <form onsubmit={handleSignUp}>
        <div class="register_container_box">
            <h1>Register</h1>
            {#if $clientError}
                <p class="error-message">{$clientError}</p>
            {/if}
        </div>

        <div class="register_container_box register_container_box2">
            <label for="name">Name:</label>
            <input type="text" id="name" bind:value={name} placeholder="Enter your first name" required>
        </div>

        <div class="register_container_box register_container_box2">
            <label for="surname">Surname:</label>
            <input type="text" id="surname" bind:value={surname} placeholder="Enter your last name" required>
        </div>

        <div class="register_container_box register_container_box2">
            <label for="gender">Gender:</label>
            <select id="gender" bind:value={gender} required>
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div class="register_container_box register_container_box2">
            <label for="email">E-mail:</label>
            <input type="email" id="email" bind:value={email} placeholder="Enter your email" required>
        </div>

        <div class="register_container_box register_container_box2">
            <label for="password">Password:</label>
            <input type="password" id="password" bind:value={password} placeholder="Enter your password" required>
        </div>

        <div class="register_container_box register_container_box3">
            <button type="reset" class="btn-secondary">Cancel</button>
            <button type="submit" class="btn-primary">Sign up</button>
        </div>
    </form>
</div>

<style>
    .register_container {
        width: 400px;
        display: grid;
        grid-template-rows: auto auto auto auto auto auto auto;
        transform: translateY(-80px);
        border: 4px solid #49306B;
        border-radius: 15px;
        padding: 20px;
        background-color: #F9F5F1;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }

    .register_container_box h1 {
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

    .register_container_box2 {
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .register_container_box2 label {
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: bold;
        font-size: 14px;
        color: #635380;
    }

    .register_container_box2 input,
    .register_container_box2 select {
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

    .register_container_box2 input::placeholder {
        color: #A09FA4;
    }

    .register_container_box2 input:focus,
    .register_container_box2 select:focus {
        box-shadow: 0 0 5px #635380;
    }

    .register_container_box2 select {
        appearance: none;
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 8px 10px;
    }

    .register_container_box3 {
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
        .register_container {
            width: 90%;
        }

        .register_container_box2 input,
        .register_container_box2 select {
            width: 100%;
        }

        .register_container_box3 {
            flex-direction: column;
            gap: 10px;
        }

        .btn-primary,
        .btn-secondary {
            width: 100%;
        }
    }
</style>
