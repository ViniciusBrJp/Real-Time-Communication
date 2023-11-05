import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Data } from './Home';
import { Box, List, ListItem, ListItemText } from '@mui/material';

const RoomList: React.FC = () => {
  const data = useContext(Data);

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
