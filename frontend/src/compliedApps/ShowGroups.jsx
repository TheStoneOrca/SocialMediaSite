import HandledGroups from "../mappers/Groups";
import React, { useEffect, useState } from "react";
import getUser from "../fetchers/getUser";
import axios from "axios";

function GroupsPage() {
  const [groups, setGroups] = useState();
  const [user, setUser] = useState();

  const findUser = async () => {
    const foundUser = await getUser();
    setUser(foundUser);
    return foundUser;
  };

  const findGroups = async () => {
    const foundUser = await findUser();
    if (foundUser !== "No user found!") {
      const groups = await axios.get(
        `http://localhost:4000/api/groups/user_${foundUser.userid}`
      );
      setGroups(groups.data);
    }
  };

  useEffect(() => {
    findGroups();
    document.title = "Your groups!";
  }, []);

  return (
    <div>
      {groups ? groups.map(HandledGroups) : <h1>You are not logged in!</h1>}
    </div>
  );
}

export default GroupsPage;
