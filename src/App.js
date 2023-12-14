import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Home from './Home';
import Main from './Main';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';

function App() {
  const [loginUser, setLoginUser] = useState();
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoginUser(user.uid);
      } else {

      }
    });

  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {loginUser && <Route path="/main" element={<Main />} /> }
      </Routes>
    </BrowserRouter>
  );
}

export default App;
