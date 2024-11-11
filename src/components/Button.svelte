<script>
    export let onClick = () => {};
    export let onMouseover = () => {};
    export let onMouseenter = () => {};
    export let onMouseleave = () => {};
    export let onFocus = () => {};
</script>

<button
        on:click={onClick}
        on:mouseover={onMouseover}
        on:mouseenter={onMouseenter}
        on:mouseleave={onMouseleave}
        on:focus={onFocus}
>
    <slot />
</button>

<style>
    button {
        font-size: 15px;
        padding: 8px;
        background-color: transparent;
        color: #c89f9c;
        border: #c89f9c 2px solid;
        border-radius: 10px;
    }
</style>
