import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from "firebase/auth";
import { app } from './firebase';
import Main from './Main';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const [user, setUser] = useState();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleGoogle = () => {
    signInWithPopup(auth, provider).then((data) => {
      setUser(data.user.email);
      localStorage.setItem("email", data.user.email);
      navigate("/main")

    })
  }

  useEffect(() => {
    setUser(localStorage.getItem("email"));
  }, [])

  return (
    <>
      <h3 className='text-center'>Google Authentication</h3>
      <div className="text-center mt-3">
        <button className='btn btn-outline-dark' onClick={handleGoogle}>Continue With Google</button>
      </div>


    </>
  )
}
