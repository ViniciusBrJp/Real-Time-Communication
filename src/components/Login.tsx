import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Data } from './Home';


type RoomId = {
  id: number;
  name: string;
  password: string;
  user1: string;
  user2: string;
}


const Login = () => {
  const data = useContext(Data);
  const { id } = useParams<string>();
  const [passWord, setPassword] = useState("");
  const navigate = useNavigate();

  const pw = (data && id && data[parseInt(id)].password) ? data[parseInt(id)].password : '';

  const handleLogin = () => {
    if(passWord.trim() === pw) {
      console.log("Login");
      localStorage.setItem('token', 'example.token');
      navigate('/room/' + id)
    } else {
      console.log('failed');
    }
  }
  if(data) {console.log("Login:" , data);
  }else { console.log("Login Failed")}
    return (
      <div>
      <h2>パスワードを入力site</h2>
      <h3>API取得できてないから何も入れなくても入れる</h3>
      <p>{id}</p>
              <form>
                  <input
                      type="password"
                      placeholder="Password"
                      value={passWord}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={handleLogin}>
                      Login
                  </button>
              </form>
      </div>
    )
}

export default Login