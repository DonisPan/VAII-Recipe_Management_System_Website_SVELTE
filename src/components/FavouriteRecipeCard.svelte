<script lang="ts">
    import { goto } from "$app/navigation";

    export let id: bigint;
    export let name: string;
    export let image: string;
    export let difficulty: string;
    export let liked_at: string;

    // FORMAT THE TIMESTAMP FROM SUPABASE
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleString(); // Adjust format as needed
    }

    const handleClick = () => {
        goto(`/recipeP/${id}`);
    };

    // REMOVE FROM FAVOURITES
    async function removeFromFavorites() {

        const response = await fetch(`/recipeP/${id}?/unFavouriteRecipe`, {
            method: 'POST',
            body: new URLSearchParams({ action: 'unFavouriteRecipe' }),
        });

        if (response.ok) {
            console.log(`Recipe ${id} removed from favorites`);
        } else {
            console.error('Failed to remove favorite');
        }
    }
</script>

<div class="recipe-card-container" id={`recipe-card-${id}`}>
    <button class="recipe-card" type="button" on:click={handleClick}>

        {#if id}
            <div class="recipe-image">
                <img src={image} alt={`Image of ${name}`} />
            </div>

            <div class="recipe-info">
                <p class="recipe-name">{name}</p>
                <p class="recipe-difficulty">Difficulty: {difficulty}</p>
                <p class="recipe-timestamp">Liked at: {formatDate(liked_at)}</p>
            </div>

        {:else}
            <p>Loading...</p>
        {/if}

    </button>

    <button class="remove-favorite-btn" on:click={removeFromFavorites}>
        Remove from Favorites
    </button>
</div>

<style>
    .recipe-card-container {
        all: unset;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-width: 250px;
        margin: 2px;
        padding: 0;
    }

    .recipe-card {
        all: unset;
        margin: 0;
        display: grid;
        width: 100%;
        max-width: 33vw;
        min-width: 250px;
        height: 380px;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        gap: 15px;
        background-color: var(--);
        border: 4px solid var(--ultra-violet);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .recipe-image {
        background-color: var(--mountbatten-pink);
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        padding: 8px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .recipe-image img {
        width: 100%;
        max-height: 150px;
        object-fit: cover;
        border-radius: 12px;
    }

    .recipe-info {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }

    .recipe-name {
        font-size: 1.4rem;
        color: var(--tekhelet);
        font-weight: bold;
        text-align: center;
    }

    .recipe-difficulty {
        font-size: 1.1rem;
        color: var(--ultra-violet);
        font-weight: 500;
        text-align: center;
    }

    .recipe-timestamp {
        font-size: 0.9rem;
        color: var(--mountbatten-pink);
        font-style: italic;
    }

    .remove-favorite-btn {
        width: 70%;
        margin-top: 2px;
        padding: 8px 12px;
        border: none;
        background-color: var(--delete-button);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .remove-favorite-btn:hover {
        background-color: #bf2116;
        transform: scale(1.05);
    }

    .remove-favorite-btn:active {
        background-color: #d52519;
        transform: scale(1);
    }

    @media (max-width: 768px) {
        .recipe-card-container {
            max-width: 90%;
        }

        .recipe-card {
            height: auto;
        }

        .recipe-image img {
            max-height: 120px;
        }
    }
</style>
