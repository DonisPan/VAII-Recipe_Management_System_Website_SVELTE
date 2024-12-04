<script lang="ts" context="module">
    import type { LayoutData } from './$types';
</script>

<script lang="ts">
    export let data: LayoutData;
    let { user } = data;

    console.log('IN LAYOUT: ', user?.id, user?.role);

    // CHECK ROLE
    function checkRole(): boolean {
        return user.role == 'cook' || user.role == 'superadmin';
    }

    // LOGOUT CLIENT SIDE
    // async function logout() {
    //     const { error } = await supabase.auth.signOut();
    //     if (error) {
    //         console.error('Logout failed:', error.message);
    //     } else {
    //         sessionStorage.clear();
    //         console.log('User logged out successfully');
    //         await goto('/');
    //     }
    // }
    // FOR BUTTON TO PERSIST
    async function logout() {
        console.log('LOGOUT');

    }
</script>

<nav>
    <div class="container">

        <p>Cookerino!</p>

        <div class="row left">

            <ul>
                <li> <a href="/">Home</a> </li>
                <li> <a href="/categoriesP">Categories</a> </li>

                {#if checkRole()}
                    <li> <a href="/createRecipeP">Create Recipe</a> </li>
                {/if}

                {#if user.id}
                    <li> <a href="/profileP">Profile</a> </li>
                    <li> <a href="/favouritesP">Favourites</a> </li>
                {/if}
            </ul>

        </div>

        <div class="row right">
            <ul>

                {#if !user.id}
                    <li> <a href="/loginP">Sign in</a> </li>
                    <li> <a href="/registerP" >Sign up</a> </li>
                {:else}
                    <form method="POST" action="/loginP?/logout">
                        <button type="submit" >Logout</button>
                    </form>

                    <li>
                        <div class="center">
                            <span>{user.id}<br></span>
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
