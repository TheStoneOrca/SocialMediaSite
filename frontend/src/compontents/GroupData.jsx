import React from "react";

function GroupData(data) {
  return (
    <div>
      <h1>{data.groupname}</h1>
      <p>{data.description}</p>
      <h3>{data.rules}</h3>
      <img src={data.groupimg} alt="group-profile" />
    </div>
  );
}

export default GroupData;
