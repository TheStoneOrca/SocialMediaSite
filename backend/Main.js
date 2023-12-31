import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

const app = express();
const port = 4000;

const db = new pg.Client({
  database: "",
  host: "localhost", //if external database, replace host with connectionstring.
  user: "",
  password: "",
  port: ,
});

db.connect()
  .then((result) => console.log("Connected to db!"))
  .catch((err) => console.error(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("api/posts", async (req, res) => {
  try {
    const posts = await db.query("SELECT * FROM posts");
    res.json(posts.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/posts/group/:id", async (req, res) => {
  try {
    const posts = await db.query(
      "SELECT * FROM posts JOIN subgroups ON subgroups.groupid = posts.postgroup JOIN users ON users.userid = posts.posterid WHERE posts.postgroup = $1",
      [req.params.id]
    );
    if (posts.rows.length > 0) {
      res.json(posts.rows);
    } else {
      res.json(undefined);
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/group/:id", async (req, res) => {
  try {
    const group = await db.query("SELECT * FROM subgroups WHERE groupid = $1", [
      req.params.id,
    ]);
    if (group.rows.length > 0) {
      res.json(group.rows[0]);
      return;
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/comments/post_:postID", async (req, res) => {
  try {
    const post = await db.query(
      "SELECT * FROM comments JOIN posts ON comments.commentpostid = posts.postid JOIN users ON comments.commentposter = users.userid WHERE posts.postid = $1",
      [req.params.postID]
    );
    res.json(post.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/post_:postID", async (req, res) => {
  const post = await db.query(
    "SELECT * FROM posts JOIN users ON posts.posterid = users.userid JOIN subgroups ON posts.postgroup = subgroups.groupid WHERE postid = $1",
    [req.params.postID]
  );
  if (post.rows.length <= 0) {
    return;
  }
  res.json(post.rows);
});

app.post("/api/signup", async (req, res) => {
  const user = req.body;
  try {
    const checkUser = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [user.username]
    );
    if (checkUser.rows.length > 0) {
      return res.json("Username already exists!");
    }

    const checkEmail = await db.query("SELECT * FROM users WHERE email = $1", [
      user.email,
    ]);
    if (checkEmail.rows.length > 0) {
      return res.json("Email already exits!");
    }

    const hashedPass = await bcrypt.hash(user.password, 10);
    await db.query(
      "INSERT INTO users(username, userpass, fname, lname, email) VALUES($1, $2, $3, $4, $5)",
      [user.username, hashedPass, user.fName, user.lName, user.email]
    );
    return res.json("success!");
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/reply", async (req, res) => {
  try {
    const reply = req.body;
    await db.query(
      "INSERT INTO replies(replytext, replyto, replyfrom) VALUES($1, $2, $3)",
      [reply.text, reply.commentID, reply.userID]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/replies/comment_:id", async (req, res) => {
  const comments = await db.query("SELECT * FROM replies WHERE replyto = $1", [
    req.params.id,
  ]);
  if (comments.rows.length < 0) {
    return;
  }
  res.json(comments.rows);
});

app.post("/api/login", async (req, res) => {
  try {
    const user = req.body;
    const checkUsername = await db.query(
      "SELECT * FROM users WHERE username = $1",
      [user.username]
    );
    if (checkUsername.rows.length < 1) {
      return res.json("User not found!");
    }
    const PasswordCheck = await bcrypt.compare(
      user.password,
      checkUsername.rows[0].userpass
    );
    if (PasswordCheck) {
      const jwt = Jwt.sign(
        checkUsername.rows[0],
        "207836b2-5932-4350-b9cb-28fcf8a0439c",
        {
          expiresIn: "24h",
        }
      );
      res.json(jwt);
    } else {
      return res.json("User not found!");
    }
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/getuser", async (req, res) => {
  Jwt.verify(
    req.body.token,
    "207836b2-5932-4350-b9cb-28fcf8a0439c",
    (err, data) => {
      if (err) {
        console.error(err);
        return res.json("Unauthorized");
      }
      res.json(data);
    }
  );
});

app.post("/api/comment/create", async (req, res) => {
  try {
    const comment = req.body;
    await db.query(
      "INSERT INTO comments(commenttext, commentposter, commentpostid) VALUES($1, $2, $3)",
      [comment.text, comment.userID, comment.postID]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/group/create", async (req, res) => {
  const group = req.body;
  try {
    const checkName = await db.query(
      "SELECT * FROM subgroups WHERE LOWER(groupname) = $1",
      [group.name.toLowerCase()]
    );
    if (checkName.rows.length > 0) {
      return res.json("Groupname already found!");
    }
    const subGroup = await db.query(
      "INSERT INTO subgroups(groupname, groupdesc, rules, groupimg, groupcreator) VALUES($1, $2, $3, $4, $5) RETURNING groupid",
      [
        req.body.name,
        req.body.description,
        req.body.rules,
        req.body.profile,
        Number(req.body.creator),
      ]
    );

    await db.query(
      "INSERT INTO groupmember(joindate, joined, joiningpersonid) VALUES($1, $2, $3)",
      [new Date(), subGroup.rows[0].groupid, Number(req.body.creator)]
    );

    res.json(subGroup.rows[0].groupid);
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/group/:groupID/member/:userID", async (req, res) => {
  try {
    if (req.params.userID === "undefined") {
      return;
    }
    const user = await db.query(
      "SELECT * FROM groupmember WHERE joiningpersonid = $1 AND joined = $2",
      [req.params.userID, req.params.groupID]
    );
    if (user.rows.length > 0) {
      return res.json(user.rows[0]);
    }
    res.json("Error: Not found in group!");
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/groups/user_:id", async (req, res) => {
  try {
    const groups = await db.query(
      "SELECT * FROM subgroups JOIN groupmember ON groupmember.joined = subgroups.groupid WHERE groupmember.joiningpersonid = $1",
      [req.params.id]
    );
    if (groups.rows.length < 0) {
      return;
    }
    res.json(groups.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/joingroup/:id", async (req, res) => {
  const userDetails = req.body;
  try {
    const checkUser = await db.query(
      "SELECT * FROM groupmember WHERE joiningpersonid = $1 AND joined = $2",
      [userDetails.userID, req.params.id]
    );
    if (checkUser.rows.length > 0) {
      return res.json("Already joined!");
    }
    await db.query(
      "INSERT INTO groupmember(joindate, joined, joiningpersonid) VALUES($1, $2, $3)",
      [new Date(), req.params.id, userDetails.userID]
    );
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/post/create", async (req, res) => {
  const post = req.body;
  try {
    await db.query(
      "INSERT INTO posts(title, description, postvid, postimg, postgroup, posterid) VALUES($1, $2, $3, $4, $5, $6)",
      [
        post.title,
        post.content,
        post.video,
        post.img,
        Number(post.postedIn),
        post.postedBy,
      ]
    );
    res.json("Success!");
  } catch (error) {
    console.error(error);
  }
});

app.patch("/api/user/:id/edit", async (req, res) => {
  try {
    const userDetails = req.body;
    let checkUser;
    Jwt.verify(
      req.body.jwtToken,
      "207836b2-5932-4350-b9cb-28fcf8a0439c",
      (err, data) => {
        if (err) {
          console.error(err);
          return res.json("Unauthorized");
        }
        checkUser = data;
      }
    );
    if (checkUser.username !== userDetails.username) {
      const checkUserName = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [userDetails.username]
      );
      if (checkUserName.rows.length > 0) {
        return res.sendStatus(404);
      }
    }
    const user = await db.query(
      "UPDATE users SET username = $1, userprofile = $2, email = $3, fname = $4, lname = $5, bio = $6 WHERE userid = $7 RETURNING *",
      [
        userDetails.username,
        userDetails.profile,
        userDetails.email,
        userDetails.fname,
        userDetails.lname,
        userDetails.bio,
        req.params.id,
      ]
    );
    const jwt = Jwt.sign(user.rows[0], "207836b2-5932-4350-b9cb-28fcf8a0439c", {
      expiresIn: "24h",
    });
    res.json(jwt);
  } catch (error) {
    console.error(error);
  }
});

app.patch("/api/group/:id/edit", async (req, res) => {
  try {
    const groupDetails = req.body;
    const checkUser = await db.query(
      "SELECT * FROM subgroups WHERE groupid = $1",
      [req.params.id]
    );
    if (checkUser.rows[0].groupname !== groupDetails.name) {
      const checkName = await db.query(
        "SELECT * FROM subgroups WHERE LOWER(groupname) = $1",
        [groupDetails.name.toLowerCase()]
      );
      if (checkName.rows.length > 0) {
        return res.json("Groupname already found!");
      }
    }
    await db.query(
      "UPDATE subgroups SET groupname = $1, groupdesc = $2, rules = $3, groupimg = $4 WHERE groupid = $1",
      [
        groupDetails.name,
        groupDetails.desc,
        groupDetails.rules,
        groupDetails.img,
        req.params.id,
      ]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/user/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM replies WHERE replyfrom = $1", [req.params.id]);
    await db.query("DELETE FROM comments WHERE commentposter = $1", [
      req.params.id,
    ]);
    await db.query("DELETE FROM posts WHERE posterid = $1", [req.params.id]);
    await db.query("DELETE FROM groupmember WHERE joiningpersonid = $1 ", [
      req.params.id,
    ]);
    await db.query("DELETE FROM subgroups WHERE groupcreator = $1", [
      req.params.id,
    ]);
    await db.query("DELETE FROM users WHERE userid = $1", [req.params.id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/group/:id", async (req, res) => {
  try {
    const comments = await db.query(
      "SELECT * FROM posts JOIN comments ON comments.commentpostid = posts.postid WHERE posts.postgroup = $1",
      [req.params.id]
    );
    for (const replies of comments.rows) {
      await db.query("DELETE FROM replies WHERE replyto = $1", [
        replies.commentid,
      ]);
    }
    for (const comment of comments.rows) {
      await db.query("DELETE FROM comments WHERE commentpostid = $1", [
        comment.postid,
      ]);
    }
    await db.query("DELETE FROM posts WHERE postgroup = $1", [req.params.id]);
    await db.query("DELETE FROM groupmember WHERE joined = $1", [
      req.params.id,
    ]);
    await db.query("DELETE FROM subgroups WHERE groupid = $1", [req.params.id]);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on ${port}!`);
});

