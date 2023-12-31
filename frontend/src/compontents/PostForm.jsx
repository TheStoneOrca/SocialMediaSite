import React, { useEffect, useState } from "react";
import PostHandle from "../formHandlers/PostHandler";

function PostForm(details) {
  const submitHandler = async (event) => {
    await PostHandle(event, details.groupID, details.userID);
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Title</label>
        <input type="text" name="title" required />

        <label>Content</label>
        <input type="text" name="content" required />

        <label>Video</label>
        <input type="file" accept=".mp4" name="video" />

        <label>Image</label>
        <input type="file" accept=".png, .jpg" name="img" />

        <input type="submit" value="post" />
      </form>
    </div>
  );
}

export default PostForm;
