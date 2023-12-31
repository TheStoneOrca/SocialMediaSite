import axios from "axios";

async function HandleGroupCreateEvent(event, userID) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const groupName = formData.get("name");
  const groupDesc = formData.get("desc");
  const groupRules = formData.get("rules");
  const groupProfile = formData.get("img");

  try {
    const groupProfileFile = new FormData();
    groupProfileFile.append("file", groupProfile);
    groupProfileFile.append("upload_preset", "n3gm5qgo");

    const profile = await axios.post(
      "https://api.cloudinary.com/v1_1/dnslox6ni/image/upload",
      groupProfileFile
    );

    const group = {
      name: groupName,
      description: groupDesc,
      rules: groupRules,
      profile: profile.data.secure_url,
      creator: userID,
    };

    const uploadGroupHold = await axios.post(
      "http://localhost:4000/api/group/create",
      group
    );
    if (uploadGroupHold.data === "Groupname already found!") {
      return "Group name already exists!";
    }
    return uploadGroupHold.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

export default HandleGroupCreateEvent;
