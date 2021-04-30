import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../Home/Home";
import Login from "../Login/Login";
import Register from "../Register/Register";
import PrivateRouter from "../../ProtectingRouter/PrivateRouter";
import UnPrivateRouter from "../../ProtectingRouter/UnPrivateRouter";
import NotFound from "../NotFound/NotFound";
import Profile from "../Profile/Profile";
import Discover from "../Discover/Discover";
import DetailPost from "../Posts/DetailPost/DetailPost";
import Activate from "../Register/Activate";
import Forget from "../Forget/Forget";
import ResetPass from "../Forget/ResetPass";
function DuongDanURL() {
  return (
    <Switch>
      <PrivateRouter exact path="/" component={Home} />
      <UnPrivateRouter path="/login" component={Login} />
      <UnPrivateRouter path="/register" component={Register} />
      <PrivateRouter path="/profile/:username" component={Profile} />
      <PrivateRouter path="/post/:id" component={DetailPost} />
      <PrivateRouter path="/discover" component={Discover} />
      <UnPrivateRouter path="/user/activate/:token" component={Activate} />
      <UnPrivateRouter path="/forget" component={Forget} />
      <UnPrivateRouter path="/resetPassword/:token" component={ResetPass} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

export default DuongDanURL;
