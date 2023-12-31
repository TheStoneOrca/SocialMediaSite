import React, { useEffect, useState } from "react";
import getUser from "../fetchers/getUser";
import EditUser from "../formHandlers/ProfileEdit";
import ProfileAvatar from "../compontents/EditableAvatar";
import axios from "axios";

function ProfileForm() {
  const [user, setUser] = useState();
  const [avatarImg, setAvatarImg] = useState();
  const [result, setResult] = useState();

  const userEdit = async (event) => {
    event.preventDefault();
    const userGot = await getUser();
    const editedResult = await EditUser(event, userGot.userid);
    setResult(editedResult);
  };

  const editProfile = (event) => {
    const profileImg = URL.createObjectURL(event.target.files[0]);
    setAvatarImg(profileImg);
  };

  const deleteUser = async (event) => {
    const gottenUser = await getUser();
    await axios.delete(`http://localhost:4000/api/user/${gottenUser.userid}`);
    localStorage.setItem("user_token", "No active user!");
    window.location.href = "/";
  };

  useEffect(() => {
    (async () => {
      const gottenUser = await getUser();
      setUser(gottenUser);
    })();
  }, []);

  return (
    <div>
      <h1>This is your profile's settings!</h1>
      {user ? (
        <form onSubmit={userEdit}>
          <button type="button" onClick={deleteUser}>
            Delete User
          </button>

          <label>Username</label>
          <input type="text" defaultValue={user.username} name="username" />
          <br />

          <label>Bio</label>
          <input type="text" defaultValue={user.bio} name="bio" />
          <br />

          <label>Profile</label>
          {avatarImg ? (
            <ProfileAvatar img={avatarImg} />
          ) : (
            <ProfileAvatar img={user.userprofile} />
          )}
          <input
            type="file"
            accept=".png, .jpg"
            name="profile"
            onChange={editProfile}
          />
          <br />

          <label>First Name</label>
          <input type="text" defaultValue={user.fname} name="fname" />
          <br />

          <label>Last Name</label>
          <input type="text" defaultValue={user.lname} name="lname" />
          <br />

          <label>Email</label>
          <input type="email" defaultValue={user.email} name="email" />
          <br />

          <input type="submit" value="save" />

          {result ? <h1>{result}</h1> : null}
        </form>
      ) : (
        () => (window.location.href = "/")
      )}
    </div>
  );
}

export default ProfileForm;
