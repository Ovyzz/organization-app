import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';

function Main() {
    const [userData, setUserData] = useState({
        name: "",
        lastPerson: "",
        lastUpdatePerson: "",
        lastUpdateGroup: "",
        lastGroup: "",
    });

    const { name, lastPerson, lastUpdatePerson, lastUpdateGroup, lastGroup } = userData;

    async function sendGetUserDataRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/getuserdata", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendGetUserDataRequest();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6 offset-md-3 border p-4 shadow bg-light">
                        <div className="col-12">
                            <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                                HI {name}</h2>
                        </div>
                        <form >
                            <div className="row g-3">
                                <div className="col-12">
                                    <h6>Last person added: {lastPerson}</h6>
                                </div>
                                <div className="col-12">
                                    <h6>A person's last data update: {lastUpdatePerson}</h6>
                                </div>
                                <div className="col-12">
                                    <h6>Last group created: {lastGroup}</h6>
                                </div>
                                <div className="col-12">
                                    <h6>Last updated group: {lastUpdateGroup}</h6>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
