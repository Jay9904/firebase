import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { app } from './firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore } from "firebase/firestore";


export default function Main() {
    const [user, setuser] = useState();
    const navigate = useNavigate();
    const auth = getAuth(app);
    const database = getFirestore(app);

    useEffect(() => {
        fatchdata();
    }, [])

    const fatchdata = async () => {
        const querySnapshot = await getDocs(collection(database, "users"));
        let newList = [];
        querySnapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            newList.push({ id, ...data })
        });
        setuser(newList);
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            localStorage.clear();
            navigate("/")
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
            <h1 className='text-center'>Main Page</h1>
            <button className='btn btn-outline-danger btn-sm fw-bolder border-3 ' onClick={handleLogout}>Sign Out</button>
            <table className='table table-info mt-3 '>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile No</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        user && user.map((item, index) => {
                            return <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.number}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </>

    )
}
