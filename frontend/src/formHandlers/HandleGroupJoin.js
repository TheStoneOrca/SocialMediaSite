import axios from "axios";

async function HandleJoin(event) {
  event.preventDefault();
  window.location.reload();

  const formData = new FormData(event.target);

  const userID = formData.get("userid");
  const groupID = formData.get("group");
  const user = {
    userID: userID,
  };
  try {
    const getUser = await axios.post(
      `http://localhost:4000/api/joingroup/${groupID}`,
      user
    );
    return getUser.data;
  } catch (error) {
    return error.message;
  }
}

export default HandleJoin;
