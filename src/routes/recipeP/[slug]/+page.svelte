<script lang="ts">
    import { supabase } from '$lib/supabase';
    import type { PageData } from './$types';
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    let id = BigInt(data.recipeId);

    let currentUser: string | null = $state(null);
    let currentRole: string | null = $state(null);

    // Load session data in client-side environment
    onMount(() => {
        currentUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        currentRole = JSON.parse(sessionStorage.getItem('role') || 'null');
    });

    let recipe: {
        user_id: string;
        name: string;
        author: string;
        description: string;
        image: string;
        difficulty: string;
    } | null = $state(null);

    async function loadRecipe() {
        const { data, error } = await supabase
            .from('ck_recipe')
            .select('name, user_id, description, image, difficulty')
            .eq('id', id)
            .single();
        if (error) {
            console.error(`Error fetching recipe with ID ${id}:`, error.message);
            return;
        }
        const authorData = await supabase.from('ck_person').select('name, surname').eq('id', data.user_id).single();

        let imageUrl = '';
        if (data.image) {
            const { data: publicData } = supabase.storage.from('images').getPublicUrl(data.image);
            imageUrl = publicData.publicUrl || imageUrl;
        }
        recipe = {
            user_id: data.user_id,
            name: data.name,
            author: authorData.data?.name + ' ' + authorData.data?.surname || 'Unknown',
            description: data.description,
            image: imageUrl,
            difficulty: data.difficulty || 'Unknown',
        };
    }

    async function deleteRecipe() {
        if (!currentUser || !recipe) {
            alert('You do not have permission to delete this recipe.');
            return;
        }
        console.log(recipe.user_id + "      " + id)
        if (currentUser === recipe.user_id || currentRole === 'superadmin') {
            const { error } = await supabase
                .from('ck_recipe')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting recipe:', error.message);
                alert('Failed to delete the recipe.');
                return;
            }

            alert('Recipe deleted successfully!');
            await goto('/');
        } else {
            alert('You do not have permission to delete this recipe.');
        }
    }

    loadRecipe();
</script>

<div class="recipe-page">
    {#if recipe}
        <div class="recipe-header">
            <h1>{recipe.name}</h1>
            <h3>Author: {recipe.author}</h3>
            <h3>Difficulty: {recipe.difficulty}</h3>
            <img src={recipe.image} alt="recipe_image" />
        </div>
        <div class="recipe-description">
            <h2>Recipe Description</h2>
            <p>{recipe.description}</p>
        </div>
        <div class="recipe-ingredients">
            <h2>Recipe Ingredients</h2>
            <p></p>
        </div>
        <div class="recipe-steps">
            <h2>Recipe Steps</h2>
            <p></p>
        </div>

        <!-- Only show the delete button if the user is logged in and has permission -->
        {#if currentUser && (currentUser === recipe.user_id || currentRole === 'superadmin')}
            <div class="delete-button">
                <button type="button" onclick={deleteRecipe}>DELETE</button>
            </div>
        {/if}
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
        margin: 1px;
        font-size: 1.4rem;
        font-weight: 300;
        color: var(--mountbatten-pink);
    }

    .recipe-header img {
        margin-top: 1rem;
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

    .recipe-description,
    .recipe-ingredients,
    .recipe-steps
    {
        background-color: var(--light-dun);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--tekhelet);
        border-left: 6px solid var(--ultra-violet);
        transition: background-color 0.3s ease, border-left-color 0.3s ease;
    }
    .delete-button {
        display: flex; /* Enable flexbox */
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically (if needed) */
        background-color: var(--light-dun);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .delete-button button {
        background-color: #e63946; /* Bright red */
        color: white; /* White text */
        font-size: 1.2rem; /* Slightly larger text */
        font-weight: bold; /* Bold text */
        padding: 0.8rem 1.5rem; /* Padding for a comfortable click area */
        border: none; /* No default border */
        border-radius: 8px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Subtle shadow */
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    .delete-button button:hover {
        background-color: #d62828; /* Darker red on hover */
        transform: translateY(-2px); /* Slight lift effect */
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3); /* Enhance shadow */
    }

    .delete-button button:active {
        background-color: #c02424; /* Even darker red when pressed */
        transform: translateY(0); /* Reset lift effect */
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2); /* Reduce shadow */
    }

    h2 {
        font-size: 2rem;
        color: var(--tekhelet);
        margin-bottom: 1rem;
    }

    p {
        margin: 0;
        color: var(--ultra-violet);
        line-height: 1.8;
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
