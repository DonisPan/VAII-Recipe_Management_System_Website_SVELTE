<script lang="ts">
    import {onMount} from "svelte";
    import ScrollToTopButton from "../../components/ScrollToTopButton.svelte";
    import FavouriteRecipeCard from "../../components/FavouriteRecipeCard.svelte";
    export let data: {
        recipes: {
            id: bigint,
            name: string,
            image: string,
            difficulty: string,
            liked_at: string,
        }[] };

    let scrollToTopVisible = false;

    onMount(() => {
        const handleScroll = () => {
            scrollToTopVisible = window.scrollY > 320;
        };

        window.addEventListener('scroll', handleScroll);
    });

    let searchQuery = '';
    $: filteredRecipes = data.recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    );
</script>

{#if scrollToTopVisible}
    <ScrollToTopButton />
{/if}

<div class="search-container">
    <input
            type="text"
            placeholder="Search recipes by name..."
            bind:value={searchQuery}

    />
</div>

<div class="page-content">
    {#each filteredRecipes as recipe}
        <FavouriteRecipeCard
                id={recipe.id}
                name={recipe.name}
                image={recipe.image}
                difficulty={recipe.difficulty}
                liked_at={recipe.liked_at}
        />
    {/each}
</div>

<style>
    @import '/static/pallete.css';

    .search-container {
        width: 100%;
        max-width: 600px;
        margin: 5px auto 20px;
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

    @media (max-width: 1400px) {
        .page-content {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 1110px) {
        .page-content {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 830px) {
        .page-content {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 550px) {
        .page-content {
            grid-template-columns: 1fr;
        }
    }
</style>
