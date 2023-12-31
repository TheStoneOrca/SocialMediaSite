import axios from "axios";

async function ReplyHandler(event, userID, commentID) {
  event.preventDefault();
  window.location.reload();

  const formData = new FormData(event.target);

  const replytext = formData.get("replytext");

  const reply = {
    text: replytext,
    commentID: commentID,
    userID: userID,
  };

  try {
    const sendReply = await axios.post(
      "http://localhost:4000/api/reply",
      reply
    );
    if (sendReply.status === 200) {
      return "Success!";
    }
    return "Failure";
  } catch (error) {
    console.error(error);
  }
}

export default ReplyHandler;
