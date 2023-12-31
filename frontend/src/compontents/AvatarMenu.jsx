import React from "react";

function AvatarMenu(menu) {
  return (
    <div className="rounded-sm shadow-md w-44 h-52">
      <h1>Hello {menu.username}</h1>
      <a href="/profile">Profile</a>
      <br />
      <a href="/groups">Groups</a>
    </div>
  );
}

export default AvatarMenu;
