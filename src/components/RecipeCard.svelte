<script lang="ts">
    import {goto} from "$app/navigation";

    export let id: bigint;
    export let name: string;
    export let image: string;
    export let difficulty: string;

    const handleClick = () => {
        goto(`/recipeP/${id}`)
    };
</script>

<button class="recipe-card" type="button" on:click={handleClick}>

    {#if id}
        <div class="recipe-image">
            <img src={image} alt={`Image of ${name}`} />
        </div>
        <div class="recipe-info">
            <h3 class="recipe-name">{name}</h3>
            <p class="recipe-difficulty">Difficulty: {difficulty}</p>
        </div>
    {:else}
        <p>Loading...</p>
    {/if}

</button>

<style>
    .recipe-card {
        all: unset;
        margin: 0;
        max-width: 33vw;
        min-width: 250px;
        height: 350px;
        border: 2px solid var(--ultra-violet);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        overflow: hidden;
    }

    .recipe-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    .recipe-image {
        width: 100%;
        height: 180px;
        background-color: var(--mountbatten-pink);
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .recipe-image img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
        object-fit: cover;
    }

    .recipe-info {
        padding: 15px;
        text-align: center;
    }

    .recipe-name {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--tekhelet);
        margin-bottom: 5px;
    }

    .recipe-difficulty {
        font-size: 1rem;
        color: var(--ultra-violet);
    }

</style>
