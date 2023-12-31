import React from "react";
import ReplyHandler from "../formHandlers/ReplyHandler";

function ReplyForm(reply) {
  const handleReply = async (event) => {
    await ReplyHandler(event, reply.userID, reply.commentID);
  };

  return (
    <div>
      <form onSubmit={handleReply}>
        <input type="text" name="replytext" />
        <input type="submit" value="reply" />
      </form>
    </div>
  );
}

export default ReplyForm;
