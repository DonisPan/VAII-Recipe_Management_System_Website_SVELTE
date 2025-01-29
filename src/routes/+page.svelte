<script lang="ts">
    import RecipeCard from "../components/RecipeCard.svelte";
    import {onMount} from "svelte";
    export let data: { recipes: { id: bigint, name: string, image: string, difficulty: string }[] };

    let isVisible = false;

    onMount(() => {
        const handleScroll = () => {
            isVisible = window.scrollY > 300;
        };

        window.addEventListener('scroll', handleScroll);
    });

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    let searchQuery = '';
    let filteredRecipes = data.recipes;

    function handleSearch() {
        const query = searchQuery.toLowerCase();
        filteredRecipes = data.recipes.filter((recipe) =>
            recipe.name.toLowerCase().includes(query) ||
            recipe.difficulty.toLowerCase().includes(query)
        );
    }
</script>

{#if isVisible}
    <button class="scroll-to-top" on:click={scrollToTop} aria-label="Scroll to top">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
        </svg>
    </button>
{/if}

<div class="search-container">
    <input
            type="text"
            placeholder="Search recipes by name..."
            bind:value={searchQuery}
            on:input={handleSearch}
    />
</div>

<div class="page-content">
    {#each filteredRecipes as recipe}
        <RecipeCard
                id={recipe.id}
                name={recipe.name}
                image={recipe.image}
                difficulty={recipe.difficulty}
        />
    {/each}
</div>

<style>
    @import '/static/pallete.css';

    .search-container {
        width: 100%;
        max-width: 600px;
        margin: 20px auto;
        margin-top: 5px;
        display: flex;
        justify-content: center;
    }

    .search-container input {
        width: 100%;
        padding: 10px 15px;
        font-size: 1rem;
        border: 2px solid var(--tekhelet);
        border-radius: 8px;
        outline: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .search-container input:focus {
        border-color: var(--ultra-violet);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

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

    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background-color: var(--tekhelet);
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
    }

    .scroll-to-top:hover {
        background-color: var(--ultra-violet);
        transform: scale(1.1);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
    }

    .scroll-to-top:active {
        transform: scale(1);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
