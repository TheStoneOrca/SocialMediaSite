import React, { useEffect, useState } from "react";
import ReplyForm from "./Reply";
import axios from "axios";
import Replify from "../mappers/Reply";

function Comment(detail) {
  const [replies, setReplies] = useState();

  const getReplies = async () => {
    try {
      const replies = await axios.get(
        `http://localhost:4000/api/replies/comment_${detail.commentID}`
      );
      setReplies(replies.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getReplies();
  }, []);

  return (
    <div className="shadow-lg">
      <p>{detail.text}</p>
      <ReplyForm userID={detail.userID} commentID={detail.commentID} />
      {replies ? replies.map(Replify) : null}
    </div>
  );
}

export default Comment;
