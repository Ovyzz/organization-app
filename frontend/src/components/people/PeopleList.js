import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function PeopleList() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [userList, setUserList] = useState([]);
    const [groupSelectionList, setGroupSelectionList] = useState([]);
    const [groupSelectedList, setGroupSelectedList] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [people, setPeople] = useState({
        firstName: "",
        lastName: "",
        jobTitle: ""
    });
    const [moveGroup, setMoveGroup] = useState();
    const [showGroup, setShowGroup] = useState(false);
    const [button, setButton] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState({
        type: false,
        id: ""
    });
    const [edit, setEdit] = useState(true);
    const [id, setId] = useState("");

    const { firstName, lastName, jobTitle } = people;

    function changePeopleData(e) {
        setPeople({ ...people, [e.target.name]: e.target.value });
    }

    async function sendUserListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/getpeoples", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const users = await response.json();
            setUserList(users);
            setFoundUsers(users);
        } catch (error) {
            console.log(error.message)
        }
    }

    async function sendGroupListRequest(idCreator) {
        try {
            const body = { idCreator };
            const response = await fetch("http://localhost:3001/api/getgroupsuser", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            });
            const groups = await response.json();
            setGroupSelectionList(groups[0]);
            setGroupSelectedList(groups[1]);
        } catch (error) {
            console.log(error.message)
        }
    }

    async function sendMoveGroupRequest(e) {
        e.preventDefault();
        try {
            const idCreator = people.id;
            const body = { moveGroup, idCreator };
            const response = await fetch("http://localhost:3001/api/addrelationgroup", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            });
            const status = await response.json();
            if (status === false) {
                toast.error('Try again, select a group!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                setButton(false);
                toast.success('Person successfully added to group!!', {
                    position: "top-right",
                    autoClose: 1500,
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

    async function updatePeople(id) {
        try {
            setEdit(true);
            setId("");
            const body = { id, firstName, lastName, jobTitle };
            const response = await fetch("http://localhost:3001/api/updatingpeople", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            }).then(toast.success('The person`s data was successfully updated!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })).then(await timeout(2000)).then(window.location.reload(false));
        } catch (error) {
            console.log(error.message)
        }
    }

    async function deleteGroupList(idCreator, idGroup) {
        try {
            const body = { idCreator, idGroup };
            const response = await fetch("http://localhost:3001/api/deletegrouplist", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            }).then(toast.success('The person has been removed from the group!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })).then(await timeout(2000)).then(window.location.reload(false));
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendUserListRequest();
    }, []);


    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    function filteredList(e) {
        const searchString = e.target.value.toLowerCase();
        const userFilteredList = [];
        setUserList(foundUsers);
        if (searchString !== '') {
            for (let i = 0; i < userList.length; ++i) {
                if (userList[i].firstname.toLowerCase().includes(searchString) ||
                    userList[i].lastname.toLowerCase().includes(searchString)) {
                    userFilteredList.push(userList[i]);
                }
            }
            setUserList(userFilteredList);
        }
    }

    function editOption(user) {
        setEdit(!edit);
        setId(user.id);
        setShowGroup(false);
        setSelectedGroup({ type: false });
        setPeople({
            firstName: user.firstname,
            lastName: user.lastname,
            jobTitle: user.jobtitle
        });
    }

    function saveDataUser(user) {
        setPeople(user);
        sendGroupListRequest(user.id);
        setShowGroup(true);
        setButton(true);
        setSelectedGroup({
            type: true,
            id: user.id
        });
    }

    return (
        <div>
            <ToastContainer />
            <div className="container">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="e-tabs mb-3 px-3">
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><p
                                    className="nav-link active">People</p></li>
                            </ul>
                        </div>
                        <div className="row flex-lg-nowrap">
                            <div className="col mb-3">
                                <div className="e-panel card">
                                    <div className="card-body">
                                        <div className="card-title">
                                            <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                                                List of all people</h2>
                                        </div>
                                        <div className="e-table">
                                            <div className="table-responsive table-lg mt-3">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>First Name</th>
                                                            <th>Last Name</th>
                                                            <th>Job Title</th>
                                                            <th>Created On</th>
                                                            <th>Updated To</th>
                                                            <th>Edit</th>
                                                            <th>Add in a group</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {userList.map((user) => {
                                                            return <tr key={user.id}
                                                                className={(selectedGroup.type === true && user.id === selectedGroup.id) ?
                                                                    "table-info" : ""}>
                                                                <td className="text-nowrap align-middle">
                                                                    {(id !== user.id) ? user.firstname :
                                                                        <input type="text" className="form-control"
                                                                            placeholder="First Name" name="firstName" value={firstName}
                                                                            onChange={(e) => changePeopleData(e)} />}
                                                                </td>
                                                                <td className="text-nowrap align-middle">
                                                                    {(id !== user.id) ? user.lastname : <input type="text" className="form-control"
                                                                        placeholder="Last Name" name="lastName" value={lastName}
                                                                        onChange={(e) => changePeopleData(e)} />}
                                                                </td>
                                                                <td className="text-nowrap align-middle">
                                                                    {(id !== user.id) ? user.jobtitle : <input type="text" className="form-control"
                                                                        placeholder="Job Title" name="jobTitle" value={jobTitle}
                                                                        onChange={(e) => changePeopleData(e)} />}
                                                                </td>
                                                                <td className="text-center">
                                                                    <p>{new Date(user.createat).toLocaleString()}</p>
                                                                </td>
                                                                <td className="text-center">
                                                                    <p>{new Date(user.updateat).toLocaleString()}</p>
                                                                </td>
                                                                <td className="text-center">
                                                                    {edit ? <button type="button" className="btn btn-warning"
                                                                        onClick={() => editOption(user)}>Edit</button> :
                                                                        (id !== user.id ? <button type="button" className="btn btn-warning" disabled>Edit
                                                                        </button> : <button type="button" className="btn btn-warning"
                                                                            onClick={() => (updatePeople(user.id, people))}>Save
                                                                        </button>)}
                                                                </td>
                                                                <td className="text-center">
                                                                    {edit ? <button type="button" className="btn btn-primary" onClick={() => saveDataUser(user)}>
                                                                        New group</button> : <button type="button" className="btn btn-primary"
                                                                            disabled>New group</button>}
                                                                </td>
                                                            </tr>
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="text-center px-xl-3">
                                            <button className="btn btn-outline-secondary"
                                                onClick={handleClick}>Back</button>
                                        </div>
                                        <hr className="my-3" />
                                        <div>
                                            <div className="form-group">
                                                <label>Search by Name:</label>
                                                <input className="form-control w-100" type="text"
                                                    placeholder="Name" onChange={(e) => filteredList(e)} />
                                            </div>
                                        </div>
                                        <hr className="my-3" />
                                    </div>
                                    <div className="card-body">
                                        <div>
                                            {showGroup ? <form onSubmit={sendMoveGroupRequest}>
                                                <select className="form-select" onChange={(e) => setMoveGroup(e.target.value)}>
                                                    <option>Select a group</option>
                                                    {groupSelectionList.map((group) => {
                                                        return <option key={group.id} value={group.id}> {group.groupname}</option>
                                                    })}
                                                </select>
                                                <div className="text-center px-xl-3 my-3">
                                                    {button ? <button className="btn btn-outline-secondary">Move in
                                                    </button> : <button className="btn btn-outline-secondary" disabled>
                                                        Move in </button>}
                                                </div>
                                            </form> : null}
                                        </div>
                                        <hr className="my-3" />
                                        {showGroup ? <div className="list-group">
                                            <p className="text-center"><small>Your groups</small></p>
                                            {groupSelectedList.map((group) => {
                                                return <button type="button" key={group.id} onClick={() => deleteGroupList(people.id, group.id)} className="list-group-item list-group-item-action">
                                                    {group.groupname}</button>
                                            })}
                                            <p className="text-center my-2"><small>Tap the group you want to delete.</small></p>
                                            <hr className="my-3" />
                                        </div> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PeopleList;
