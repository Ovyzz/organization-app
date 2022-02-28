import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function Group() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [parentGroup, setParentGroup] = useState();
    const [groupSelectionList, setGroupSelectionList] = useState([]);
    const [group, setGroup] = useState({
        groupName: ""
    });

    const { groupName } = group;

    function changePodcastData(e) {
        setGroup({ ...group, [e.target.name]: e.target.value });
    }

    async function sendGroupRequest(e) {
        e.preventDefault();
        try {
            const body = { groupName, parentGroup };
            const response = await fetch("http://localhost:3001/api/addgroup", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            });
            const status = await response.json();
            if (status === false) {
                toast.error('Try again, complete fields!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.success('The group has been successfully added!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setTimeout(function () {
                    window.location.reload(1);
                }, 1500);
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    async function sendGroupListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/getgroups", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const groups = await response.json();
            setGroupSelectionList(groups)
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendGroupListRequest();
    }, []);

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3 border p-4 shadow bg-light">
                    <div className="col-12">
                        <h3 className="fw-normal text-secondary fs-4 text-uppercase mb-4">Add a new group</h3>
                    </div>
                    <form onSubmit={sendGroupRequest}>
                        <div className="row g-3">
                            <div className="col-12">
                                <input type="text" className="form-control" placeholder="Group Name"
                                    name="groupName" value={groupName} onChange={(e) => changePodcastData(e)} />
                            </div>
                            <div className="col-12">
                                <select className="form-select" onChange={(e) => setParentGroup(e.target.value)}>
                                    <option>Select a parent group</option>
                                    {groupSelectionList.map((group) => {
                                        return <option key={group.id} value={group.id}> {group.groupname}</option>
                                    })}
                                </select>
                            </div>
                            <div className="col-12 mt-5">
                                <button className="btn btn-primary float-end">Add the group</button>
                                <button className="btn btn-outline-secondary float-end me-2"
                                    onClick={handleClick}>Cancel</button>
                            </div>
                            <ToastContainer />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Group;
