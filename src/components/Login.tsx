import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { Data } from './Home';



const Login = () => {
  const data = useContext(Data);
  const { id } = useParams<string>();
  const apiId = id ? parseInt(id) + 1 : undefined;
  const [passWord, setPassword] = useState("");
  const navigate = useNavigate();

  const pw = (data && apiId && data[apiId].password) ? data[apiId].password : '';

  const handleLogin = () => {
    if(passWord.trim() === pw) {
      console.log("Login");
      localStorage.setItem('token', 'example.token');
      navigate('/room/' + apiId)
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
      <p>{apiId}</p>
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