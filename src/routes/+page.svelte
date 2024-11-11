<script>

import RecipeCard from "../components/RecipeCard.svelte";
</script>

<div class="page-content">
    <RecipeCard route="/recipeP"></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
    <RecipeCard></RecipeCard>
</div>

<style>
    .page-content {
        margin: 0;
        justify-content: center;
        align-items: center;
    }
    div {
        display: inline-flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        gap: 1px;
    }
</style>