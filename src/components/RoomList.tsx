import React, { createContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Data } from "./Home";





const RoomList: React.FC = () => {
    const data = useContext(Data);

    if (Array.isArray(data)) {
      return (
        <div className="roomList">
          {data.map((room, index) => (
            <div key={index}>
                <Link to={`/room/login/${index}`}>{room.name}</Link>
            </div>
          ))}
        </div>
      );
    } else {
      return <div>Error: Data is not an array</div>;
    }
};

export default RoomList;


