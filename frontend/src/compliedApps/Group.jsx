import React, { useState, useEffect } from "react";
import Navbar from "../compontents/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import getUser from "../fetchers/getUser";
import HandleGroupJoin from "../formHandlers/HandleGroupJoin";
import GroupData from "../compontents/GroupData";
import PostForm from "../compontents/PostForm";
import Postify from "../mappers/Post";

function Group() {
  const { id } = useParams();
  const [posts, setPosts] = useState();
  const [groupdata, setGroupData] = useState();
  const [user, setUser] = useState();
  const [alreadyJoined, setAlreadyJoined] = useState();

  async function retrievePosts() {
    try {
      const posts = await axios.get(
        `http://localhost:4000/api/posts/group/${id}`
      );
      setPosts(posts.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function retrieveUser() {
    const findUser = await getUser();
    setUser(findUser);
  }

  async function retrieveGroupMember() {
    const foundUser = await getUser();
    if (foundUser !== undefined && foundUser !== "User not found!") {
      const joinedUser = await axios.get(
        `https://localhost:4000/api/group/${id}/member/${foundUser.userid}`
      );
      if (typeof joinedUser.data === "object") {
        setAlreadyJoined(true);
      } else {
        setAlreadyJoined("false");
      }
    } else {
      setAlreadyJoined("loading");
    }
  }

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

  const handleJoin = async (event) => {
    if (!user || user === "User not found!") {
      return;
    }
    const joinMessage = await HandleGroupJoin(event);
    if (typeof joinMessage === "object") {
      window.location.reload();
    }
  };

  useEffect(() => {
    (async () => {
      await retrievePosts();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await retrieveUser();
      await retrieveGroupData();
      await retrieveGroupMember();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const group = await retrieveGroupData();
      document.title = group.groupname;
    })();
  }, []);

  return (
    <div>
      <Navbar />
      {groupdata ? (
        <div>
          <GroupData
            groupname={groupdata.groupname}
            description={groupdata.groupdesc}
            rules={groupdata.rules}
            groupimg={groupdata.groupimg}
          />
          {posts ? (
            <>
              <h2>Posts</h2>
              {posts.map(Postify)}
            </>
          ) : (
            <h2>No posts</h2>
          )}
          {user && user !== "User not found!" ? (
            <>
              <h2>Hello {user.username}!</h2>
              {alreadyJoined && alreadyJoined === true ? (
                <PostForm groupID={id} userID={user.userid} />
              ) : (
                <form onSubmit={handleJoin}>
                  <input type="hidden" value={user.userid} name="userid" />
                  <input type="hidden" value={id} name="group" />
                  <input type="submit" value="Join" />
                </form>
              )}
              {user.userid === groupdata.groupcreator ? (
                <a href={`/group/${id}/edit`}>Edit Group!</a>
              ) : null}
            </>
          ) : null}
        </div>
      ) : (
        <h1>404 Not Found</h1>
      )}
    </div>
  );
}

export default Group;
