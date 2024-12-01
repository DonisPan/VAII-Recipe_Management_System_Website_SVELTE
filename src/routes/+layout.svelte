<script lang="ts">
    import { supabase } from '$lib/supabase';
    import {onMount} from "svelte";
    import {goto} from "$app/navigation";
    let user: { id: string | undefined; email: string | undefined; role: string | undefined } = { id: undefined, email: undefined, role: undefined }; // Default to no user

    // Check the initial session
    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // Fetch the user's role from ck_person
            const { data: profile, error } = await supabase
                .from('ck_person')
                .select('role, id')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                user = { id: undefined, email: undefined, role: undefined };
            } else {
                user = { id: profile.id, email: session.user.email, role: profile.role };
                sessionStorage.setItem('user', JSON.stringify(user.id));
                sessionStorage.setItem('role', JSON.stringify(user.role));
            }
        } else {
            user = { id: undefined, email: undefined, role: undefined };
        }
    }

    supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            checkUser();
        } else {
            user = { id: undefined, email: undefined, role: undefined };
            // sessionStorage.setItem('user', JSON.stringify(user.id));
            // sessionStorage.setItem('role', JSON.stringify(user.role));
            // sessionStorage.clear();
        }
    });

    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout failed:', error.message);
        } else {
            sessionStorage.clear();
            console.log('User logged out successfully');
            await goto('/');
        }
    }
    onMount(() => {
        checkUser();
    })
    // checkUser();
</script>

<nav>
    <div class="container">
        <p>Cookerino!</p>
        <div class="row left">
            <ul>
                <li> <a href="/">Home</a> </li>
                <li> <a href="/categoriesP">Categories</a> </li>
                {#if user.email}
                    <li> <a href="/profileP">Profile</a> </li>
                    <li> <a href="/favouritesP">Favourites</a> </li>
                {/if}
            </ul>
        </div>
        <div class="row right">
            <ul>
                {#if !user.email}
                    <li> <a href="/loginP">Sign in</a> </li>
                    <li> <a href="/registerP" >Sign up</a> </li>
                {:else}
                    <li> <button onclick={logout} >Logout</button> </li>
                    <li>
                        <div class="center">
                            <span>{user.email}<br></span>
                            <span>{user.role}</span>
                        </div>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>
<slot/>
<style>
    @import '/pallete.css';

    .container {
        overflow: hidden;
        width: 100%;
        height: 80px;
        transform: translateY(-8px) translateX(-8px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--ultra-violet);
        padding: 0.5em;
        margin: 0;
        border-bottom: 3px solid var(--tekhelet);
        position: relative;
        z-index: 10;
    }
    .container li {
        align-items: center;
        padding: 0 1rem;
        width: auto;
        justify-content: center;
    }
    .container a {
        text-align: center;
        text-decoration: none;
        font-size: 1.2rem;
        color: #E7D8C5;
        transition: color 0.3s ease;
    }
    .container a:hover {
        font-size: 1.3rem;
        text-shadow: var(--tekhelet) 4px 4px;
    }
    .container p {
        text-decoration: none;
        font-size: 1.5rem;
        color: #E7D8C5;
        margin-left: 1em;
        padding: 0;
        font-weight: bold;
    }

    .row {
        display: inline-flex;
        justify-content: space-between;
        width: 100%;
    }
    .row ul {
        list-style: none;
        display: flex;
        justify-content: space-between;
        gap: 1rem;
    }
    .row button, span {
        all:unset;
        text-align: center;
        text-decoration: none;
        font-size: 1.2rem;
        color: #E7D8C5;
        transition: color 0.3s ease;
    }
    .row span {
        font-size: .9rem;
    }
    .row button:hover {
        font-size: 1.3rem;
        text-shadow: var(--tekhelet) 4px 4px;
    }
    .right {
        justify-content: flex-end;
    }
    .left {
        justify-content: flex-start;
    }
    .center {
        all:unset;
        margin: 0;
        align-items: center;
    }

    /* Mobile-Friendly Layout */
    @media (max-width: 768px) {
        .container {
            flex-direction: column;
            height: auto;
            padding: 1em;
            justify-content: flex-start;
        }
        .container p {
            margin-bottom: 1rem;
            font-size: 1.4rem;
            text-align: center;
        }
        .row {
            display: block;
            width: 100%;
            text-align: center;
        }
        .row ul {
            flex-direction: column;
            justify-content: center;
            gap: 0.8rem;
            margin-top: 10px;
        }
    }

    /* Extra Mobile Styling for Compact View */
    @media (max-width: 400px) {
        .container a {
            font-size: 1rem;
            padding: 0.6rem 0;
        }
        .container p {
            font-size: 1.2rem;
            margin-bottom: 0.8rem;
        }
    }
</style>
