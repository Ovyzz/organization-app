import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';

function GroupList() {
    const history = useHistory();

    const handleClick = () => {
        history.push("/main");
    }

    const [groupList, setGroupList] = useState([]);
    const [foundGroups, setFoundGroups] = useState([]);
    const [group, setGroup] = useState({
        groupName: ""
    });
    const [edit, setEdit] = useState(true);
    const [id, setId] = useState("");

    const { groupName } = group;

    async function sendGroupListRequest() {
        try {
            const response = await fetch("http://localhost:3001/api/getgroups", {
                method: "GET",
                headers: { token: localStorage.jwtToken }
            });
            const groups = await response.json();
            setGroupList(groups);
            setFoundGroups(groups);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        sendGroupListRequest();
    }, []);

    async function updateGroup(id) {
        try {
            setEdit(true);
            setId("");
            const body = { id, groupName };
            const response = await fetch("http://localhost:3001/api/updatinggroup", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', token: localStorage.jwtToken },
                body: JSON.stringify(body)
            }).then(toast.success('The group`s data was successfully updated!', {
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

    function changeGroupData(e) {
        setGroup({ ...group, [e.target.name]: e.target.value });
    }

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    function filteredList(e) {
        const searchString = e.target.value.toLowerCase();
        const userFilteredList = [];
        setGroupList(foundGroups);
        if (searchString !== '') {
            for (let i = 0; i < groupList.length; ++i) {
                if (groupList[i].groupname.toLowerCase().includes(searchString)) {
                    userFilteredList.push(groupList[i]);
                }
            }
            setGroupList(userFilteredList);
        }
    }

    function editOption(user) {
        setEdit(!edit);
        setId(user.id);
        setGroup({
            groupName: user.groupname
        });
    }

    return (
        <div>
            <div className="container">
                <div className="row flex-lg-nowrap">
                    <div className="col">
                        <div className="e-tabs mb-3 px-3">
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><p
                                    className="nav-link active">Groups</p></li>
                            </ul>
                        </div>
                        <div className="row flex-lg-nowrap">
                            <div className="col mb-3">
                                <div className="e-panel card">
                                    <div className="card-body">
                                        <div className="card-title">
                                            <h2 className="fw-normal text-secondary fs-4 text-uppercase mb-4">
                                                List of all groups</h2>
                                        </div>
                                        <div className="e-table">
                                            <div className="table-responsive table-lg mt-3">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Group Name</th>
                                                            <th>Created On</th>
                                                            <th>Updated To</th>
                                                            <th>Edit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {groupList.map((group) => {
                                                            return <tr key={group.id}>
                                                                <td className="text-nowrap align-middle">
                                                                    {(id !== group.id) ? group.groupname :
                                                                        <input type="text" className="form-control"
                                                                            placeholder="Group Name" name="groupName" value={groupName}
                                                                            onChange={(e) => changeGroupData(e)} />}
                                                                </td>
                                                                <td className="text-center">
                                                                    <p>{new Date(group.createat).toLocaleString()}</p>
                                                                </td>
                                                                <td className="text-center">
                                                                    <p>{new Date(group.updateat).toLocaleString()}</p>
                                                                </td>
                                                                <td className="text-center">
                                                                    {edit ? <button type="button" className="btn btn-warning"
                                                                        onClick={() => editOption(group)}>Edit</button> :
                                                                        (id !== group.id ? <button type="button" class="btn btn-warning" disabled>Edit
                                                                        </button> : <button type="button" className="btn btn-warning"
                                                                            onClick={() => (updateGroup(group.id, group))}>Save
                                                                        </button>)}
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
                                        <ToastContainer />
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

export default GroupList;
