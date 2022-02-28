import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function People() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [people, setPeople] = useState({
        firstName: "",
        lastName: "",
        jobTitle: ""
    });

    const { firstName, lastName, jobTitle } = people;

    function changePeopleData(e) {
        setPeople({ ...people, [e.target.name]: e.target.value });
    }

    async function sendPeopleRequest(e) {
        e.preventDefault();
        try {
            const body = { firstName, lastName, jobTitle };
            const response = await fetch("http://localhost:3001/api/addpeople", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            });
            const status = await response.json();
            if (status === false) {
                toast.error('Try again, complete all fields!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.success('This person has been successfully added!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setPeople({
                    firstName: "",
                    lastName: "",
                    jobTitle: ""
                });
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 border p-4 shadow bg-light">
                    <div className="col-12">
                        <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                            Add a new person</h2>
                    </div>
                    <form onSubmit={sendPeopleRequest}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="First Name" name="firstName" value={firstName}
                                    onChange={(e) => changePeopleData(e)} />
                            </div>
                            <div className="col-md-6">
                                <input type="text" className="form-control"
                                    placeholder="Last Name" name="lastName" value={lastName}
                                    onChange={(e) => changePeopleData(e)} />
                            </div>
                            <div className="col-12">
                                <input type="text" className="form-control"
                                    placeholder="Job Title" name="jobTitle" value={jobTitle}
                                    onChange={(e) => changePeopleData(e)} />
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-primary float-end">Add the person</button>
                                <button className="btn btn-outline-secondary float-end me-2"
                                    onClick={handleClick}>Cancel</button>
                            </div>
                        </div>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default People;
