import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Data } from "./Home";
import { Box, List } from "@mui/material";
import card1 from "../assets/card-1.png";

const RoomList: React.FC = () => {
  const data = useContext(Data);

  if (Array.isArray(data)) {
    return (
      <Box sx={{ width: "100%" }}>
        <List
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem",
          }}
        >
          {data.map((room, index) => (
            <Box
              className="cardBoard"
              key={index}
              component={Link}
              to={`/chat/${room.id}`}
              sx={{ textDecoration: "none", width: "100%" }}
            >
              <article className="card">
                <div className="card-background">
                  <img src={card1} alt="background" />
                </div>
                <div className="content">
                  <h1>Room {room.id}</h1>
                  <p>User1: {room.user1 ? room.user1 : "null"}</p>
                  <p>User2: {room.user2 ? room.user2 : "null"}</p>
                </div>
                <div className="action-bottom-bar">
                  <a href="#">{room.user1 && room.user2 ? "Full" : " Join"}</a>
                </div>
              </article>
            </Box>
          ))}
        </List>
      </Box>
    );
  } else {
    return <div>Error: Data is not an array</div>;
  }
};

export default RoomList;
