import axios from "axios";

async function GroupEdit(event, groupID) {
  try {
    const formData = new FormData(event.target);
    let imgurl;

    const groupname = formData.get("name");
    const desc = formData.get("desc");
    const rules = formData.get("rules");
    const img = formData.get("img");

    if (img.size > 0) {
      const imgData = new FormData();
      imgData.append("file", img);
      imgData.append("upload_preset", "n3gm5qgo");
      const imgdata = await axios.post(
        "https://api.cloudinary.com/v1_1/dnslox6ni/image/upload",
        imgData
      );
      imgurl = imgdata.data.secure_url;
    } else {
      const groupData = await axios.get(
        `http://localhost:4000/api/group/${groupID}`
      );
      imgurl = groupData.data.groupimg;
    }

    const groupDetails = {
      name: groupname,
      desc: desc,
      rules: rules,
      img: imgurl,
    };
    const changeGroup = await axios.patch(
      `http://localhost:4000/api/group/${groupID}/edit`,
      groupDetails
    );
    if (changeGroup.status === 202) {
      window.location.href = `/group/${groupID}`;
    } else {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

export default GroupEdit;
