import { React, useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import Header from "./Components/Navigation/Header";
import UserList from "./Components/UserComponents/UserList";
import ChatContainer from "./Components/ChatComponents/ChatContainer";
import { AuthContext } from "./Components/Context/AuthContext";
import HomePage from "./Components/Pages/HomePage";
import LoginPage from "./Components/Pages/LoginPage";
import ChatHome from "./Components/ChatComponents/ChatHome";
import ForgetPage from "./Components/Pages/ForgetPage";
import './App.css';

function App() {

  const LoginData = localStorage.getItem('Data');
  let ldata;

  const StorageHandler = (data) => {
    ldata = { PhoneNo: data.PhoneNo, Password: data.Password, thisid: data._id }
    localStorage.setItem('Data', JSON.stringify(ldata))
  }

  const [Login, setLogin] = useState(false)
  const [id, setid] = useState('')
  const [UserData, SetUserData] = useState()

  useEffect(() => {
    if (LoginData) {
      setLogin(true)
      const user = JSON.parse(LoginData);
      setid(user.thisid);
    }
  }, [LoginData]);

  const login = useCallback(
    () => {
      setLogin(true)
    }, [])

  const logout = useCallback(
    () => {
      setLogin(false)
      localStorage.removeItem('Data');
    }, [])

  const IdHandler = useCallback(
    (data) => {
      setid(data)
    }, [])

  const UserDataHandler = useCallback(
    (data) => {
      SetUserData(data)
    }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn: Login, login: login, logout: logout, UserId: id, IdHandler: IdHandler, UserDataHandler: UserDataHandler, UserData: UserData }}>
      <Router>
        <Header />
        {!Login &&
          <>
            <Route path="/Auth" exact>
              <LoginPage StorageHandler={StorageHandler} />
            </Route>
            <Route path="/Forget" exact>
              <ForgetPage />
            </Route>
          </>}
        {!Login && <Route path="/" exact><HomePage /></Route>}
        <Redirect to="/" />
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
