import { BrowserRouter as Router, Redirect, Switch, Route, } from "react-router-dom";
import { isAuthenticated } from "./helper/user/loginChecker";
import Login from './components/user/Login';
import Main from './components/Main';
import People from "./components/people/People";
import PeopleList from "./components/people/PeopleList";
import Group from "./components/groups/Group";
import GroupList from "./components/groups/GroupList";
import React, { useState, useEffect, useMemo } from 'react';
import Register from './components/user/Register';
import { UserContext } from "./components/user/UserContext";

function App() {
  const [user, setLoginUser] = useState(false);

  const providerValue = useMemo(() => ({ user, setLoginUser }), [user, setLoginUser]);

  useEffect(() => {
    if (localStorage.jwtToken) {
      (async () => {
        const validToken = await isAuthenticated();
        validToken === true ? setLoginUser(true) : setLoginUser(false);
      })();
    }
  }, []);

  return (
    <>
      <Router>
        <Switch>
          <UserContext.Provider value={providerValue}>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route exact path="/register">
              {user ? <Redirect to="/main" /> : <Register />}
            </Route>
            <Route exact path="/login">
              {user ? <Redirect to="/main" /> : <Login />}
            </Route>
            <Route exact path="/main">
              {user ? <Main /> : <Redirect to="/login" />}
            </Route>
            {user && <Route exact path="/main/people">
              <People />
            </Route >}
            {user && <Route exact path="/main/people-list">
              <PeopleList />
            </Route >}
            {user && <Route exact path="/main/group">
              <Group />
            </Route >}
            {user && <Route exact path="/main/group-list">
              <GroupList />
            </Route >}
          </UserContext.Provider>
        </Switch>
      </Router>
    </>
  );
}

export default App;
