<script lang="ts">
    import RecipeCard from "../components/RecipeCard.svelte";
    import { supabase } from '$lib/supabase';

    interface Recipe {
        id: number;
        name: string;
        image: string;
        ck_difficulty: {
            difficulty: string;
        } | null; // Handle potential null values
    }

    let recipes: { name: string; image: string; difficulty: string }[] = [];

    import type { PostgrestResponse } from '@supabase/supabase-js';

    async function loadRecipes() {
        const { data, error }: PostgrestResponse<Recipe> = await supabase
            .from('ck_recipe')
            .select(`
            id,
            name,
            image,
            ck_difficulty (difficulty)
        `);

        if (error) {
            console.error('Error fetching recipes:', error.message);
            recipes = [];
            return;
        }

        console.log('Recipes data with difficulty:', data);

        // Map data to the required format
        recipes = data.map(recipe => ({
            id: recipe.id,
            name: recipe.name || 'Default Name',
            image: recipe.image || '/images/default-image.png',
            difficulty: recipe.ck_difficulty?.difficulty || 'Unknown'
        }));
    }




    loadRecipes();
</script>

<div class="page-content">
    {#each recipes as recipe}
        <RecipeCard name={recipe.name} image={recipe.image} difficulty={recipe.difficulty} id={recipe.id}></RecipeCard>
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
