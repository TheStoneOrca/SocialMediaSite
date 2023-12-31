import React, { useState } from "react";
import HandleGroupCreateEvent from "../formHandlers/CreateGroup";
import getUser from "../fetchers/getUser";

function GroupForm() {
  const [result, setResult] = useState();

  const HandleSubmit = async (event) => {
    try {
      event.preventDefault();

      const gottenUser = await getUser();
      const submitResult = await HandleGroupCreateEvent(
        event,
        gottenUser.userid
      );
      setResult(submitResult);
    } catch (error) {
      console.error(error);
      window.location.reload();
    }
  };

  const redirectToGroup = (groupId) => {
    window.location.href = `/group/${result}`;
  };

  return (
    <div>
      <form onSubmit={HandleSubmit}>
        <label>Title</label>
        <input type="text" name="name" required />

        <label>Description</label>
        <input type="text" name="desc" required />

        <label>Rules</label>
        <input type="text" name="rules" required />

        <label>Image</label>
        <input type="file" accept=".png, .jpg" name="img" required />

        <input type="submit" value="create" />

        {result != null ? (
          result !== "Group name already exists!" ? (
            redirectToGroup()
          ) : (
            <p>{result}</p>
          )
        ) : null}
      </form>
    </div>
  );
}

export default GroupForm;
