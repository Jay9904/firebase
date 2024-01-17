import { addDoc, collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import React, { useEffect, useReducer, useState } from 'react'
import Swal from 'sweetalert2'
import { app } from './firebaseDB';
import { useDispatch, useSelector } from 'react-redux';
import png from './undraw_undraw_undraw_website_o7n3_bucy_30uo.svg'
import '../App.css'

export default function Lab() {
    const com = useSelector((state) => state.com);
    const user = useSelector((state) => state.user);
    const database = getFirestore(app);
    const dispatch = useDispatch();

    useEffect(() => {
        fatchData("computers", "addCom");
        fatchData("users", "addUser");
    }, [])

    const fatchData = async (table, actionType) => {
        const querySnapshot = await getDocs(collection(database, table));
        let newList = [];
        querySnapshot.forEach((doc) => {
            let id = doc.id;
            let data = doc.data();
            newList.push({ id, data });
        });
        dispatch({
            type: actionType,
            payload: newList
        })
    }

    const addComputer = async () => {
        const { value: computerid } = await Swal.fire({
            title: "Add New Computer ID",
            input: "text",
            inputLabel: "Computer ID",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "Enter Computer ID!";
                }
            }
        });
        if (computerid) {
            Swal.fire(`Your New Computer is ${computerid}`);
            const data = { key: computerid };
            await addDoc(collection(database, "computers"), data);
            // fatchData();
        }
    }

    const addUser = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Enter name and Contact Info",
            html: `
              <input id="swal-input1" class="swal2-input border border-dark" placeholder="Name">
              <input id="swal-input2" type="number" class="swal2-input border-dark" placeholder="Mobile Number">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const name = document.getElementById("swal-input1").value;
                const number = document.getElementById("swal-input2").value;
                const password = Date.now();
                if (!name || !number) {
                    Swal.showValidationMessage(`Please enter Name and Number`)
                }
                return { name, number, password };
            }
        });
        if (formValues) {
            const data = { user: formValues };
            await addDoc(collection(database, "users"), data);
            Swal.fire({
                title: "Good job!",
                text: "Successfully Register!",
                icon: "success"
            });
            fatchData("users", "addUser");
        }
    }

    const handleAssign = async (id, button) => {
        const { value: fruit } = await Swal.fire({
            title: "Select User",
            input: "select",
            inputOptions: user.map((item) => item.data.user.name),
            inputPlaceholder: "Select a User",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value === '') {
                        resolve("You need to select user");
                    } else {
                        resolve();
                    }
                });
            }
        });
        if (fruit) {
            Swal.fire("PC Assign SuccessFully");
            button.target.disabled = true;
            button.target.className = 'btn btn-outline-danger border-3 btn-sm rounded fw-bolder my-2 w-100';
            button.target.innerText = "Alredy Assign";
        }

    }

    return (
        <>
            <div className="container d-flex justify-content-between mt-2">
                <button className='btn btn-outline-danger border-3 btn-sm rounded-0 fw-bolder' onClick={addComputer}>Add Computer</button>
                <h3 className='text-center title'>Computer Lab</h3>
                <button className='btn btn-outline-danger border-3 btn-sm rounded-0 fw-bolder' onClick={addUser}>Add User</button>
            </div>
            <div className="container mt-3">
                <div className="row ">
                    {com && com.map((item) => {
                        return <div className="p-2 col-3" key={item.id} id='card'>
                            <div className="border border-3 border-danger rounded text-center px-2">
                                <img src={png} alt="" className='img-fluid p-3 col-6' />
                                <p className='m-0 fw-bold'>Computer Id : {item.data.key.toUpperCase()}</p>
                                <button className='btn btn-outline-success border-3 btn-sm rounded fw-bolder my-2 w-100' onClick={(e) => handleAssign(item.id, e)}>Assign</button>
                            </div>
                        </div>
                    })}
                </div>
                <div className='mt-3'>
                    <table className='table border-dark text-center table-hover' id='usertable'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Number</th>
                                <th>Genrated Password</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user && user.map((item, index) => {
                                return <tr key={index} >
                                    <td>{index + 1}</td>
                                    <td>{item.data.user.name}</td>
                                    <td>{item.data.user.number}</td>
                                    <td>{item.data.user.password}</td>
                                    <td>
                                        <button className='btn btn-sm btn-outline-success border-2 fw-bolder me-2'>Edit</button>
                                        <button className='btn btn-sm btn-outline-danger border-2 fw-bolder me-2'>Delete</button>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}
