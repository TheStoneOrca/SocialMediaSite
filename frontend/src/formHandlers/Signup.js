import axios from "axios";

async function SignupHandler(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
  };

  const sendUser = await axios.post("http://localhost:4000/api/signup", user);
  if (sendUser.data === "success!") {
    window.location.href = "/login";
  } else {
    window.location.reload();
  }
}

export default SignupHandler;
