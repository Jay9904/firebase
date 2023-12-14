import React, { useEffect, useState } from 'react'
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { app } from './firebase';
import Main from './Main';
import { useNavigate } from 'react-router-dom';


export default function Home() {
  const [user, setUser] = useState();
  const [input, setInput] = useState({ email: "", password: "" });
  const [signin, setSignin] = useState(false);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleGoogle = () => {
    signInWithPopup(auth, provider).then((data) => {
      setUser(data.user.email);
      localStorage.setItem("email", data.user.email);
      navigate("/main");
    })
  }

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const handleSignup = (e) => {
    e.preventDefault();
    if (signin === false) {
      createUserWithEmailAndPassword(auth, input.email, input.password)
        .then((userCredential) => {
          const user = userCredential.user;
          setSignin(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
    if (signin === true) {
      signInWithEmailAndPassword(auth, input.email, input.password)
        .then((userCredential) => {
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, input.email, input.password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate('main')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  useEffect(() => {
    setUser(localStorage.getItem("email"));
  }, [])

  return (
    <>
      <h3 className='text-center'>Google Authentication</h3>
      <form action="" className='col-4 m-auto mt-3 border border-2 p-3 border-dark rounded bg-danger' onSubmit={handleSignup}>
        <input
          type="email"
          name="email"
          value={input.email}
          placeholder='Email'
          className='form-control border-2 border-dark bg-warning-subtle'
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          value={input.password}
          placeholder='Password'
          className='form-control border-2 border-dark mt-3 bg-warning-subtle'
          onChange={handleChange}
          required
        />
        {signin ? null : <input type="submit" value="Sign In" className='btn btn-success btn-sm mt-3 w-100 fw-bold border-3 border-light' />}
        <p className='m-0 text-center text-light mt-2'>Alredy Sign Up Login Here</p>
        <button className='btn btn-warning btn-sm mt-3 w-100 fw-bold border-3 border-light' onClick={handleLogin} >Login</button>
      </form>
      {signin ? <p className='text-center fw-bold text-success'>Sign Up Successfully</p> : null}
      <div className="text-center mt-3">
        <button className='btn btn-outline-danger fw-bold border-3 btn-sm col-4' onClick={handleGoogle}>Continue With Google</button>
      </div>


    </>
  )
}
