import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useState } from 'react'
import { UserContext } from "./UserContext";
import { ToastContainer, toast } from 'react-toastify';

function Login() {
    const { setLoginUser } = useContext(UserContext);

    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const { email, password } = user;

    function changeUserData(e) {
        setUser({ ...user, [e.target.name]: e.target.value });
    }

    async function sendLoginRequest(e) {
        e.preventDefault();
        try {
            const body = { email, password };
            const response = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (response.status === 200) {
                const token = await response.json();
                localStorage.setItem("jwtToken", token);
                setLoginUser(true);
            } else {
                toast.error('The email address or the password you entered is invalid!', {
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
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="mb-3">
                        <h3>Login</h3>
                    </div>
                    <form className="shadow p-4" onSubmit={sendLoginRequest}>
                        <div className="mb-3">
                            <label >Email</label>
                            <input type="email" className="form-control"
                                placeholder="Email" name="email" value={email}
                                onChange={(e) => changeUserData(e)} />
                        </div>

                        <div className="mb-3">
                            <label >Password</label>
                            <input type="password" className="form-control"
                                name="password" value={password} placeholder="Password"
                                onChange={(e) => changeUserData(e)} />
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                        <hr />
                        <p className="text-center mb-0">If you have not account <Link to="/register">Register Now</Link></p>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    )
}

export default Login
