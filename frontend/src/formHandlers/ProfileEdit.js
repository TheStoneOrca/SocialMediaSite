import axios from "axios";
import getUser from "../fetchers/getUser";

async function EditUser(event, userID) {
  try {
    let imgurl;

    event.preventDefault();
    const formData = new FormData(event.target);

    const username = formData.get("username");
    const bio = formData.get("bio");
    const profile = formData.get("profile");
    const fname = formData.get("fname");
    const lname = formData.get("lname");
    const email = formData.get("email");

    if (profile.size > 0) {
      const imgData = new FormData();
      imgData.append("file", profile);
      imgData.append("upload_preset", "n3gm5qgo");
      const img = await axios.post(
        "https://api.cloudinary.com/v1_1/dnslox6ni/image/upload",
        imgData
      );
      imgurl = img.data.secure_url;
    } else {
      const user = await getUser();
      imgurl = user.userprofile;
    }

    const data = {
      username: username,
      bio: bio,
      profile: imgurl,
      fname: fname,
      lname: lname,
      email: email,
      jwtToken: localStorage.getItem("user_token"),
    };
    const jwtData = await axios.patch(
      `http://localhost:4000/api/user/${userID}/edit`,
      data
    );
    localStorage.setItem("user_token", jwtData.data);
    window.location.href = "/";
    return "success";
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
      return "Username already found!";
    }
  }
}

export default EditUser;
