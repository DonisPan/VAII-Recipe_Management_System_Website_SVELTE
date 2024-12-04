<script lang="ts">
    import { goto } from '$app/navigation';
    export let data: { recipe: any, id: any, currentUser: any, currentRole: any };
    const currentUser = data.currentUser;
    const currentRole = data.currentRole;

    let isEditing = false;
    let recipe = data.recipe;
    let id = data.id;

    function editRecipe() {
        isEditing = !isEditing;
    }

    // DELETE RECIPE
    async function deleteRecipe() {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
        if (!confirmDelete) {
            return;
        }

        const response = await fetch(`/recipeP/${id}?/deleteRecipe`, {
            method: 'POST',
            body: new URLSearchParams({ action: 'deleteRecipe' }),
        });

        if (response.ok) {
            alert('Recipe deleted successfully!');
            await goto('/');
        } else {
            alert('Failed to delete recipe. Please try again.');
        }
    }

    let imageFile: File | null = null;
    function handleFileInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files?.[0]) {
            imageFile = target.files[0];
        }
    }

    async function updateRecipe(event: Event) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const response = await fetch(`/recipeP/${id}?/updateRecipe`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                alert(`Failed to update the recipe: ${error.message}`);

            } else {
                alert('Recipe updated successfully!');
                isEditing = false;
                location.reload();
            }

        } catch (error) {
            console.error('Error updating recipe:', error);
            alert('An unexpected error occurred.');
        }
    }

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

            {#if currentUser === recipe.user_id || currentRole === 'superadmin'}
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

                    <input
                        id="name"
                        type="text"
                        name="name"
                        bind:value={recipe.name}
                        placeholder="Enter recipe name"
                        required />

                    <label for="difficulty">Difficulty:</label>
                    <select
                        id="difficulty"
                        name="difficulty"
                        bind:value={recipe.difficulty}>

                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Insane">Insane</option>
                    </select>

                    <div class="image-input-wrapper">
                        <label for="image">Recipe Image</label>
                        <input
                            id="image"
                            type="file"
                            name="image"
                            accept="image/*"
                            onchange={handleFileInput}
                        />
                    </div>
                </div>

                <div class="recipe-description">
                    <label for="description">Recipe Description</label>

                    <textarea
                        id="description"
                        name="description"
                        bind:value={recipe.description}
                        placeholder="Enter recipe description"
                        required>
                    </textarea>
                </div>

                <div class="buttons">

                    <div class="delete-button">
                        <button
                            type="button"
                            onclick={editRecipe}
                            class="btn-cancel">
                            CANCEL
                        </button>
                    </div>

                    <div class="edit-button">
                        <button type="submit" class="btn-save">
                            SAVE
                        </button>
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
