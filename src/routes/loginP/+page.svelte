<script lang="ts">
    import Login from "../../components/Login.svelte";
</script>

<div class="page-container">
    <Login />
</div>

<style>
    @import '/pallete.css';
    .page-container {
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
        padding: 20px;
    }

    .login_container_box h1 {
        margin: 0;
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: bold;
        font-size: 30px;
        text-align: center;
        color: #49306B;
    }

    .login_container_box2 label {
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-weight: bold;
        font-size: 14px;
        color: #635380;
    }

    .login_container_box2 input {
        flex-grow: 1;
        margin-left: 15px;
        padding: 10px;
        border: 1px solid #635380;
        border-radius: 10px;
        background-color: #FFFFFF;
        font-size: 14px;
        color: #49306B;
        outline: none;
        transition: box-shadow 0.3s ease;
    }

    .login_container_box2 input:focus {
        box-shadow: 0 0 5px #635380;
    }

    button {
        font-family: "Trebuchet MS", Helvetica, sans-serif;
        font-size: 14px;
        font-weight: bold;
        padding: 10px 15px;
        border-radius: 10px;
        border: 2px solid #635380;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    @media (max-width: 500px) {

        .login_container_box2 input {
            width: 100%;
        }
    }
</style>
