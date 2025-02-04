<script lang="ts">
    import { goto } from "$app/navigation";

    export let id: bigint;
    export let name: string;
    export let image: string;
    export let difficulty: string;
    export let liked_at: string;

    // PARSE TIMESTAMP FROM SUPABASE
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    const handleClick = () => {
        goto(`/recipeP/${id}`);
    };

    // REMOVE FROM FAVOURITES
    async function removeFromFavorites() {
        const response = await fetch(`/api/recipeP/${id}/unfavouriteRecipe`, {
            method: 'POST',
            body: new URLSearchParams({ action: 'unFavouriteRecipe' }),
        });

        const responseData = await response.json();
        alert(responseData.message);
        location.reload();
    }
</script>

<div class="recipe-card-container" id={`recipe-card-${id}`}>
    <button class="recipe-card" type="button" on:click={handleClick}>

        {#if id}
            <div class="recipe-image">
                <img src={image} alt={`Image of ${name}`} />
            </div>
            <div class="recipe-info">
                <h3 class="recipe-name">{name}</h3>
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
        width: 100%;
        max-width: 33vw;
        min-width: 250px;
        height: 380px;
        border: 2px solid var(--ultra-violet);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
    }

    .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .recipe-image {
        width: 100%;
        height: 180px;
        background-color: var(--mountbatten-pink);
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .recipe-image img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        object-fit: cover;
    }

    .recipe-info {
        padding: 15px;
        text-align: center;
    }

    .recipe-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--tekhelet);
        margin-bottom: 5px;
    }

    .recipe-difficulty {
        font-size: 1rem;
        color: var(--ultra-violet);
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
