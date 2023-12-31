import React, { useEffect, useState } from "react";
import HandleComment from "../formHandlers/CommentHandler";

function CommentForm(details) {
  const FormHandler = async (event) => {
    event.preventDefault();
    const commentForm = await HandleComment(event, details.postid);
    console.log(commentForm);
  };

  return (
    <div>
      <h2>Comment!</h2>
      <form onSubmit={FormHandler}>
        <input type="text" name="text" />
        <input type="hidden" value={details.userid} name="userID" />
        <input type="submit" value="comment" />
      </form>
    </div>
  );
}

export default CommentForm;
