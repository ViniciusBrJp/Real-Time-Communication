import React, { useEffect, useState, useRef } from 'react';
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

  // useRefを使ってWebSocketのインスタンスを保持する
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // WebSocketのインスタンスを生成し、refに保持する
    socketRef.current = new WebSocket('ws://localhost:3100');

    const onMessage = (event: { data: any }) => {
      setMessages((prev) => [...prev, { sender: 'user2', content: event.data }]);
    };

    socketRef.current.addEventListener('message', onMessage);

    // コンポーネントのアンマウント時に実行するクリーンアップ関数
    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener('message', onMessage);
        socketRef.current.close();
      }
    };
  }, []);

  const [enteringRoom, setEnteringRoom] = useState<boolean>(false);
  const [enterRoomError, setEnterRoomError] = useState<string | null>(null);

  const handleEnterRoom = (roomId: number) => {
    
    setEnteringRoom(true);
    setEnterRoomError(null);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const message = `0 ${roomId} 1 `;
      socketRef.current.send(message);
    } else {
      setEnteringRoom(false);
      setEnterRoomError('WebSocket is not open. Cannot enter room.');
      console.error('WebSocket is not open. Cannot enter room.');
    }
  };
  useEffect(() => {
    // WebSocketが接続されたら、ルームに入室する
    const onOpen = () => {
      if (apiId && room) {
        handleEnterRoom(room.id);
      }
    };
  
    if (socketRef.current) {
      socketRef.current.addEventListener('open', onOpen);
    }
  
    // コンポーネントのアンマウント時に実行するクリーンアップ関数
    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener('open', onOpen);
      }
    };
  }, [apiId, room]); // 依存配列にapiIdとroomを追加

  useEffect(() => {
    // APIからチャットルームの情報を取得し、WebSocketを介してルームに入室する準備をする
    const fetchRoom = async () => {
      if (apiId) {
        try {
          const response = await fetch(`http://157.7.88.252/api/rooms/${apiId}`);
          const json: RoomId[] = await response.json();
          const specificRoom = json.find((room) => room.id === apiId);
          if (specificRoom) {
            setRoom(specificRoom);
          }
        } catch (error) {
          console.error('Error fetching room data:', error);
        }
      }
    };
  
    fetchRoom();
  }, [apiId]); // 依存配列にapiIdを追加

  const handleSendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const sendMessage = `1 ${message}`;
      socketRef.current.send(sendMessage);
      setMessages((prev) => [...prev, { sender: 'user1', content: inputMessage }]);
      setInputMessage('');
    } else {
      console.error('WebSocket is not open. Cannot send message.');
    }
  };

  return (
    <Box sx={{ border: 1, display: 'flex', flexDirection: 'column', height: '80vh', p: 2,width: '100%' }}>
      <Box sx={{ border: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, height: '20%' }}>
        <Input
          fullWidth
          placeholder="メッセージを入力"
          value={inputMessage}
          onChange={(e) => {
            const message = e.target.value;
            setInputMessage(message);
            if( message.trim() ) {
              handleSendMessage(message);
            }
          }}
        />
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
