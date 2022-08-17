import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";

//import toast
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  //Generate a unique roomId
  const createNewRoomId = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created new room");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  const joinRoom = () => {
    if (!userName || !roomId) {
      toast.error("RoomId & Username Required");
      return;
    }
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      },
    });
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          className="homePageLogo"
          src="https://images.unsplash.com/photo-1516876437184-593fda40c7ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGxvZ298ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
          alt="code-sync-logo"
        />
        <h4 className="mainLabel">Paste Invitational ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            value={roomId}
            onKeyUp={handleInputEnter}
            onChange={(e) => setRoomId(e.target.value)}
            className="inputBox"
            placeholder="ROOM ID"
          />
          <input
            type="text"
            value={userName}
            onKeyUp={handleInputEnter}
            onChange={(e) => setUserName(e.target.value)}
            className="inputBox"
            placeholder="USERNAME"
            required
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don`t have an invite then create &nbsp;
            <a onClick={createNewRoomId} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built By{" "}
          <a href="https://www.instagram.com/vishalgupta9218/">Vishal Gupta</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
