import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Commentify from "../mappers/Comment";
import getUser from "../fetchers/getUser";
import CommentForm from "../compontents/CommentCreate";

function ShowPost() {
  const { postid } = useParams();
  const [comments, setComments] = useState();
  const [user, setUser] = useState();
  const [post, setPost] = useState();

  const getComments = async () => {
    const comments = await axios.get(
      `http://localhost:4000/api/comments/post_${postid}`
    );
    setComments(comments.data);
  };

  const userRetrieve = async () => {
    const gotUser = await getUser();
    setUser(gotUser);
  };

  useEffect(() => {
    getComments();
    userRetrieve();
    getPost();
  }, []);

  useEffect(() => {
    (async () => {
      const title = await getPost();
      document.title = title[0].title;
    })();
  });

  const getPost = async () => {
    const postDetails = await axios.get(
      `http://localhost:4000/api/post_${postid}`
    );
    if (!postDetails) {
      window.location.href = "/";
    }
    setPost(postDetails.data[0]);
    return postDetails.data;
  };

  return (
    <div>
      {post ? (
        <div>
          <h1>{post.title}</h1>
          <h2>{post.username}</h2>
          <p>{post.description}</p>
          {post.postimg ? (
            <img src={post.postimg} alt={null} />
          ) : post.postvid ? (
            <video src={post.postvid} controls />
          ) : null}
        </div>
      ) : null}
      {comments ? comments.map((coments) => Commentify(coments)) : null}
      {user ? (
        <CommentForm postid={postid} userid={user.userid} key={postid} />
      ) : null}
    </div>
  );
}

export default ShowPost;
