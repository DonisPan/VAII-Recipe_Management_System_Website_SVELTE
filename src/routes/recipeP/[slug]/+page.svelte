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

    let imageUrl: string;
    let imagePath: string;

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

        imagePath = data.image;
        if (data.image) {
            const { data: publicData } = supabase.storage.from('images').getPublicUrl(imagePath);
            imageUrl = publicData.publicUrl || imageUrl;
            console.log(imageUrl);
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

        // Show confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.');
        if (!confirmDelete) {
            // If user clicks "No", exit the function
            return;
        }

        // Proceed with deletion if the user is authorized
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

    let isEditing = $state(false);
    function editRecipe() {
        changeImage = false;
        isEditing = !isEditing;
    }

    let changeImage = $state(false);
    function changeImageFun() {
        changeImage = !changeImage;
    }

    let imageFile: File | null = null;
    function handleFileInput(event: Event) {
        console.log('got here');
        const target = event.target as HTMLInputElement;
        if (changeImage == true && target?.files?.[0]) {
            imageFile = target.files[0];
        }
    }

    async function updateRecipe() {
        if (!currentUser || !recipe) {
            alert('You do not have permission to update this recipe.');
            return;
        }

        // Show confirmation dialog
        const confirmUpdate = window.confirm('Are you sure you want to save changes to this recipe?');
        if (!confirmUpdate) {
            return;
        }

        // If a new image file was selected, upload it to Supabase storage
        if (imageFile) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                console.error('Error uploading image:', error.message);
                alert('Failed to upload the new image.');
                return;
            }

            // Update the file path
            imagePath = data?.path;
        }
            console.log('3' + imagePath);
        // Update the recipe in the database
        const { error } = await supabase.from('ck_recipe').update({
            name: recipe.name,
            difficulty: recipe.difficulty,
            description: recipe.description,
            image: imagePath, // Use the updated or existing file path
        }).eq('id', id);

        if (error) {
            console.error('Error updating recipe:', error.message);
            alert('Failed to update the recipe.');
            return;
        }

        alert('Recipe updated successfully!');
        isEditing = false; // Exit editing mode
        await loadRecipe(); // Reload the recipe to reflect updated data
    }

    onMount(() => {
    loadRecipe();
    })

</script>
{#if !isEditing}
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

            {#if currentUser && (currentUser === recipe.user_id || currentRole === 'superadmin')}
                <div class="buttons">
                    <div class="delete-button">
                        <button type="button" onclick={deleteRecipe}>DELETE</button>
                    </div>
                    <div class="edit-button">
                        <button class="edit-button" type="button" onclick={editRecipe}>EDIT</button>
                    </div>
                </div>
            {/if}
        {:else}
            <p>Loading recipe {id}...</p>
        {/if}
    </div>
{:else if isEditing}
    <div class="recipe-page">
        {#if recipe}
            <form onsubmit={updateRecipe}>
                <div class="recipe-header">
                    <label for="name">Recipe Name</label>
                    <input id="name" type="text" bind:value={recipe.name} required />
                    <label for="difficulty">Difficulty:</label>
                    <select id="difficulty" bind:value={recipe.difficulty}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                    <div class="image-input-wrapper">
                        <label for="image">Recipe Image</label>
                        <input id="image" type="file" accept="image/*" onchange={handleFileInput} />
                    </div>
                </div>

                <div class="recipe-description">
                    <label for="description">Recipe Description</label>
                    <textarea id="description" bind:value={recipe.description} required></textarea>
                </div>

                <div class="buttons">
                    <div class="delete-button">
                        <button type="button" onclick={editRecipe}>CANCEL</button>
                    </div>
                    <div class="edit-button">
                        <button type="submit">SAVE</button>
                    </div>
                </div>
            </form>
        {/if}
    </div>
{/if}


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

    /* Container for the buttons */
    .buttons {
        display: flex; /* Enable flexbox */
        justify-content: center; /* Center horizontally */
        align-items: center; /* Align buttons vertically */
        gap: 1rem; /* Add spacing between buttons */
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
    }

    /* Common styles for buttons */
    .buttons button {
        color: white; /* White text */
        font-size: 1rem; /* Adjust font size */
        font-weight: bold; /* Bold text */
        padding: 0.75rem 1.5rem; /* Padding for a comfortable click area */
        border: none; /* No default border */
        border-radius: 8px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Subtle shadow */
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    /* DELETE button styles */
    .delete-button button {
        background-color: var(--delete-button); /* Bright red */
    }

    .delete-button button:hover {
        background-color: #bf2116; /* Darker red on hover */
        transform: translateY(-2px); /* Slight lift effect */
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3); /* Enhance shadow */
    }

    .delete-button button:active {
        background-color: #d52519; /* Even darker red when pressed */
        transform: translateY(0); /* Reset lift effect */
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2); /* Reduce shadow */
    }

    /* EDIT button styles */
    .edit-button button {
        background-color: var(--edit-button); /* Bright green */
    }

    .edit-button button:hover {
        background-color: #316bff; /* Darker green on hover */
        transform: translateY(-2px); /* Slight lift effect */
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3); /* Enhance shadow */
    }

    .edit-button button:active {
        background-color: #1859ff; /* Even darker green when pressed */
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

    .recipe-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .recipe-header label {
        display: block;
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--tekhelet);
        margin-bottom: 0.5rem;
    }

    .recipe-header input,
    .recipe-header select {
        width: 100%;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid var(--tekhelet);
        border-radius: 8px;
        font-size: 1rem;
        color: var(--tekhelet);
        background-color: white;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .recipe-header input:focus,
    .recipe-header select:focus {
        outline: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

    .recipe-description {
        background-color: var(--light-dun);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--tekhelet);
        border-left: 6px solid var(--ultra-violet);
        transition: background-color 0.3s ease, border-left-color 0.3s ease;
    }

    .recipe-description label {
        font-size: 1.2rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: var(--tekhelet);
    }

    .recipe-description textarea {
        width: 100%;
        height: 150px;
        padding: 0.75rem;
        border: 1px solid var(--tekhelet);
        border-radius: 8px;
        font-size: 1rem;
        resize: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .recipe-description textarea:focus {
        outline: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Buttons container */
    .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        margin-bottom: 1.5rem;
    }

    /* Button styles */
    .buttons button {
        color: white;
        font-size: 1rem;
        font-weight: bold;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
    }

    /* DELETE button styles */
    .delete-button button {
        background-color: var(--delete-button);
    }

    .delete-button button:hover {
        background-color: #bf2116;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    .delete-button button:active {
        background-color: #d52519;
        transform: translateY(0);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    /* SAVE button styles */
    .edit-button button {
        background-color: var(--edit-button);
    }

    .edit-button button:hover {
        background-color: #316bff;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }

    .edit-button button:active {
        background-color: #1859ff;
        transform: translateY(0);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
        .recipe-page {
            padding: 1.5rem;
        }

        .recipe-header img {
            max-height: 250px;
        }
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
