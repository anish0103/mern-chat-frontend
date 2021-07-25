import { React } from "react";

import Header from "./Components/Navigation/Header";
import UserList from "./Components/UserComponents/UserList";
import { BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import ChatContainer from "./Components/ChatComponents/ChatContainer";
import './App.css';

function App() {
  return (
    <>
      <Header />
      <div className='app-container'>
        <div className='app-chatcontainer'>
          <Router>
            <div className='app-userlist'>
              <UserList />
            </div>
            <Switch>
              <Route path="/" exact>
                <h1>hello form Home page</h1>
              </Route>
              <Route path="/:params" exact>
                <ChatContainer />
              </Route>
              <Redirect to="/" />
            </Switch>
          </Router>
        </div>
      </div>
    </>
  );
}

export default App;
