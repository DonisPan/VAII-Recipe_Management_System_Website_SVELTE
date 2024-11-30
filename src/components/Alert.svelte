<script>
    export let message = '';
    export let type = 'success';
    export let duration = 3000;

    let isVisible = true;

    setTimeout(() => {
        isVisible = false;
    }, duration);
</script>

<style>
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
</style>

{#if isVisible}
    <div class="notification {type} {isVisible ? '' : 'hidden'}">
        {message}
    </div>
{/if}
