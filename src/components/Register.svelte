<script lang="ts">
    import {supabase} from "$lib/supabase";

    let name: string;
    let surname: string;
    let email: string;
    let password: string;
    let message: string;
    let gender: string;

    async function signUp() {
        const { data: userData, error: authError } = await supabase.auth.signUp({
            email,
            password
        });

        if (authError) {
            message = `Sign up failed: ${authError.message}`;
            console.error(authError);
            return;
        }

        if (userData.user) {
            // Insert additional user details into the ck_person table
            const { error: profileError } = await supabase
                .from('ck_person')
                .insert({
                    id: userData.user.id, // Supabase user ID
                    name,
                    surname,
                    gender
                });

            if (profileError) {
                message = `Failed to save profile: ${profileError.message}`;
                console.error(profileError);
            } else {
                message = 'Sign up successful! Please check your email to confirm your account.';
            }
        }
    }
</script>

<div class="register_container">
    <div class="register_container_box">
        <h1>Register</h1>
        <p>{message}</p>
    </div>
    <div class="register_container_box register_container_box2">
        <label for="name">Name:</label>
        <input type="text" bind:value={name} id="name" name="Name" placeholder="Enter your first name">
    </div>
    <div class="register_container_box register_container_box2">
        <label for="surname">Surname:</label>
        <input type="text" bind:value={surname} id="surname" name="Surname" placeholder="Enter your last name">
    </div>
    <div class="register_container_box register_container_box2">
        <label for="gender">Gender:</label>
        <select id="gender" name="gender">
            <option value="" disabled selected>Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
        </select>
    </div>
    <div class="register_container_box register_container_box2">
        <label for="email">E-mail:</label>
        <input type="email" bind:value={email} id="email" name="Email" placeholder="Enter your email">
    </div>
    <div class="register_container_box register_container_box2">
        <label for="password">Password:</label>
        <input type="password" bind:value={password} id="password" name="Password" placeholder="Enter your password">
    </div>
    <div class="register_container_box register_container_box3">
        <button type="button" class="btn-secondary">Cancel</button>
        <div>
            <button on:click={signUp} class="btn-primary">Sign up</button>
        </div>
    </div>
</div>

<style>
    .register_container {
        width: 400px;
        display: grid;
        grid-template-rows: auto auto auto auto auto auto auto;
        gap: 15px;
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

    .register_container_box2 {
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
        background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23999999' d='M2 0L0 2h4z'/%3E%3C/svg%3E");
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
