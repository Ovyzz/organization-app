import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

function Register() {
    const [user, setUser] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });

    const { email, firstName, lastName, password } = user;

    function changeUserData(e) {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    async function sendRegisterRequest(e) {
        e.preventDefault();
        try {
            const body = { email, firstName, lastName, password };
            const response = await fetch("http://localhost:3001/api/register", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.status === 200) {
                toast.success('Account created successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setUser({
                    email: "",
                    firstName: "",
                    lastName: "",
                    password: ""
                });
            } else {
                toast.error('Try again, complete all fields or select another email!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="signup-form">
                        <form className="mt-5 border p-4 bg-light shadow" onSubmit={sendRegisterRequest}>
                            <h4 className="mb-5 text-secondary">Create Your Account</h4>
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label>First Name<span className="text-danger">*</span></label>
                                    <input type="text" name="firstName" className="form-control"
                                        placeholder="Enter First Name" value={firstName}
                                        onChange={(e) => changeUserData(e)} />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label>Last Name<span className="text-danger">*</span></label>
                                    <input type="text" name="lastName" className="form-control"
                                        placeholder="Enter Last Name" value={lastName}
                                        onChange={(e) => changeUserData(e)} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label>Email<span className="text-danger">*</span></label>
                                    <input type="email" name="email" className="form-control"
                                        placeholder="Enter Password" value={email}
                                        onChange={(e) => changeUserData(e)} />
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label>Confirm Password<span className="text-danger">*</span></label>
                                    <input type="password" name="password" className="form-control"
                                        placeholder="Enter Password" value={password}
                                        onChange={(e) => changeUserData(e)} />
                                </div>
                                <div className="col-md-12">
                                    <button className="btn btn-primary float-end">Signup Now</button>
                                </div>
                            </div>
                        </form>
                        <p className="text-center mt-3 text-secondary">If you have account, Please <Link to="/login">Login Now</Link></p>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
