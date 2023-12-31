import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import GroupEdit from "../formHandlers/GroupEdit";

function GroupEditForm() {
  const [groupData, setGroupData] = useState();
  const [preview, setPreview] = useState();
  const { id } = useParams();

  async function retrieveGroupData() {
    try {
      const group = await axios.get(`http://localhost:4000/api/group/${id}`);
      setGroupData(group.data);
      return group.data;
    } catch (error) {
      console.error(error);
      window.location.href = "/";
    }
  }

  function ChangePreview(event) {
    const groupImg = URL.createObjectURL(event.target.files[0]);
    setPreview(groupImg);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const group = await axios.get(`http://localhost:4000/api/group/${id}`);
    await GroupEdit(event, group.data.groupid);
  };

  const deletegroup = async () => {
    const group = await axios.get(`http://localhost:4000/api/group/${id}`);
    await axios.delete(`http://localhost:4000/api/group/${group.data.groupid}`);
    window.location.href = "/";
  };

  useEffect(() => {
    retrieveGroupData();
  }, []);

  return (
    <div>
      {groupData ? (
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={deletegroup}>
            Delete Group!
          </button>

          <label>Group Name</label>
          <input type="text" defaultValue={groupData.groupname} name="name" />
          <br />

          <label>Group Description</label>
          <input type="text" defaultValue={groupData.groupdesc} name="desc" />
          <br />

          <label>Group Rules</label>
          <input type="text " defaultValue={groupData.rules} name="rules" />
          <br />

          <label>Group Image</label>
          {preview ? (
            <img src={preview} alt="no group image" />
          ) : (
            <img src={groupData.groupimg} alt="no group image" />
          )}
          <input
            type="file"
            accept=".png, .jpg"
            name="img"
            onChange={ChangePreview}
          />

          <input type="submit" value="save" />
        </form>
      ) : (
        () => (window.location.href = "/")
      )}
    </div>
  );
}

export default GroupEditForm;
