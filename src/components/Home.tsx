import React, { createContext, useEffect, useRef, useState } from 'react'
import { RoomId } from '../Types/RoomId';
import ReconnectingWebSocket from 'reconnecting-websocket';
import RoomList from './RoomList';

export const Data = createContext<RoomId[] | undefined>(undefined);

const Home: React.FC = () => {
  const [message, setMessage] = useState<string>();
  const socketRef = useRef<ReconnectingWebSocket>()
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

    const websocket = new ReconnectingWebSocket('ws://localhost:3100')
    socketRef.current = websocket

    const onMessage = (event: MessageEvent<string>) => {
      setMessage(event.data)
    }
    websocket.addEventListener('message', onMessage)

    return () => {
      websocket.close()
      websocket.removeEventListener('message',onMessage)
    }
  },[]);

    if(data) {
      return (
        <div>
          <h1 className="HomeHeader">HOME</h1>
            <div className="RoomList">
              <h3 className="RoomListHeader">Room List</h3>
              <Data.Provider value={data}>
                
              </Data.Provider>
            </div>
            <div>
              メッセージ: {message}
            </div>
            <button 
              type="button"
              onClick={() => {
              socketRef.current?.send("あ")
            }}
            >
              送信
            </button>
        </div>
      )
    } else {
      return (
        <div>
          <h1 className="HomeHeader">HOME</h1>
          <div>
              メッセージ: {message}
            </div>
            <button 
              type="button"
              onClick={() => {
              socketRef.current?.send("あ")
            }}
            >
              送信
            </button>
        </div>
      )
    }
}

export default Home