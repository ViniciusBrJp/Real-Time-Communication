import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { RoomId } from '../Types/RoomId';


const RoomDetail: React.FC = () => {
    const [room, setRoom] = useState<RoomId | undefined>(undefined);
    const { id } = useParams<{ id : string }>();

    const apiId = id ? parseInt(id) + 1: undefined;

    
    useEffect(() => {
        fetch("http://157.7.88.252/api/rooms/1")
        .then((res) => res.json())
        .then((json: RoomId) => {
        console.log("Fetchdata:", json);
        setRoom(json)}  )
    },[apiId]);
     
    if(room) {console.log("RoomDetail:" , room);
    }else { console.log("RoomDetail Failed")}
    if(room) {
        return (
            <div>
                <p>id: {room.id}</p>
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