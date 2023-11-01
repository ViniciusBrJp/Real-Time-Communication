import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Data } from './Home';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const RoomList: React.FC = () => {
  const data = useContext(Data);
  const handleEnterRoom = (roomId: number) => {
    // WebSocketコネクションを開始または使用する
    const socket = new WebSocket('ws://localhost:3100');
    const message = `0 ${roomId} 1 `;
    console.log(message);
    socket.onopen = () => {
      // WebSocketが開いたらメッセージを送信

      socket.send(message);

      // 必要に応じて、ここで接続をクローズ
      socket.close();
    };

    // エラーハンドリング
    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  };

  if (Array.isArray(data)) {
    return (
      <List sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {data.map((room, index) => (
          <Box
            key={index} // keyはBoxに移動する
            sx={{
              display: 'flex', 
              p: 2, 
              borderRadius: '8px', 
              border: '1px solid', // 修正: borderプロパティを正しく設定
              borderColor: 'secondary.main', // 修正: borderColorプロパティを追加
              transition: 'background-color 0.3s', 
              justifyContent: 'center',
              ':hover': {
                backgroundColor: '#f5f5f5'
              },
              cursor: 'pointer'
            }}
            onClick={() => handleEnterRoom(room.id)} // onClickイベントハンドラの追加
          >
            <ListItem component={Link} to={`/chat/${room.id}`}>
              <ListItemText primary={room.id} />
            </ListItem>
          </Box>
        ))}
      </List>
    );
  } else {
    return <div>Error: Data is not an array</div>;
  }
};

export default RoomList;
