<script>
    export let category = "Chicken";
    export let route = "#";
    export let onClick = () => {
        window.location.href = route;
    };
    export let onMouseover = () => {};
    export let onFocus = () => {};
</script>

<button
        class="category-card"
        type="button"
        tabindex="0"
        on:click={onClick}
        on:focus={onFocus}
        on:mouseover={onMouseover}>
    <div>
        <p>{category}</p>
    </div>
</button>

<style>
    .category-card {
        display: flex;
        justify-content: center;
        align-items: center;
        max-width: 20vw;
        min-width: 150px;
        height: 4vw;
        padding: 1rem;
        border: 4px solid var(--ultra-violet);
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        cursor: pointer;
    }

    .category-card p {
        margin: 0;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        text-align: center;
        font-size: 1.4rem;
        color: var(--tekhelet);
        font-weight: bold;
        transition: font-size 0.3s ease, color 0.3s ease, text-shadow 0.3s ease;
    }

    .category-card:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    }

    .category-card:hover p {
        font-size: 1.5rem;
        color: var(--ultra-violet);
        text-shadow: 2px 2px var(--mountbatten-pink);
    }

    .category-card:focus {
        outline: none;
        border-color: var(--mountbatten-pink);
        box-shadow: 0 0 0 3px var(--mountbatten-pink);
    }

    .category-card div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    @media (max-width: 768px) {
        .category-card {
            max-width: 40vw;
            height: 8vw;
        }

        .category-card p {
            font-size: 1.2rem;
        }

        .category-card:hover p {
            font-size: 1.3rem;
        }
    }
</style>
