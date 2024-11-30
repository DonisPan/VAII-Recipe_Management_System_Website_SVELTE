<script lang="ts">
    import { supabase } from '$lib/supabase';

    let name: string;
    let description: string;
    let difficulty: string;
    let imageFile: File | null = null;

    // Handle file input
    function handleFileInput(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target?.files?.[0]) {
            imageFile = target.files[0];
        }
    }

    // Submit the recipe to the database
    async function createRecipe() {
        console.log("CREATE RECIPE")
        if (!name || !description || !difficulty) {
            alert('Please fill all the fields.');
            return;
        }

        let imagePath = null;
        if (imageFile) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);

            if (error) {
                console.error('Error uploading image:', error.message);
                return;
            }
            imagePath = data?.path;
        }

        const { error } = await supabase.from('ck_recipe').insert({
            name: name,
            description,
            image: imagePath,
            difficulty: difficulty,
        });

        if (error) {
            console.error('Error saving recipe:', error.message);
            return;
        }

        alert('Recipe created successfully!');
        window.location.href = '/'; // Redirect to the main page
    }
</script>

<div class="recipe-page">
    <div class="recipe-header">
        <h1>Create a New Recipe</h1>
    </div>
    <form on:submit|preventDefault={createRecipe}>
        <div class="recipe-input-group">
            <label for="name">Recipe Name</label>
            <input id="name" type="text" bind:value={name} placeholder="Enter recipe name" required />
        </div>
        <div class="recipe-input-group">
            <label for="image">Recipe Image</label>
            <input id="image" type="file" accept="image/*" on:change={handleFileInput} />
        </div>
        <div class="recipe-input-group">
            <label for="description">Description</label>
            <textarea id="description" bind:value={description} placeholder="Enter description" required></textarea>
        </div>
        <div class="recipe-input-group">
            <label for="difficulty">Difficulty</label>
            <select id="difficulty" bind:value={difficulty}>
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
