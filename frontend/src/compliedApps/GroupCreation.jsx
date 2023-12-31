import React, { useEffect, useState } from "react";
import GroupForm from "../compontents/GroupCreateForm";
import getUser from "../fetchers/getUser";

function GroupCreation() {
  const [user, setUser] = useState();

  useEffect(() => {
    (async () => {
      const gottenUser = await getUser();
      setUser(gottenUser);
    })();
  });

  useEffect(() => {
    document.title = "Create a group!";
  });

  return (
    <div>
      {user ? (
        <div>
          <GroupForm />
        </div>
      ) : null}
    </div>
  );
}

export default GroupCreation;
