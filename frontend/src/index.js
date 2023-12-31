import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./compliedApps/Home";
import Group from "./compliedApps/Group";
import ShowPost from "./compliedApps/PostPage";
import GroupCreation from "./compliedApps/GroupCreation";
import SignupForm from "./compontents/Signup";
import LoginForm from "./compontents/Login";
import GroupsPage from "./compliedApps/ShowGroups";
import ProfilePage from "./compliedApps/Profile";
import EditGroup from "./compliedApps/EditGroup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <div>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/group/:id" element={<Group />} />
        <Route path="/group/:id/post/:postid" element={<ShowPost />} />
        <Route path="/create/group" element={<GroupCreation />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/group/:id/edit" element={<EditGroup />} />
      </Routes>
    </Router>
  </div>
);
