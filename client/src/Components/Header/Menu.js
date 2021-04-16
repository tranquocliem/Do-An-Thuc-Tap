import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../Service/AccountService";
import { AuthContext } from "../../Context/AuthContext";
import Avatar from "../Avatar/Avatar";

function Menu() {
  const { setIsAuthenticated, user, setUser } = useContext(AuthContext);
  const Logout = () => {
    logout().then((data) => {
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(false);
      }
    });
  };

  return (
    <div className="menu mx-auto">
      <ul className="navbar-nav flex-row">
        <li className="nav-item px-2">
          <NavLink className="nav-link" exact to="/">
            <i className="fas fa-home "></i>
          </NavLink>
        </li>
        <li className="nav-item px-2">
          <NavLink className="nav-link" to="/discover">
            <i className="fas fa-compass"></i>
          </NavLink>
        </li>
        <li className="nav-item px-2">
          <NavLink className="nav-link" to="/tim">
            <i className="fas fa-bookmark"></i>
          </NavLink>
        </li>
        <li className="nav-item dropdown px-2">
          <span
            className="nav-link dropdown-toggle avatar-header no-select"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Avatar user={user} size="medium-avatar" />
          </span>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to={`/profile/${user.username}/`}>
              Trang cá nhân
            </Link>
            <Link className="dropdown-item" to="/saved">
              Cài đặt
            </Link>
            <div className="dropdown-divider" />
            <Link className="dropdown-item" to="/login" onClick={Logout}>
              Đăng xuất
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Menu;
