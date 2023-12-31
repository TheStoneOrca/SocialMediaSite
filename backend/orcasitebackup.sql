CREATE DATABASE socialmedia-site;

CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    username TEXT,
    userpass TEXT,
    userprofile TEXT,
    email TEXT,
    fname TEXT,
    lname TEXT,
    bio TEXT
);

CREATE TABLE subgroups (
    groupid SERIAL PRIMARY KEY,
    groupname TEXT,
    groupdesc TEXT,
    rules TEXT,
    groupimg TEXT,
    groupcreator INTEGER REFERENCES users(userid)
);

CREATE TABLE posts (
    postid SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    postimg TEXT,
    posterid INTEGER REFERENCES users(userid),
    postgroup INTEGER REFERENCES subgroups(groupid),
    postvid TEXT
);

CREATE TABLE comments (
    commentid SERIAL PRIMARY KEY,
    commenttext TEXT,
    commentposter INTEGER REFERENCES users(userid),
    commentpostid INTEGER REFERENCES posts(postid)
);

CREATE TABLE groupmember (
    memberid SERIAL PRIMARY KEY,
    joindate DATE,
    joined INTEGER REFERENCES subgroups(groupid),
    joiningpersonid INTEGER REFERENCES users(userid)
);

CREATE TABLE replies (
    replyid SERIAL PRIMARY KEY,
    replytext TEXT,
    replyto INTEGER REFERENCES comments(commentid),
    replyfrom INTEGER REFERENCES users(userid),
    replytoreply INTEGER REFERENCES users(userid)
);
