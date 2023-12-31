import React, { useEffect, useState } from "react";
import AvatarMenu from "./AvatarMenu";
import getUser from "../fetchers/getUser";

function Avatar(avatar) {
  const [avatarMenu, showAvatarMenu] = useState(false);
  const [user, setUser] = useState();

  function ShowAvatarMenu() {
    showAvatarMenu(!avatarMenu);
  }

  const retrieveUser = async () => {
    const user = await getUser();
    setUser(user);
  };

  useEffect(() => {
    retrieveUser();
  });

  return (
    <div>
      <div className="rounded-full h-20 w-20" onClick={ShowAvatarMenu}>
        {user ? (
          user.userprofile ? (
            <img
              src={user.userprofile}
              alt="your profile!"
              className="rounded-full w-full h-full"
            />
          ) : (
            <img
              src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
              alt="your profile!"
              className="rounded-full w-full h-full"
            />
          )
        ) : null}
      </div>
      {avatarMenu === true ? (
        <AvatarMenu username={user.username || null} />
      ) : null}
    </div>
  );
}

export default Avatar;
