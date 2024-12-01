<script>
    import Category from "../../components/Category.svelte";
</script>

<div class="page-content">
    <Category />
    <Category category="Beef" />
    <Category category="Eggs" />
    <Category category="Vegan" />
    <Category category="Milk" />
</div>

<style>
    @import "/static/pallete.css";

    .page-content {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin: 2rem auto;
        padding: 1rem;
        max-width: 1200px;
    }

    .page-content :global(.category img) {
        width: 100%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .page-content :global(.category h3) {
        margin: 0;
        font-size: 1.5rem;
        color: var(--tekhelet);
    }

    @media (max-width: 768px) {
        .page-content {
            padding: 1rem;
            gap: 15px;
        }

    }
</style>
