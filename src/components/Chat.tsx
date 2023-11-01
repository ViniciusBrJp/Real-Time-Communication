import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { RoomId } from '../Types/RoomId'; 
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

type Message = {
  sender: 'user1' | 'user2';
  content: string;
};

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<RoomId | undefined>(undefined);
  const { id } = useParams<{ id : string }>();
  const apiId = id ? parseInt(id) + 1 : undefined;

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3100");

    socket.addEventListener("message", (event) => {
      setMessages(prev => [...prev, { sender: 'user2', content: event.data }]);
    });

    return () => {
      socket.close();
    };
  }, []);

  const handleSendMessage = () => {
    const socket = new WebSocket("ws://localhost:8080");
    const sendMessage = "1" + inputMessage;
    console.log(sendMessage);
    socket.addEventListener("open", () => {
      
      socket.send(sendMessage);
      setMessages(prev => [...prev, { sender: 'user1', content: inputMessage }]);
      setInputMessage('');
    });
  };

  useEffect(() => {
    if (apiId) {
      fetch(`http://157.7.88.252/api/rooms/${apiId}`)
        .then((res) => res.json())
        .then((json: RoomId[]) => {
          const specificRoom = json.find(room => room.id === apiId);
          setRoom(specificRoom);
        });
    }
  }, [apiId]);

  return (
    <Box sx={{ border: 1 ,display: 'flex', flexDirection: 'column', height: '80vh', p: 2 }}>
      <Box sx={{ border: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 , height: '20%'}}>
        <Input
            fullWidth
            placeholder="メッセージを入力"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>Send</Button>
      </Box>

      <Box sx={{ border: 1,overflowY: 'auto', flexGrow: 1, p: 1 }}>
        {messages.map((msg, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2, mb: 1, alignSelf: msg.sender === 'user1' ? 'flex-end' : 'flex-start' }}>
              <Typography variant="subtitle2" gutterBottom>
                {room && msg.sender === 'user1' ? room.user1 : room?.user2}
              </Typography>
              <Typography>{msg.content}</Typography>
            </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Chat;
