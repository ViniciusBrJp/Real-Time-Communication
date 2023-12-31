import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Input } from "@mui/material";

type Message = {
  sender: "user1" | "user2";
  content: string;
};

type RoomId = {
  id: number;
  user1: string;
  user2: string;
};

const Chat = () => {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [room, setRoom] = useState<RoomId | undefined>(undefined);
  const { id } = useParams<{ id: string }>();
  const apiId = id ? parseInt(id, 10) : undefined;
  const socketRef = useRef<WebSocket | null>(null);
  const [enterRoomError, setEnterRoomError] = useState<string | null | boolean>(
    "Loading"
  );
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = new WebSocket("ws://157.7.88.252/ws");

    const onMessage = (event: { data: any }) => {
      const message = event.data;
      if (message.startsWith("0")) {
        const msg = handleRoomResponse(message.substring(1));
      } else if (message.startsWith("1")) {
        setMessages(() => [{ sender: "user2", content: message.substring(1) }]);
      }
    };

    socketRef.current.addEventListener("message", onMessage);

    return () => {
      socketRef.current?.removeEventListener("message", onMessage);
      socketRef.current?.close();
    };
  }, []);

  const sendEnterRoomRequest = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN && apiId) {
      const enterRoomMessage = `0 ${apiId} 1`;
      socketRef.current.send(enterRoomMessage);
    } else {
      setEnterRoomError("WebSocket is not open. Cannot enter room.");
    }
  };

  const handleRoomResponse = (response: string) => {
    if (response.startsWith("OK")) {
      setEnterRoomError(true);
    } else {
      setEnterRoomError("NG");
      navigate("/");
    }
  };

  useEffect(() => {
    const onOpen = () => {
      sendEnterRoomRequest();
    };

    if (socketRef.current) {
      socketRef.current.addEventListener("open", onOpen);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.removeEventListener("open", onOpen);
      }
    };
  }, []);

  useEffect(() => {
    const fetchRoom = async () => {
      if (apiId) {
        try {
          const response = await fetch(
            `http://157.7.88.252/api/rooms/${apiId}`
          );
          const json: RoomId = await response.json();
          setRoom(json);
        } catch (error) {
          console.error("Error fetching room data:", error);
        }
      }
    };

    fetchRoom();
  }, []);

  const handleSendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const sendMessage = `1 ${message}`;
      socketRef.current.send(sendMessage);
    } else {
      console.error("WebSocket is not open. Cannot send message.");
    }
  };

  if (enterRoomError == "OK") {
    return (
      <Box
        sx={{
          border: 1,
          display: "flex",
          flexDirection: "column",
          height: "80vh",
          p: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            border: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1,
            height: "20%",
          }}
        >
          <Input
            fullWidth
            placeholder="メッセージを入力"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              handleSendMessage(e.target.value);
            }}
          />
        </Box>

        <Box sx={{ border: 1, overflowY: "auto", flexGrow: 1, p: 1 }}>
          {messages.map((msg, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 2,
                mb: 1,
                alignSelf: msg.sender === "user1" ? "flex-end" : "flex-start",
              }}
            >
              <Typography variant="subtitle2" gutterBottom>
                {msg.sender === "user1" ? room?.user1 : room?.user2}
              </Typography>
              <Typography>{msg.content}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  } else if (enterRoomError == "NG") {
    return <p>Error: Unable to enter room.</p>;
  } else {
    return <p>Loading...</p>;
  }
};

export default Chat;
