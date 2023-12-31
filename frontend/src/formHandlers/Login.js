import axios from "axios";

async function LoginHandler(event) {
  event.preventDefault();

  const formData = new FormData(event.target);

  const user = {
    username: formData.get("username"),
    password: formData.get("password"),
  };
  const sendUser = await axios.post("http://localhost:4000/api/login", user);
  console.log(sendUser.data);
  localStorage.setItem("user_token", sendUser.data);
}

export default LoginHandler;
