import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Data } from './Home';
import { useContext } from 'react';
import { RoomId } from '../Types/RoomId';


const RoomDetail: React.FC = () => {
    const [room, setRoom] = useState<RoomId | undefined>(undefined);
    const { id } = useParams<{ id : string }>();

    useEffect(() => {
        fetch("http://157.7.88.252/api/rooms/${id}")
        .then((res) => res.json())
        .then((json: RoomId) => {
        console.log("Fetchdata:", json);
        setRoom(json)}  )
    },[id]);
     
    if(room) {console.log("RoomDetail:" , room);
    }else { console.log("RoomDetail Failed")}
    if(room && id) {
        return (
            <div>
                <p>name: {room.name}</p>
                <p>password: {room.password}</p>
                <p>user1: {room.user1}</p>
                <p>user2: {room.user2}</p>
            </div>
        )
    }
    return (
        <div>
            API取得失敗
        </div>
    )
}

export default RoomDetail