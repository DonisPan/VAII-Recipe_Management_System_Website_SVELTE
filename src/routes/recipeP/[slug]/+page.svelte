<script lang="ts">
    import { goto } from '$app/navigation';
    import {updateSchema} from "$lib/zodSchemas";

    export let data: { recipe: any, id: any, currentUser: any, currentRole: any, isFavourite: boolean, };
    const currentUser = data.currentUser;
    const currentRole = data.currentRole;

    let isEditing = false;
    let recipe = data.recipe;
    let id = data.id;

    // CHANGE TO EDITING PAGE
    function editRecipe() {
        isEditing = !isEditing;
    }

    // INPUT IMAGE HANDLING
    let imageFile: File | null = null;
    function handleFileInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files?.[0]) {
            imageFile = target.files[0];
        }
    }

    // FAVOURITE/UNFAVOURITE RECIPE
    let isFavorite = data.isFavourite;
    async function toggleFavorite() {
        if (isFavorite) {
            const response = await fetch(`/api/recipeP/${id}/unfavouriteRecipe`, {
                method: 'POST',
                body: new URLSearchParams({ action: 'unFavouriteRecipe' }),
            });

            const responseData = await response.json();
            if (responseData.success) {
                isFavorite = false;
            }
        } else {
            const response = await fetch(`/api/recipeP/${id}/favouriteRecipe`, {
                method: 'POST',
                body: new URLSearchParams({ action: 'favouriteRecipe' }),
            });

            const responseData = await response.json();
            if (responseData.success) {
                isFavorite = true;
            }
        }
    }

    // DELETE RECIPE
    async function deleteRecipe() {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
        if (!confirmDelete) {
            return;
        }

        const response = await fetch(`/api/recipeP/${id}/deleteRecipe`, {
            method: 'POST',
            body: new URLSearchParams({ action: 'deleteRecipe' }),
        });

        const responseData = await response.json();
        if (responseData.success) {
            await goto('/');
        }
        alert(responseData.message);
    }

    // UPDATE RECIPE
    async function updateRecipe(event: Event) {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const difficulty = formData.get("difficulty") as string;

        const validationResult = updateSchema.safeParse({ name, description, difficulty });
        if (!validationResult.success) {
            alert(validationResult.error.errors.map(err => err.message).join('\n'));
            return;
        }

        const response = await fetch(`/api/recipeP/${id}/updateRecipe`, {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();
        if (responseData.success) {
            isEditing = false;
            location.reload();
        }
        alert(responseData.message);
    }

</script>

{#if !isEditing}
    <div class="recipe-page">
        {#if recipe}
            <!--HEADER-->
            <div class="recipe-header">
                <div class="recipe-title">
                    <h1>{recipe.name}</h1>
                    <!--SHOW FAVOURITE BUTTON ONLY IF USER IS LOGGED IN-->
                    {#if currentRole !== null}
                    <button class="favorite-btn"
                            onclick={toggleFavorite}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                        <svg class={isFavorite ? 'active' : ''}
                             viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </button>
                    {/if}
                </div>
                <!--CATEGORIES-->
                <h3 class="recipe-categories">
                    {#each recipe.categories as category}
                        <span class="recipe-category" data-description={category.description}>
                            {category.name}
                        </span>
                    {/each}
                </h3>
                <!--AUTHOR-->
                <h3>Author: {recipe.author}</h3>
                <!--DIFFICULTY-->
                <h3>Difficulty: {recipe.difficulty}</h3>
                <!--IMAGE-->
                <img src={recipe.image} alt="recipe_image" />
            </div>
            <!--DESCRIPTION-->
            <div class="recipe-description">
                <h2>Recipe Description</h2>
                <p>{recipe.description}</p>
            </div>
            <!--INGREDIENTS-->
            <div class="recipe-ingredients">
                <h2>Recipe Ingredients</h2>
                <div class="ingredient-list">
                    {#each recipe.ingredients as ingredient}
                        <div class="ingredient-item">
                            <span class="ingredient-text">{ingredient.name} - {ingredient.amount} {ingredient.units}</span>
                        </div>
                    {/each}
                </div>
            </div>
            <!--STEPS-->
            <div class="recipe-steps">
                <h2>Recipe Steps</h2>
                <div class="steps-list">
                    {#each recipe.steps as step}
                        <div class="step-item">
                            <span class="step-index">{step.index}.</span>
                            <span class="step-text">{step.description}</span>
                        </div>
                    {/each}
                </div>
            </div>
            <!--SHOW THE DELETE/EDIT BUTTONS ONLY IF THE USER IS THE OWNER OR SUPERADMIN-->
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
            <!--UPDATE RECIPE-->
            <form onsubmit={updateRecipe}>
                <div class="recipe-input-group">
                    <label for="name">Recipe Name</label>
                    <input id="name" name="name" type="text" bind:value={recipe.name} placeholder="Enter recipe name" required />
                </div>

                <div class="recipe-input-group">
                    <label for="difficulty">Difficulty</label>
                    <select id="difficulty" name="difficulty" bind:value={recipe.difficulty} required>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Insane">Insane</option>
                    </select>
                </div>

                <div class="recipe-input-group">
                    <label for="image">Recipe Image</label>
                    <input id="image" name="image" type="file" accept="image/*" onchange={handleFileInput} />
                </div>

                <div class="recipe-input-group">
                    <label for="description">Recipe Description</label>
                    <textarea id="description" name="description" bind:value={recipe.description} placeholder="Enter recipe description" required></textarea>
                </div>

                <div class="buttons">
                    <div class="delete-button">
                        <button type="button" onclick={editRecipe} class="btn-cancel">CANCEL</button>
                    </div>
                    <div class="edit-button">
                        <button type="submit" class="btn-save">SAVE</button>
                    </div>
                </div>
            </form>
        {/if}
    </div>
{/if}



<style>
    @import '/pallete.css';

    /* GENERAL STYLES */
    .recipe-page {
        max-width: 850px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        background-color: var(--light-dun);
    }

    /* HEADER */
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
    }

    /* IMAGE */
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

    .recipe-title {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 10px;
    }

    /* SECTION CONTAINERS */
    .recipe-description,
    .recipe-ingredients,
    .recipe-steps {
        background-color: var(--light-dun);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--tekhelet);
        border-left: 6px solid var(--ultra-violet);
        transition: background-color 0.3s ease, border-left-color 0.3s ease;
    }

    /* TEXT ELEMENTS */
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

    /* CATEGORIES */
    .recipe-categories {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        margin-top: 10px;
    }

    .recipe-category {
        position: relative;
        font-size: 1.2rem;
        font-weight: 500;
        color: var(--mountbatten-pink);
        padding: 6px 12px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .recipe-category::after {
        content: attr(data-description);
        position: absolute;
        bottom: 130%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--light-dun);
        color: var(--tekhelet);
        padding: 6px 10px;
        font-size: 0.9rem;
        border-radius: 8px;
        white-space: nowrap;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, transform 0.2s ease;
    }

    .recipe-category:hover::after {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(-4px);
    }

    /* INGREDIENTS */
    .ingredient-list,
    .steps-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 180px;
        overflow-y: auto;
        border: 1px solid var(--tekhelet);
        padding: 12px;
        border-radius: 12px;
        background-color: var(--light-dun);
    }

    .ingredient-item,
    .step-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        border-radius: 8px;
        background-color: white;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .ingredient-item:nth-child(even),
    .step-item:nth-child(even) {
        background-color: #f9f9f9;
    }

    .ingredient-text,
    .step-text {
        flex: 1;
        color: var(--tekhelet);
        text-align: left;
        white-space: normal;
        word-break: break-word;
        overflow-wrap: anywhere;
        line-height: 1.5;
    }

    .step-index {
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--tekhelet);
        flex-shrink: 0;
        margin-right: 8px;
    }

    /* BUTTONS */
    .buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
    }

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

    /* DELETE BUTTON */
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

    /* EDIT BUTTON */
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

    /* FAVOURITE BUTTON */
    .favorite-btn {
        all: unset;
        margin-left: 1rem;
        position: relative;
        top: 1rem;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
        transition: transform 0.2s ease;
    }

    .favorite-btn:hover {
        transform: scale(1.1);
    }

    .favorite-btn svg {
        width: 32px;
        height: 32px;
        fill: none;
        stroke: var(--tekhelet);
        stroke-width: 2;
        transition: fill 0.3s ease, stroke 0.3s ease;
    }

    .favorite-btn svg.active {
        fill: #FFD700;
        stroke: #FFD700;
    }

    /* SCROLLBAR STYLING */
    .ingredient-list::-webkit-scrollbar,
    .steps-list::-webkit-scrollbar,
    .recipe-categories::-webkit-scrollbar {
        width: 6px;
    }

    .ingredient-list::-webkit-scrollbar-thumb,
    .steps-list::-webkit-scrollbar-thumb,
    .recipe-categories::-webkit-scrollbar-thumb {
        background: var(--tekhelet);
        border-radius: 6px;
    }

    .ingredient-list::-webkit-scrollbar-track,
    .steps-list::-webkit-scrollbar-track,
    .recipe-categories::-webkit-scrollbar-track {
        background: var(--light-dun);
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .recipe-input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 1.1rem;
        font-weight: 500;
        color: var(--tekhelet);
    }

    input,
    textarea,
    select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--tekhelet);
        border-radius: 10px;
        font-size: 1rem;
        background-color: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        transition: box-shadow 0.3s ease;
    }

    input:focus,
    textarea:focus,
    select:focus {
        outline: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    textarea {
        resize: none;
        height: 140px;
    }

    @media (max-width: 768px) {
        .recipe-page {
            padding: 1.5rem;
        }

        .recipe-header h1 {
            font-size: 2.2rem;
        }

        .recipe-header img {
            max-height: 250px;
        }

        .recipe-description,
        .recipe-ingredients,
        .recipe-steps {
            padding: 1rem;
            font-size: 0.9rem;
        }
    }

    @media (max-width: 500px) {
        .recipe-header h1 {
            font-size: 1.8rem;
        }

        .recipe-description,
        .recipe-ingredients,
        .recipe-steps {
            padding: 0.8rem;
            font-size: 0.85rem;
        }

        .recipe-header img {
            max-height: 200px;
        }
    }


</style>
