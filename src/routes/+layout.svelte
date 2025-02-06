<script lang="ts">
    import type { LayoutData } from './$types';
    import {goto} from "$app/navigation";
    import {writable} from "svelte/store";

    export let data: LayoutData;
    let user = writable(data.user);

    async function logout(): Promise<void> {
        const response = await fetch('/api/loginP/logout', {
            method: 'POST',
            body: new URLSearchParams({ action: 'logout' }),
        });

        const responseData = await response.json();
        if (!responseData.success) {
            return;
        }
        await goto('/');
        location.reload();
    }
</script>

<nav>
    <div class="container">

        <p>Cookerino!</p>

        <div class="row left">

            <ul>
                <li> <a href="/">Home</a> </li>

                {#if $user.role && $user.role !== 'regular'}
                    <li> <a href="/createRecipeP">Create Recipe</a> </li>
                {/if}

                {#if $user.id}
                    <li> <a href="/profileP">Profile</a> </li>
                    <li> <a href="/favouritesP">Favourites</a> </li>
                {/if}
            </ul>

        </div>

        <div class="row right">
            <ul>

                {#if !$user.id}
                    <li> <a href="/loginP">Sign in</a> </li>
                    <li> <a href="/registerP" >Sign up</a> </li>
                {:else}
                    <button type="submit" onclick={logout}>Logout</button>

                    <li>
                        <div class="center">
                            <span>{$user.id}<br></span>
                            <span>{$user.role}</span>
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

    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

    .container {
        overflow: hidden;
        width: 100%;
        height: 80px;
        transform: translateY(-8px) translateX(-8px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--ultra-violet);
        padding: 0.5em 1em;
        border-bottom: 3px solid var(--tekhelet);
        position: relative;
        z-index: 10;
        transition: all 0.3s ease-in-out;

        p {
            text-decoration: none;
            font-size: 1.5rem;
            color: #E7D8C5;
            font-weight: bold;
            margin: 0;
        }
    }

    .row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 1rem;
    }

    .left {
        display: flex;
        justify-content: flex-start;
        flex-grow: 1;
    }

    .left ul {
        list-style: none;
        display: flex;
        gap: 1rem;
        margin-left: 1rem;
        padding: 0;
        align-items: center;
    }

    .left a {
        all: unset;
        font-size: 1.2rem;
        color: #E7D8C5;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.3s ease, font-size 0.3s ease;
        font-family: 'Roboto', sans-serif;
    }

    .left a:hover {
        font-size: 1.3rem;
        text-shadow: var(--tekhelet) 2px 2px;
    }


    .right {
        display: flex;
        justify-content: flex-end;
        flex-grow: 0;
        margin-left: auto;
    }

    .right ul {
        list-style: none;
        display: flex;
        gap: 1rem;
        margin-right: 1rem;
        padding: 0;
        align-items: center;
    }

    .right a, .right button, .right span {
        all: unset;
        font-size: 1.2rem;
        color: #E7D8C5;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.3s ease, font-size 0.3s ease;
        font-family: 'Roboto', sans-serif;
    }

    .right a:hover, .right button:hover {
        font-size: 1.3rem;
        text-shadow: var(--tekhelet) 2px 2px;
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
        .container {
            flex-direction: row;
            height: auto;
            padding: 1em;
        }

        .row {
            width: 100%;
        }
    }

    @media (max-width: 650px) {
        .container {
            flex-direction: column;
            height: auto;
            padding: 1em;
            align-items: center;
        }

        .row {
            flex-direction: column;
            width: 100%;
            align-items: center;
        }

        .left, .right {
            justify-content: center;
            width: 100%;
        }

        .left ul, .right ul {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
            margin: 0;
        }

        .right {
            margin-left: 0;
        }
    }

    @media (max-width: 400px) {
        .container {
            padding: 0.8em 0.5em;
        }

        p {
            font-size: 1.2rem;
        }

        .right ul, .left ul {
            gap: 0.4rem;
        }

        .right a, .right button, .right span, .left a {
            font-size: 0.9rem;
        }
    }

</style>
