<script>
    export let name = "";
    export let onClick = () => { window.location.href = name };
    export let onMouseover = () => {};
    export let onFocus = () => {};
    export let image = "";
    export let difficulty = "";
</script>

<button class="recipe-card"
        type="button"
        tabindex="0"
        on:click={onClick}
        on:focus={onFocus}
        on:mouseover={onMouseover}>
    <div class="recipe-image">
        <img src="{image}" alt="missing_recipe_image"/>
    </div>
    <div class="recipe-info">
        <p class="recipe-name">{name}</p>
        <p class="recipe-difficulty">Difficulty: {difficulty}</p>
    </div>
</button>

<style>
    .recipe-card {
        all: unset;
        margin: 0;
        display: grid;
        max-width: 33vw;
        min-width: 250px;
        height: 350px;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
        gap: 15px;
        background-color: var(--);
        border: 4px solid var(--ultra-violet);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .recipe-image {
        background-color: var(--mountbatten-pink);
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
        padding: 8px;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .recipe-image img {
        width: 100%;
        max-height: 150px;
        object-fit: cover;
        border-radius: 12px;
    }

    .recipe-info {
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 8px;
    }

    .recipe-name {
        font-size: 1.4rem;
        color: var(--tekhelet);
        font-weight: bold;
        text-align: center;
    }

    .recipe-difficulty {
        font-size: 1.1rem;
        color: var(--ultra-violet);
        font-weight: 500;
        text-align: center;
    }

    .recipe-card:hover .recipe-name {
        color: var(--tekhelet);
        text-decoration: underline;
    }

    .recipe-card:focus {
        outline: none;
    }
</style>
