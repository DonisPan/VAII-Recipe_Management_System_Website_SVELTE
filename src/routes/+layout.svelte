<script>
    let user = $state({ loggedIn: false });
    function toggle() {
        user.loggedIn = !user.loggedIn;
    }
</script>

<nav>
    <div class="container">
        <p>Cookerino!</p>
        <div class="row left">
            <ul>
                <li> <a href="/">Home</a> </li>
                <li> <a href="/categoriesP">Categories</a> </li>
                {#if user.loggedIn}
                <li> <a href="/profileP">Profile</a> </li>
                <li> <a href="/favouritesP">Favourites</a> </li>
                {/if}
            </ul>
        </div>
        {#if !user.loggedIn}
        <div class="row right">
            <ul>
                <li> <a href="/loginP">Sign in</a> </li>
                <li> <a on:click={toggle} >Sign up</a> </li>
                <li> <a href="/registerP" >Sign up</a> </li>
            </ul>
        </div>
        {:else}
            <div class="row right">
                <ul>
                    <li> <a on:click={toggle} >Logout</a> </li>
                </ul>
            </div>
        {/if}
    </div>
</nav>
<slot />

<style>
    .container {
        overflow: hidden;
        width: 100%;
        transform:
                translateY(-8px)
                translateX(-8px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #635380;
        padding: 0.5em;
        margin: 0;

        border-bottom: 3px solid #49306B;
    }
    .container a {
        text-decoration: none;
        font-size: 1.2rem;
        color: #E7D8C5;
    }
    .container a:hover {
        font-size: 1.3rem;
        text-shadow: #49306B 4px 4px;
    }
    p {
        text-decoration: none;
        font-size: 1.5rem;
        color: #E7D8C5;
        margin-left: 1em;
        padding: 0;
    }

    .row {
        display: inline-flex;
        justify-content: space-between;
        width: 100%;
    }
    .row ul {
        list-style: none;
        display: flex;
        justify-items: center;
    }
    .row ul li {
        margin: 4px;
        padding: 0 1rem;
    }
    .right {
        justify-content: flex-end;
    }
    .left {
        justify-content: flex-start;
    }
</style>