<script>
    export let route = "#";
    export let onClick = () => {window.location.href = route};
    export let onMouseover = () => {};
    export let onFocus = () => {};
</script>

<button class="recipe-card"
     type = "button"
     tabindex="0"
     on:click={onClick}
     on:focus={onFocus}
     on:mouseover={onMouseover}>
    <div class="recipe_container_box">
        <p>Recipe image</p>
    </div>
    <div class="recipe_container_box">
        <p>Recipe name</p>
    </div>
    <div class="recipe_container_box">
        <p>Recipe difficulty</p>
    </div>
</button>

<style>
    .recipe-card {
        all: unset;
        display: grid;
        max-width: 33vw;
        min-width: 380px;
        grid-template-columns: 1fr;
        grid-template-rows: 6fr 1fr 1fr;
        gap: 10px;
        background-color: #90708C;
        margin-bottom: 10px;
        border: 4px solid #635380;
        border-radius: 8px;
    }
</style>