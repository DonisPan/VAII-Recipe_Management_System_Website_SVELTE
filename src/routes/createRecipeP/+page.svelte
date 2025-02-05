<script lang="ts">
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import {recipeSchema} from "$lib/zodSchemas";

    export let data: {
        categories: { id: number; name: string }[];
        ingredients: { id: number; name: string; units: string }[];
    };

    let name = '';
    let description = '';
    let difficulty = '';
    let selectedCategories = writable<number[]>([]);
    let selectedIngredients = writable<{ id: number; name: string; amount: number; units: string }[]>([]);
    let stepList = writable<{ index: number, description: string }[]>([]);

    let selectedIngredientId: number | null = null;
    let ingredientAmount: number | null = null;
    let newStep: string = '';

    // INPUT IMAGE HANDLING
    let imageFile: File | null = null;
    function handleFileInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files?.[0]) {
            imageFile = target.files[0];
        }
    }

    // ADD INGREDIENT
    function addIngredient() {
        if (selectedIngredientId !== null && ingredientAmount !== null && ingredientAmount > 0) {
            const ingredient = data.ingredients.find(ing => ing.id === selectedIngredientId);
            if (ingredient) {
                selectedIngredients.update(ingredients => [
                    ...ingredients,
                    {
                        id: ingredient.id,
                        name: ingredient.name,
                        amount: ingredientAmount ?? 0,
                        units: ingredient.units
                    }
                ]);
                selectedIngredientId = null;
                ingredientAmount = null;
            }
        }
    }

    // REMOVE INGREDIENT
    function removeIngredient(id: number) {
        selectedIngredients.update(ingredients => ingredients.filter(ing => ing.id !== id));
    }

    // ADD STEP
    function addStep() {
        if (newStep.trim() !== '') {
            stepList.update(existingSteps => [
                ...existingSteps,
                { index: existingSteps.length + 1, description: newStep.trim() }
            ]);
            newStep = '';
        }
    }

    // REMOVE STEP
    function removeStep(index: number) {
        stepList.update(existingSteps =>
            existingSteps
                .filter(step => step.index !== index)
                .map((step, i) => ({ index: i + 1, description: step.description }))
        );
    }

    async function handleCreateRecipe(event: SubmitEvent) {
        event.preventDefault();

        let categories;
        let ingredients;
        let steps;
        selectedCategories.subscribe(value => (categories = value))();
        selectedIngredients.subscribe(value => (ingredients = value))();
        stepList.subscribe(value => (steps = value))();

        // VALIDATION
        const validationResult = recipeSchema.safeParse({ name, description, difficulty, imageFile, selectedCategories: categories, selectedIngredients: ingredients, stepList: steps });
        if (!validationResult.success) {
            alert(validationResult.error.errors.map(err => err.message).join('\n'));
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('difficulty', difficulty);
        formData.append('image', imageFile as Blob);
        formData.append('categories', JSON.stringify(categories));
        formData.append('ingredients', JSON.stringify(ingredients));
        formData.append('steps', JSON.stringify(steps));

        const response = await fetch('/api/createRecipeP/createRecipe', {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();
        if (!responseData.success) {
            alert(responseData.message);
            return;
        }

        await goto('/');
    }

</script>

<div class="recipe-page">
    <div class="recipe-header">
        <h1>Create a New Recipe</h1>
    </div>

    <form onsubmit={handleCreateRecipe}>
        <div class="recipe-input-group">
            <label for="name">Recipe Name</label>
            <input id="name" name="name" type="text" bind:value={name} placeholder="Enter recipe name" required />
        </div>

        <div class="recipe-input-group">
            <label for="image">Recipe Image</label>
            <input id="image" name="image" type="file" accept="image/*" onchange={handleFileInput} required />
        </div>

        <div class="recipe-input-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" bind:value={description} placeholder="Enter description" required></textarea>
        </div>

        <div class="recipe-input-group">
            <label for="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" bind:value={difficulty} required>
                <option value="" disabled selected>Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Insane">Insane</option>
            </select>
        </div>

        <div class="recipe-input-group">
            <label for="categories">Select Categories</label>
            <div class="category-list">
                {#each data.categories as category}
                    <label class="category-option">
                        <input type="checkbox" value={category.id} bind:group={$selectedCategories} />
                        {category.name}
                    </label>
                {/each}
            </div>
        </div>

        <div class="recipe-input-group">
            <label for="ingredients">Add Ingredients</label>
            <div class="ingredient-selection">
                <select bind:value={selectedIngredientId}>
                    <option value="" disabled selected>Select Ingredient</option>
                    {#each data.ingredients as ingredient}
                        <option value={ingredient.id}>{ingredient.name} ({ingredient.units})</option>
                    {/each}
                </select>
                <input type="number" min="1" bind:value={ingredientAmount} placeholder="Amount" />
                <button type="button" class="add-ingredient-btn" onclick={addIngredient}>Add</button>
            </div>
        </div>

        <div class="ingredient-list">
            {#each $selectedIngredients as ingredient}
                <div class="ingredient-item">
                    <span class="ingredient-text">{ingredient.name} - {ingredient.amount} {ingredient.units}</span>
                    <button type="button" class="remove-ingredient-btn" onclick={() => removeIngredient(ingredient.id)}>
                        ✖
                    </button>
                </div>
            {/each}
        </div>

        <div class="recipe-input-group">
            <label for="steps">Add Steps</label>
            <div class="step-selection">
                <input type="text" id="steps" bind:value={newStep} placeholder="Enter step instructions" />
                <button type="button" class="add-step-btn" onclick={addStep}>Add</button>
            </div>
        </div>

        <div class="step-list">
            {#each $stepList as step}
                <div class="step-item">
                    <span class="step-text">{step.index}. {step.description}</span>
                    <button type="button" class="remove-step-btn" onclick={() => removeStep(step.index)}>
                        ✖
                    </button>
                </div>
            {/each}
        </div>

        <div class="recipe-actions">
            <button type="submit">Create Recipe</button>
        </div>
    </form>
</div>

<style>
    @import '/pallete.css';

    .recipe-page {
        max-width: 850px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 16px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        background-color: var(--light-dun);
    }

    .recipe-header {
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .recipe-header h1 {
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--tekhelet);
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

    .recipe-input-group input, textarea {
        width: 97%;
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

    .category-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;
        padding: 12px;
        border: 1px solid var(--tekhelet);
        border-radius: 12px;
        background-color: var(--light-dun);
        max-height: 200px;
        overflow-y: auto;
    }

    .category-list::-webkit-scrollbar {
        width: 6px;
    }
    .category-list::-webkit-scrollbar-thumb {
        background: var(--tekhelet);
        border-radius: 6px;
    }
    .category-list::-webkit-scrollbar-track {
        background: var(--light-dun);
    }

    .category-option {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        font-weight: 500;
        color: var(--tekhelet);
        background-color: white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: background-color 0.2s ease, transform 0.1s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .category-option input {
        flex-shrink: 0;
        width: 18px;
        height: 18px;
        accent-color: var(--tekhelet);
    }

    .category-option:hover {
        background-color: var(--mountbatten-pink);
        transform: scale(1.02);
    }

    .ingredient-selection {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .ingredient-list {
        margin-top: 10px;
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

    .ingredient-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-radius: 8px;
        background-color: white;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .ingredient-item:nth-child(even) {
        background-color: #f9f9f9;
    }

    .ingredient-text {
        flex: 1;
        color: var(--tekhelet);
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .remove-ingredient-btn {
        background-color: var(--delete-button);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        padding: 6px 10px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease, transform 0.1s ease;
        min-width: 32px;
        min-height: 32px;
    }

    .remove-ingredient-btn:hover {
        background-color: #bf2116;
        transform: scale(1.1);
    }
    .remove-ingredient-btn:active {
        background-color: #d52519;
        transform: scale(1);
    }

    .ingredient-list::-webkit-scrollbar {
        width: 6px;
    }
    .ingredient-list::-webkit-scrollbar-thumb {
        background: var(--tekhelet);
        border-radius: 6px;
    }
    .ingredient-list::-webkit-scrollbar-track {
        background: var(--light-dun);
    }

    .step-selection {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .step-list {
        margin-top: 10px;
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

    .step-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-radius: 8px;
        background-color: white;
        font-size: 1rem;
        font-weight: 500;
        transition: background-color 0.2s ease, transform 0.1s ease;
    }

    .step-item:nth-child(even) {
        background-color: #f9f9f9;
    }

    .step-text {
        flex: 1;
        color: var(--tekhelet);
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .remove-step-btn {
        background-color: var(--delete-button);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        padding: 6px 10px;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease, transform 0.1s ease;
        min-width: 32px;
        min-height: 32px;
    }

    .remove-step-btn:hover {
        background-color: #bf2116;
        transform: scale(1.1);
    }

    .remove-step-btn:active {
        background-color: #d52519;
        transform: scale(1);
    }

    button {
        background-color: var(--tekhelet);
        color: white;
        font-weight: bold;
        padding: 0.75rem 2rem;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
    }

    button:hover {
        background-color: var(--mountbatten-pink);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    button:active {
        transform: translateY(0);
    }

    .recipe-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 1rem;
    }

    @media (max-width: 768px) {
        .recipe-page {
            padding: 1.5rem;
        }

        .recipe-header h1 {
            font-size: 2.2rem;
        }

        input,
        textarea,
        select {
            font-size: 0.9rem;
        }
    }

</style>