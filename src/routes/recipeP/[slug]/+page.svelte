<script lang="ts">
    import { supabase } from '$lib/supabase';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
    let id = BigInt(data.recipeId);

    let recipe: {
        name: string;
        description: string;
        image: string;
        difficulty: string;
    } | null = $state(null);

    async function loadRecipe(recipe_id: bigint) {
        const { data, error } = await supabase
            .from('ck_recipe')
            .select('name, description, image, ck_difficulty (difficulty)')
            .eq('id', recipe_id)
            .single();
        if (error) {
            console.error(`Error fetching recipe with ID ${recipe_id}:`, error.message);
        }
        else {
            recipe = {
                name: data.name,
                description: data.description,
                image: data.image || '/images/default-recipe-image.png',
                difficulty: data.ck_difficulty?.difficulty || 'Unknown',
            };
        }
    }

    // Load the recipe on mount
    loadRecipe(id);
</script>

<div class="recipe-page">
    {#if recipe}
        <div class="recipe-header">
            <h1>{recipe.name}</h1>
            <h3>Difficulty: {recipe.difficulty}</h3>
            <img src={recipe.image} alt="recipe_image" />
        </div>
        <div class="recipe-description">
            <h2>Recipe Description</h2>
            <p>{recipe.description}</p>
        </div>
    {:else}
        <p>Loading recipe {id}...</p>
    {/if}
</div>


<style>
    @import '/pallete.css';

    .recipe-page {
        max-width: 850px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .recipe-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .recipe-header h1 {
        font-size: 2.8rem;
        color: var(--tekhelet);
        margin-bottom: 0.5rem;
    }

    .recipe-header h3 {
        font-size: 1.4rem;
        font-weight: 300;
        color: var(--mountbatten-pink);
        margin-bottom: 1rem;
    }

    .recipe-header img {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .recipe-header img:hover {
        transform: scale(1.03);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    }

    .recipe-description
    /*.recipe-ingredients,*/
    /*.recipe-steps */
    {
        background-color: var(--light-dun);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--tekhelet);
        border-left: 6px solid var(--ultra-violet);
        transition: background-color 0.3s ease, border-left-color 0.3s ease;
    }

    h2 {
        font-size: 2rem;
        color: var(--tekhelet);
        margin-bottom: 1rem;
    }

    p,
    ul,
    ol {
        margin: 0;
        color: var(--ultra-violet);
        line-height: 1.8;
    }

    ul {
        padding-left: 1.5rem;
        list-style: disc;
    }

    ol {
        padding-left: 1.5rem;
        list-style: decimal;
    }

    ul li,
    ol li {
        margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
        .recipe-page {
            padding: 1.5rem;
        }

        .recipe-header img {
            max-height: 250px;
        }
    }
</style>
