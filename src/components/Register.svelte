<div class="register_container">
    <div class="register_container_box center">
        <h1>Register</h1>
    </div>
    <div class="register_container_box">
        <label for="name">Name:</label>
        <input type="text"
               id="name"
               name="Name">
        <label for="surname">Surname:</label>
        <input type="text"
               id="surname"
               name="Surname">
    </div>
    <div class="register_container_box">
        <label for="gender">Gender:</label><select name="gender" id="gender">
        <option value="">Select gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
    </select>
    </div>
    <div class="register_container_box">
        <label for="email">E-mail:</label>
        <input type="email"
               id="email"
               name="Email">
    </div>
    <div class="register_container_box">
        <label for="password">Password:</label>
        <input type="password"
               id="password"
               name="Email">
    </div>
    <div class="register_container_box">
        <div>
            <button type="button" >Cancel</button>
        </div>
        <div>
            <button type="button" >Sign up</button>
        </div>
    </div>
</div>

<style>
    .register_container {
        width: 600px;
        height: 420px;
        grid-template-rows: 2fr 1fr 1fr 1fr 1fr 1fr;
        display: grid;
        border: #49306B 4px solid;
        border-radius: 15px;
        gap: 10px;
        padding: 10px;
    }

    .register_container_box {
        justify-content: space-between;
        align-content: center;
        display: flex;

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

        label {
            margin: 0;
            padding-left: 10px;
            font-family: "Trebuchet MS", Helvetica, sans-serif;
            font-weight: bold;
            font-size: 15px;
            text-align: center;
            align-self: center;

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

        select {
            width: 85%;
            padding: 5px;
            margin-left: 10px;
            box-sizing: border-box;
            border: #635380 1px solid;
            border-radius: 10px;
            background-color: transparent;
        }
    }
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>