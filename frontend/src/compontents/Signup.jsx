import React from "react";
import SignupHandler from "../formHandlers/Signup";

function SignupForm() {
  const HandleSubmit = async (event) => {
    await SignupHandler(event);
  };
  return (
    <div>
      <form onSubmit={HandleSubmit}>
        <label>Username</label>
        <input type="text" name="username" />

        <label>Password</label>
        <input type="password" name="password" />

        <label>First Name</label>
        <input type="text" name="fname" />

        <label>Last Name</label>
        <input type="text" name="lname" />

        <label>Email</label>
        <input type="email" name="email" />

        <input type="submit" value="signup" />
      </form>
    </div>
  );
}

export default SignupForm;
