<script lang="ts">
    import { onMount } from "svelte";
    import ScrollToTopButton from "../../components/ScrollToTopButton.svelte";
    import FavouriteRecipeCard from "../../components/FavouriteRecipeCard.svelte";
    import { writable } from "svelte/store";
    import {goto} from "$app/navigation";

    export let data: {
        recipes: { id: bigint, name: string, image: string, difficulty: string, liked_at: string }[]
        currentUser: any | null ;
    };

    let scrollToTopVisible = false;

    onMount(() => {
        if (!data.currentUser) {
            goto('/');
        }

        const handleScroll = () => {
            scrollToTopVisible = window.scrollY > 320;
        };

        window.addEventListener("scroll", handleScroll);
    });

    let filteredRecipes = writable(data.recipes);
    let searchQuery = '';

    function handleSearch() {
        filteredRecipes.set(
            data.recipes.filter(recipe =>
                recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                recipe.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }
</script>

{#if scrollToTopVisible}
    <ScrollToTopButton />
{/if}

<!-- SEARCH BAR -->
<div class="search-container">
    <input type="text" placeholder="Search recipes..." bind:value={searchQuery} oninput={handleSearch} />
</div>

<div class="page-content">
    {#each $filteredRecipes as recipe}
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

    /* SEARCH */
    .search-container {
        width: 100%;
        max-width: 600px;
        margin: 10px auto 20px;
        display: flex;
        justify-content: center;
    }

    .search-container input {
        width: 100%;
        padding: 12px 15px;
        font-size: 1rem;
        border: 2px solid var(--tekhelet);
        border-radius: 10px;
        outline: none;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .search-container input:focus {
        border-color: var(--ultra-violet);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    /* GRID */
    .page-content {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 20px;
        width: 100%;
        margin-top: 20px;
        padding: 0 20px;
        justify-items: center;
    }

    @media (max-width: 550px) {
        .page-content {
            grid-template-columns: 1fr;
        }
    }
</style>
