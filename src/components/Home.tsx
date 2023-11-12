import React, { createContext, useEffect, useRef, useState } from 'react'
import { RoomId } from '../Types/RoomId';
import RoomList from './RoomList';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';




export const Data = createContext<RoomId[] | undefined>(undefined);
const URL = `http://157.7.88.252/api/rooms`;
const Home: React.FC = () => {

  const [data, setData] = useState<RoomId[] | undefined>(undefined);

  useEffect(() => {
    fetch(URL)
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, width: '100%'}}>
        <Typography variant="h4" gutterBottom>
          HOME
        </Typography>
        {data ? (
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
          <Paper elevation={2}  sx={{ m: 2, p: 2, width: '95%'}}>
                <Typography variant="h6" gutterBottom>
                  Room List
                </Typography>
                <Data.Provider value={data}>
                  <RoomList />
                </Data.Provider>
              </Paper>  
          </Box>  
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
      </Box>
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