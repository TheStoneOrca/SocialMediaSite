import React from "react";
import LoginHandler from "../formHandlers/Login";

function LoginForm() {
  const HandleSubmit = async (event) => {
    await LoginHandler(event);
  };
  return (
    <div>
      <form onSubmit={HandleSubmit}>
        <label>Username</label>
        <input type="text" name="username" />

        <label>Password</label>
        <input type="password" name="password" />

        <input type="submit" value="login" />
      </form>
    </div>
  );
}

export default LoginForm;
