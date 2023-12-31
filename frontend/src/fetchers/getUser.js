import axios from "axios";

async function getUser() {
  const userToken = localStorage.getItem("user_token");
  if (
    userToken ||
    userToken !== "User not found!" ||
    userToken !== "No active user!"
  ) {
    const data = {
      token: userToken,
    };
    try {
      const user = await axios.post("http://localhost:4000/api/getuser", data);
      return user.data;
    } catch (error) {
      console.error(error);
      return error.message;
    }
  } else {
    return "No active user!";
  }
}

export default getUser;
