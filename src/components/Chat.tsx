import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { useParams } from 'react-router-dom';
import { Box, Paper, Typography } from '@mui/material';

type Message = {
  sender: 'user1' | 'user2';
  content: string;
};

type RoomId = {
  id: number;
  user1: string;
  user2: string;
};

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<RoomId | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const apiId = id ? parseInt(id, 10) : undefined;

  // WebSocketインスタンスを生成
  const socket = new WebSocket('ws://localhost:3100');

  // メッセージ受信のためのイベントリスナーをセットアップ
  useEffect(() => {
    const onMessage = (event: { data: any; }) => {
      setMessages((prev) => [...prev, { sender: 'user2', content: event.data }]);
    };

    socket.addEventListener('message', onMessage);

    return () => {
      socket.removeEventListener('message', onMessage);
      socket.close();
    };
  }, []);

  const [enteringRoom, setEnteringRoom] = useState<boolean>(false);
  const [enterRoomError, setEnterRoomError] = useState<String | null>(null);

  // ルームに入室するための関数
  const handleEnterRoom = (roomId: number) => {
    setEnteringRoom(true);
    setEnterRoomError(null);

    if (socket.readyState === WebSocket.OPEN) {
      const message = `0 ${roomId} 1 `;
      socket.send(message);
    } else {
      setEnteringRoom(false);
      setEnterRoomError('WebSocket is not open. Cannot enter room.');
      console.error('WebSocket is not open. Cannot enter room.');
    }
  };

  // APIからチャットルームの情報を取得し、WebSocketを介してルームに入室
  useEffect(() => {
    if (apiId) {
      fetch(`http://157.7.88.252/api/rooms/${apiId}`)
        .then((res) => res.json())
        .then((json: RoomId[]) => {
          const specificRoom = json.find((room) => room.id === apiId);
          if (specificRoom) {
            setRoom(specificRoom);
            handleEnterRoom(specificRoom.id);
          }
        });
    }
  }, []);

  // メッセージ送信のハンドラー
  const handleSendMessage = () => {
    if (socket.readyState === WebSocket.OPEN) {
      const sendMessage = '1' + inputMessage;
      socket.send(sendMessage);
      setMessages((prev) => [...prev, { sender: 'user1', content: inputMessage }]);
      setInputMessage('');
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  };

  return (
    <Box sx={{ border: 1, display: 'flex', flexDirection: 'column', height: '80vh', p: 2 }}>
      <Box sx={{ border: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, height: '20%' }}>
        <Input
          fullWidth
          placeholder="メッセージを入力"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <Button variant="contained" onClick={handleSendMessage} sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>

      <Box sx={{ border: 1, overflowY: 'auto', flexGrow: 1, p: 1 }}>
        {messages.map((msg, index) => (
          <Paper key={index} elevation={3} sx={{ p: 2, mb: 1, alignSelf: msg.sender === 'user1' ? 'flex-end' : 'flex-start' }}>
            <Typography variant="subtitle2" gutterBottom>
              {msg.sender === 'user1' ? room?.user1 : room?.user2}
            </Typography>
            <Typography>{msg.content}</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default Chat;
