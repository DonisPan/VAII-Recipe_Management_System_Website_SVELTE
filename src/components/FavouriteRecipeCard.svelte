<script lang="ts">
    import { goto } from "$app/navigation";
    import {formatDate} from "$lib/functions";

    export let id: bigint;
    export let name: string;
    export let image: string;
    export let difficulty: string;
    export let liked_at: string;

    const handleClick = () => {
        goto(`/recipeP/${id}`);
    };

    async function removeFromFavorites(event: Event) {
        event.stopPropagation();

        const response = await fetch(`/api/recipeP/${id}/unfavouriteRecipe`, {
            method: 'POST',
            body: new URLSearchParams({ action: 'unFavouriteRecipe' }),
        });

        const responseData = await response.json();
        if (!responseData.success) {
            alert(responseData.message);
        }
        location.reload();
    }
</script>

<div class="recipe-card-container" >
    <button class="recipe-card" id={`recipe-card-${id}`} onclick={handleClick}>

        <!-- IMAGE -->
        <div class="recipe-image">
            <img src={image} alt={`Image of ${name}`} />
        </div>

        <!-- INFO -->
        <div class="recipe-info">
            <h3 class="recipe-name">{name}</h3>
            <p class="recipe-difficulty">
                <span class="difficulty-label">Difficulty:</span> {difficulty}
            </p>
            <p class="recipe-timestamp">❤️ Liked: {formatDate(liked_at)}</p>
        </div>

    </button>
        <!-- REMOVE BUTTON -->
        <button class="remove-favorite-btn" onclick={removeFromFavorites} title="Remove from Favorites">
            ✖
        </button>
</div>

<style>
    .recipe-card-container {
        all: unset;
        width: 100%;
        min-width: 260px;
        max-width: 350px;
        position: relative;
    }

    .recipe-card {
        all: unset;
        width: 100%;
        height: 400px;
        border: 2px solid var(--ultra-violet);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
        position: relative;
        cursor: pointer;
    }

    .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    /* IMAGE */
    .recipe-image {
        width: 100%;
        height: 200px;
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

    /* INFO */
    .recipe-info {
        padding: 15px;
        text-align: center;
    }

    .recipe-name {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--tekhelet);
        margin-bottom: 8px;
    }

    .recipe-difficulty {
        font-size: 1rem;
        color: var(--ultra-violet);
        font-weight: bold;
    }

    .difficulty-label {
        font-weight: normal;
        color: var(--mountbatten-pink);
    }

    .recipe-timestamp {
        font-size: 0.9rem;
        color: var(--mountbatten-pink);
        font-style: italic;
        margin-top: 5px;
    }

    /* REMOVE BUTTON */
    .remove-favorite-btn {
        position: absolute;
        top: 12px;
        right: 12px;
        background: var(--delete-button);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    .remove-favorite-btn:hover {
        background-color: #bf2116;
        transform: scale(1.1);
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
