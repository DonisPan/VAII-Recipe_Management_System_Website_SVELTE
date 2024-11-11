<div class="login_container">
    <div class="login_container_box">
        <h1>Login</h1>
    </div>
    <div class="login_container_box login_container_box2">
        <label for="email">E-mail:</label>
        <input type="email"
               id="email"
               name="Email">
    </div>
    <div class="login_container_box login_container_box2">
        <label for="password">Password:</label>
        <input type="password"
               id="password"
               name="Email">
    </div>
    <div class="login_container_box login_container_box3">
        <div>
            <button type="button" >Cancel</button>
        </div>
        <div>
            <button type="button" >Sign in</button>
            <button type="button" >Sign up</button>
        </div>
    </div>
</div>

<style>
    .login_container {
        width: 600px;
        height: 300px;
        display: grid;
        grid-template-rows: 2fr 1fr 1fr 1fr;
        gap: 10px;
        border: #49306B 4px solid;
        border-radius: 15px;
        padding: 10px;
    }

    .login_container_box {
        justify-content: space-between;
        align-content: center;

        h1 {
            margin: 0;
            font-family: "Trebuchet MS", Helvetica, sans-serif;
            font-weight: bold;
            font-size: 40px;
            text-align: center;
        }

        button {
            font-size: 15px;
            padding: 8px;
            background-color: transparent;
            color: #635380;
            border: #635380 2px solid;
            border-radius: 10px;
        }

        button:hover {
            background-color: #49306B;
            color: #E7D8C5;
        }

        div {
            justify-self: right;
        }
    }
    .login_container_box2 {
        display: flex;

        label {
            margin: 0;
            padding-left: 10px;
            font-family: "Trebuchet MS", Helvetica, sans-serif;
            font-weight: bold;
            font-size: 15px;
            text-align: center;
            align-self: center;
            color: #635380;

        }

        input {
            width: 85%;
            padding: 5px;
            margin-left: 10px;
            box-sizing: border-box;
            border: #635380 1px solid;
            border-radius: 10px;
            background-color: transparent;
            font-size: 15px;
            color: #49306B;
        }
    }

    .login_container_box3 {
        display: flex;
        height: fit-content;
        margin-top: 10px;

        div {
            justify-self: right;
        }
    }
</style>