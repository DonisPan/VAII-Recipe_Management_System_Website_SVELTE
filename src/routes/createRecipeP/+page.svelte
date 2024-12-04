<script lang="ts">
    export let error: { error: string } | null = null;
</script>

<div class="recipe-page">

    <div class="recipe-header">
        <h1>Create a New Recipe</h1>
        {#if error?.error}
            <p class="error-message">{error.error}</p>
        {/if}
    </div>

    <form method="POST" action="?/createRecipe" enctype="multipart/form-data">

        <div class="recipe-input-group">
            <label for="name">Recipe Name</label>
            <input id="name" name="name" type="text" placeholder="Enter recipe name" required />
        </div>

        <div class="recipe-input-group">
            <label for="image">Recipe Image</label>
            <input id="image" name="image" type="file" accept="image/*" required />
        </div>

        <div class="recipe-input-group">
            <label for="description">Description</label>
            <textarea id="description" name="description" placeholder="Enter description" required></textarea>
        </div>

        <div class="recipe-input-group">
            <label for="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" required>
                <option value="" disabled selected>Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Insane">Insane</option>
            </select>
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
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        background-color: var(--light-dun);
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
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--tekhelet);
    }

    input,
    textarea,
    select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--tekhelet);
        border-radius: 12px;
        font-size: 1rem;
        background-color: var(--light-dun);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
        height: 150px;
    }

    .recipe-actions {
        display: flex;
        justify-content: flex-end;
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
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    button:hover {
        background-color: var(--mountbatten-pink);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    button:active {
        transform: translateY(0);
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
