import React from "react";

function ProfileAvatar(avatar) {
  return (
    <div>
      <div className="rounded-full h-20 w-20">
        <img
          src={avatar.img}
          alt="your profile!"
          className="rounded-full w-full h-full"
        />
      </div>
    </div>
  );
}

export default ProfileAvatar;
