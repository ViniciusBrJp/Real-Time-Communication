import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card } from 'react-bootstrap';

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3100");

    socket.addEventListener("message", (event) => {
      setMessage(event.data);
    })

    return () => {
      socket.close();
    };
  },[]);

  const handleSendMessage = () => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.addEventListener("open", () => {
      socket.send(inputMessage);
    });
    socket.addEventListener("message", (event) => {
      setMessage(event.data);
    });
  }
  return (
    <>
    <div className="UserCardContainer">
      <Card className="UserCard">
        <Card.Header as="h5" className="UserCardHeader" >User 1</Card.Header>
        <Card.Body className="UserCardBody">
          <Card.Text>
            <input 
              type="text" 
              placeholder="入力してください" 
              className="UserCardInput" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            
          </Card.Text>
        </Card.Body>
        <Button onClick={handleSendMessage}>送信</Button>
      </Card>
      <Card className="UserCard">
        <Card.Header as="h5" className="UserCardHeader">User 2</Card.Header>
        <Card.Body className="UserCardBody">
          <Card.Text>
          <input 
            type="text" 
            className="UserCardInput" 
            value={message} 
            readOnly 
            />
          </Card.Text>
        </Card.Body>
      </Card>

    </div>
    </>
  )
}

export default Chat