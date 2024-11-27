<script lang="ts">
    import { supabase } from '$lib/supabase';

    export let id: bigint;

    let recipe: { name: string; image: string; difficulty: string } | null = null;

    async function loadRecipeDetails() {
        const { data, error } = await supabase
            .from('ck_recipe')
            .select('name, image, ck_difficulty (difficulty)')
            .eq('id', id)
            .single();

        if (error) {
            console.error(`Error loading recipe details for ID ${id}:`, error.message);
            recipe = null;
        } else {
            recipe = {
                name: data.name || 'Unnamed Recipe',
                image: data.image || '/images/default-image.png',
                difficulty: data.ck_difficulty?.difficulty || 'Unknown',
            };
        }
    }

    const handleClick = () => {
        window.location.href = `/recipeP/${id}`; // Pass `id` as query parameter
    };

    // Load details on mount
    loadRecipeDetails();
</script>

<button class="recipe-card" type="button" on:click={handleClick}>
    {#if recipe}
        <div class="recipe-image">
            <img src={recipe.image} alt="missing_recipe_image" />
        </div>
        <div class="recipe-info">
            <p class="recipe-name">{recipe.name}</p>
            <p class="recipe-difficulty">Difficulty: {recipe.difficulty}</p>
        </div>
    {:else}
        <p>Loading...</p>
    {/if}
</button>

<style>
    .recipe-card {
        all: unset;
        margin: 0;
        display: grid;
        max-width: 33vw;
        min-width: 250px;
        height: 350px;
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

    .recipe-card:hover .recipe-name {
        color: var(--tekhelet);
        text-decoration: underline;
    }

    .recipe-card:focus {
        outline: none;
    }
</style>
