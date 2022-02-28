import { Link } from "react-router-dom";
import React, { useContext } from 'react'
import { UserContext } from './user/UserContext';

function Navbar() {
    const { setLoginUser } = useContext(UserContext);

    function logout() {
        localStorage.removeItem("jwtToken");
        setLoginUser(false);
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bolder">Dashboard</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/main/people" className="nav-link">Add people</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/main/people-list" className="nav-link">The list of people</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/main/group" className="nav-link">Create a new group</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/main/group-list" className="nav-link">List of groups</Link>
                            </li>
                        </ul>
                        <form className="d-flex">
                            <button className="btn btn-secondary" onClick={logout}>Logout</button>
                        </form>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar;
