import React, { useEffect } from "react";
import GroupEditForm from "../compontents/Groupform";
import axios from "axios";
import getUser from "../fetchers/getUser";
import { useParams } from "react-router-dom";

function EditGroup() {
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const user = await getUser();
      if (user) {
        const group = await axios.get(`http://localhost:4000/api/group/${id}`);
        if (group.data.groupcreator !== user.userid) {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
    })();
  });

  return (
    <div>
      <GroupEditForm />
    </div>
  );
}

export default EditGroup;
