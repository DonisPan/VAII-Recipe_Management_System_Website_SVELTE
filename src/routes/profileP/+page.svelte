<script lang="ts">
    import RecipeCard from "../../components/RecipeCard.svelte";
    import {writable} from "svelte/store";
    import {formatDate} from "$lib/functions";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";

    export let data: {
        profile: { name: string; surname: string; role: string };
        recipes: { id: bigint; name: string; image: string; difficulty: string }[];
        requests: { id: string, name: string; surname: string, registered_at: string }[];
        currentUser: any | null ;
    };

    onMount(() => {
        if (!data.currentUser) {
            goto('/');
        }
    })

    let requests = writable(data.requests);

    // MAKE COOK REQUEST
    async function makeCookRequest(): Promise<void> {
        const response = await fetch('/api/profileP/requestCookRole', {
            method: 'POST',
            body: new URLSearchParams({ action: 'requestCookRole' }),
        });
        const responseData = await response.json();
        alert(responseData.message);
    }

    // ACCEPT PROMOTION REQUEST
    async function acceptRequest(userId: string): Promise<void> {
        const response = await fetch('api/profileP/acceptCookRequest', {
            method: 'POST',
            body: new URLSearchParams({ user_id: userId }),
        });

        const responseData = await response.json();
        if (!responseData.success) {
            alert(responseData.message);
            return;
        }
        requests.update((r) => r.filter((req) => req.id !== userId));
    }

    async function declineRequest(userId: string): Promise<any> {
        const response = await fetch('api/profileP/rejectCookRequest', {
            method: 'POST',
            body: new URLSearchParams({ user_id: userId }),
        });

        const responseData = await response.json();
        if (!responseData.success) {
            alert(responseData.message);
        }
        requests.update((r) => r.filter((req) => req.id !== userId));
    }
</script>

<div class="profile-page">
    <!-- PROFILE INFO -->
    <div class="profile-header">
        <h1 class="profile-name">{data.profile.name} {data.profile.surname}</h1>
        <h3 class="role-badge">{data.profile.role}</h3>
    </div>

    {#if data.profile.role === 'regular'}
        <button class="request-cook-button" onclick={makeCookRequest}>
            Request Cook
        </button>
    {/if}

    {#if data.profile.role === 'superadmin'}
        <div class="requests-container">
            <h2>Cook Requests</h2>
            {#if data.requests}
            <div class="request-list">
                    {#each $requests as request}
                        <div class="request-item">
                            <span class="request-text">User: {request.name} {request.surname} - Registered at: {formatDate(request.registered_at)}</span>
                            <div class="request-buttons">
                                <button class="accept-btn" onclick={() => acceptRequest(request.id)}>✔ Accept</button>
                                <button class="reject-btn" onclick={() => declineRequest(request.id)}>✖ Reject</button>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <p class="no-requests">No pending requests.</p>
            {/if}
        </div>
    {/if}

    {#if data.profile.role === 'cook' || data.profile.role === 'superadmin'}
        <div class="profile-recipes">
            <h2>My Recipes:</h2>
            {#if data.recipes.length > 0}
                <div class="recipe-grid">
                    {#each data.recipes as recipe}
                        <RecipeCard
                                id={recipe.id}
                                name={recipe.name}
                                image={recipe.image}
                                difficulty={recipe.difficulty}
                        />
                    {/each}
                </div>
            {:else}
                <p class="no-recipes">You haven’t created any recipes yet.</p>
            {/if}
        </div>
    {/if}
</div>

<style>
    @import '/pallete.css';

    .profile-page {
        max-width: 900px;
        margin: 3rem auto;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        background-color: var(--light-dun);
    }

    .profile-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .profile-header h1 {
        font-size: 2.8rem;
        color: var(--tekhelet);
        margin-bottom: 0.5rem;
    }

    .role-badge {
        display: inline-block;
        background-color: var(--tekhelet);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        padding: 6px 12px;
        border-radius: 8px;
        margin-top: 0.5rem;
    }

    .profile-name {
        font-size: 1.4rem;
        font-weight: 300;
        color: var(--mountbatten-pink);
    }

    /* Request Cook Button */
    .request-cook-button {
        display: block;
        margin: 1rem auto;
        background-color: var(--ultra-violet);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        padding: 10px 20px;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .request-cook-button:hover {
        background-color: var(--tekhelet);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    .request-cook-button:active {
        transform: translateY(0);
    }

    /* Requests Table */
    .requests-container {
        margin-top: 2rem;
        padding: 1rem;
        border-radius: 12px;
        background-color: var(--light-dun);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .requests-container h2 {
        text-align: center;
        font-size: 1.6rem;
        color: var(--tekhelet);
        margin-bottom: 1rem;
    }

    .request-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 200px;
        overflow-y: auto;
        border: 1px solid var(--tekhelet);
        padding: 10px;
        border-radius: 12px;
        background-color: white;
    }

    .request-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        border-radius: 8px;
        background-color: white;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .request-item:nth-child(even) {
        background-color: #f9f9f9;
    }

    .request-text {
        flex: 1;
        color: var(--tekhelet);
        text-align: left;
    }

    .request-buttons {
        display: flex;
        gap: 6px;
    }

    .accept-btn, .reject-btn {
        font-size: 0.9rem;
        font-weight: bold;
        padding: 6px 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .accept-btn {
        background-color: var(--edit-button);
        color: white;
    }

    .reject-btn {
        background-color: var(--delete-button);
        color: white;
    }

    .accept-btn:hover {
        background-color: #2c7a2c;
        transform: scale(1.05);
    }

    .reject-btn:hover {
        background-color: #bf2116;
        transform: scale(1.05);
    }

    .profile-recipes {
        margin-top: 2rem;
    }

    .profile-recipes h2 {
        text-align: center;
        font-size: 2rem;
        color: var(--tekhelet);
        margin-bottom: 1rem;
    }

    .recipe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        justify-content: center;
    }

    .no-recipes, .no-requests {
        text-align: center;
        font-size: 1.2rem;
        color: var(--mountbatten-pink);
        margin-top: 1rem;
    }

    @media (max-width: 860px) {
        .profile-page {
            padding: 1.5rem;
        }

        .profile-header h1 {
            font-size: 2.2rem;
        }

        .recipe-grid {
            justify-items: center;
        }

        .requests-container {
            padding: 0.5rem;
        }
    }
</style>
