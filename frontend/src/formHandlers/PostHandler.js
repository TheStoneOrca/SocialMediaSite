import axios from "axios";

async function PostHandle(event, groupID, userID) {
  try {
    event.preventDefault();

    const formData = new FormData(event.target);

    const video = formData.get("video") || null;
    const img = formData.get("img") || null;

    let vidUrl;
    let imgUrl;

    if (video.size > 0) {
      const videoFile = new FormData();
      videoFile.append("file", video);
      videoFile.append("upload_preset", "n3gm5qgo");

      const videoData = await axios.post(
        "https://api.cloudinary.com/v1_1/dnslox6ni/video/upload",
        videoFile
      );
      vidUrl = videoData.data.secure_url;
    }

    if (img.size > 0) {
      if (vidUrl) {
        imgUrl = null;
      } else {
        const imgFile = new FormData();
        imgFile.append("file", img);
        imgFile.append("upload_preset", "n3gm5qgo");

        const imgData = await axios.post(
          "https://api.cloudinary.com/v1_1/dnslox6ni/image/upload",
          imgFile
        );
        imgUrl = imgData.data.secure_url;
      }
    }

    const post = {
      title: formData.get("title"),
      content: formData.get("content"),
      video: vidUrl || null,
      img: imgUrl || null,
      postedIn: groupID,
      postedBy: userID,
    };

    const sendPost = await axios.post(
      "http://localhost:4000/api/post/create",
      post
    );
    window.location.reload();
    return sendPost.data;
  } catch (error) {
    console.error(error);
    return error.message;
  }
}

export default PostHandle;
