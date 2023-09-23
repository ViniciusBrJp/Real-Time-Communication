import React, { createContext, useEffect, useState } from 'react'
import { RoomId } from '../Types/RoomId';
import RoomList from './RoomList';

export const Data = createContext<RoomId[] | undefined>(undefined);

const Home: React.FC = () => {
  const [data, setData] = useState<RoomId[] | undefined>(undefined);

  useEffect(() => {
    fetch("http://157.7.88.252/api/rooms")
    .then((res) => res.json())
    .then((json: RoomId[]) => {
      console.log("Fetchdata:", json);
      setData(json)}  )
    .catch((error) => {
      console.error("Fetching error: ", error);
      alert("error");
    });
  },[]);

    if(data) {
      return (
        <div>
          <h1 className="HomeHeader">HOME</h1>
            <div className="RoomList">
              <h3 className="RoomListHeader">Room List</h3>
              <Data.Provider value={data}>
                <RoomList />
              </Data.Provider>
            </div>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="HomeHeader">HOME</h1>
        </div>
      )
    }
}

export default Home