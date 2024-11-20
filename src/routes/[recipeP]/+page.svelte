<script>
    import {page} from "$app/stores";
    $: recipe = $page.params.recipeP;
</script>

<div class="recipe-page">
    <div class="recipe-header">
        <h1>{recipe}</h1>
        <h3>by Who</h3>
        <img src="/images/imgTest.png" alt="recipe_image"/>
    </div>
    <div class="recipe-description">
        <h2>Recipe Description</h2>
        <p>This recipe is about recipe haha! A bit more description...</p>
    </div>
    <div class="recipe-ingredients">
        <h2>Ingredients</h2>
        <ul>
            <li>1 cup of something</li>
            <li>2 tbsp of something else</li>
            <li>3 pinches of magic</li>
        </ul>
    </div>
    <div class="recipe-steps">
        <h2>Steps</h2>
        <ol>
            <li>Do this first.</li>
            <li>Then do that.</li>
            <li>Finally, enjoy!</li>
        </ol>
    </div>
</div>

<style>
    @import '/static/pallete.css';

    .recipe-page {
        max-width: 850px;
        margin: 2rem auto;
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
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

    .recipe-header h3 {
        font-size: 1.4rem;
        font-weight: 300;
        color: var(--mountbatten-pink);
        margin-bottom: 1rem;
    }

    .recipe-header img {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .recipe-header img:hover {
        transform: scale(1.03);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
    }

    .recipe-description,
    .recipe-ingredients,
    .recipe-steps {
        background-color: var(--light-dun);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--tekhelet);
        border-left: 6px solid var(--ultra-violet);
        transition: background-color 0.3s ease, border-left-color 0.3s ease;
    }

    h2 {
        font-size: 2rem;
        color: var(--tekhelet);
        margin-bottom: 1rem;
    }

    p,
    ul,
    ol {
        margin: 0;
        color: var(--ultra-violet);
        line-height: 1.8;
    }

    ul {
        padding-left: 1.5rem;
        list-style: disc;
    }

    ol {
        padding-left: 1.5rem;
        list-style: decimal;
    }

    ul li,
    ol li {
        margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
        .recipe-page {
            padding: 1.5rem;
        }

        .recipe-header img {
            max-height: 250px;
        }
    }
</style>
