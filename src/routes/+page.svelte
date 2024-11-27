<script lang="ts">
    import RecipeCard from "../components/RecipeCard.svelte";
    import { supabase } from '$lib/supabase';

    interface Recipe {
        id: bigint;
    }

    let recipes: Recipe[] = [];

    async function loadRecipes() {
        const { data, error } = await supabase.from('ck_recipe').select('id');

        if (error) {
            console.error('Error fetching recipes:', error.message);
            recipes = [];
        } else {
            recipes = data.map((recipe) => ({
                id: BigInt(recipe.id), // Convert to bigint
            }));
        }
    }

    loadRecipes();
</script>

<div class="page-content">
    {#each recipes as recipe}
        <RecipeCard id={recipe.id} />
    {/each}
</div>

<style>
    @import '/static/pallete.css';

    .page-content {
        all: unset;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 20px;
        justify-content: space-between;
        width: 100%;
        margin: 0;
        align-items: center;
    }

    @media (max-width: 1400px) {
        .page-content {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 1100px) {
        .page-content {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 800px) {
        .page-content {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 400px) {
        .page-content {
            grid-template-columns: 1fr;
        }
    }
</style>
