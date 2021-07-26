import { React, useState, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header from "./Components/Navigation/Header";
import UserList from "./Components/UserComponents/UserList";
import ChatContainer from "./Components/ChatComponents/ChatContainer";
import { AuthContext } from "./Components/Context/AuthContext";
import HomePage from "./Components/Pages/HomePage";
import LoginPage from "./Components/Pages/LoginPage";
import ChatHome from "./Components/ChatComponents/ChatHome";
import './App.css';

function App() {

  const [Login, setLogin] = useState(false)
  const [id, setid] = useState('')

  const login = useCallback(
    () => {
      setLogin(true)
    }, [])

  const logout = useCallback(
    () => {
      setLogin(false)
    }, [])

  const IdHandler = useCallback(
    (data) => {
      setid(data)
    }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn: Login, login: login, logout: logout, UserId: id, IdHandler: IdHandler }}>
      <Router>
        <Header />
        {!Login && <Route path="/Auth" exact>
          <LoginPage />
        </Route>}
        {!Login && <Route path="/" exact><HomePage /></Route>}
      </Router>
      {Login && <div className='app-container'>
        <div className='app-chatcontainer'>
          <Router>
            <div className='app-userlist'>
              <UserList />
            </div>
            <Switch>
              <Route path="/home" exact>
                <ChatHome />
              </Route>
              <Route path="/home/:params" exact>
                <ChatContainer />
              </Route>
              <Redirect to="/home" />
            </Switch>
          </Router>
        </div>
      </div>}
    </AuthContext.Provider>
  );
}

export default App;
