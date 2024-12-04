<script lang="ts">
    import RecipeCard from "../components/RecipeCard.svelte";
    export let data: { recipes: { id: bigint }[] };
</script>

<div class="page-content">

    {#each data.recipes as recipe}
        <RecipeCard id={recipe.id} />
    {/each}

</div>

<style>
    @import '/static/pallete.css';

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
