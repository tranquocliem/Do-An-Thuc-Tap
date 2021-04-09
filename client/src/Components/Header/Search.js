import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { searchUser } from "../../Service/AccountService";
import ListUsers from "./ListUsers";
import ImgLoading from "../../img/loading.gif";

function Search() {
  const [textSearch, setTextSearch] = useState("");
  const [users, setUsers] = useState([]);
  const typingTimeoutRef = useRef(null);

  const [load, setLoad] = useState(false);

  const onChange = (e) => {
    e.preventDefault();

    const { value } = e.target;

    setTextSearch(value.toLowerCase().replace(/ /g, ""));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setLoad(true);

    typingTimeoutRef.current = setTimeout(() => {
      getUsers(value);
    }, 500);
  };

  const onClose = () => {
    setTextSearch("");
    setUsers([]);
  };

  const getUsers = (textSearch) => {
    if (textSearch) {
      searchUser(textSearch)
        .then((data) => {
          if (data.users) {
            setLoad(false);
            setUsers(data.users);
          }
        })
        .catch((err) => {
          toast.error(`🚀 Có lỗi xảy ra`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    } else {
      setUsers([]);
    }
  };

  return (
    <>
      <ToastContainer
        autoClose={2000}
        pauseOnHover={false}
        closeOnClick={false}
      />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="search-form mx-auto"
      >
        <input
          type="text"
          onChange={onChange}
          name="search"
          value={textSearch}
          id="search"
          autoComplete="off"
          spellCheck="false"
        />
        <div
          className="search-icon no-select"
          style={{ fontSize: "14px", opacity: textSearch ? 0 : 0.5 }}
        >
          <i className="fa fa-search" style={{ fontSize: "11px" }}></i>
          <span> Tìm kiếm</span>
        </div>

        <div
          className="close-search"
          onClick={onClose}
          style={{ opacity: textSearch ? 1 : 0 }}
        >
          &times;
        </div>

        {load && (
          <img
            className="loading-seacrch"
            src={ImgLoading}
            alt="loading-search"
          />
        )}

        <div className="list-users">
          {users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user.username}/`}
              onClick={onClose}
            >
              <ListUsers user={user} border="border" />
            </Link>
          ))}
        </div>
      </form>
    </>
  );
}

export default Search;
