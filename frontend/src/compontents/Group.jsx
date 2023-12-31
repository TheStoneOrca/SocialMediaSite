import React from "react";

function Groups(group) {
  return <a href={group.link}>{group.title}</a>;
}

export default Groups;
