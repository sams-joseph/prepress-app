import React from 'react';
import { Route } from 'react-router-dom';
import Rename from './components/Rename';
import Reset from './components/Reset';
import CreateFolders from './components/CreateFolders';
import Logs from './components/Logs';
import Settings from './components/Settings';
import Job from './components/Job';

class App extends React.Component {
  render() {
    return (
      <div>
        <Route path="/" exact component={Rename} />
        <Route path="/reset" component={Reset} />
        <Route path="/create" exact component={CreateFolders} />
        <Route path="/logs" component={Logs} />
        <Route path="/settings" component={Settings} />
        <Route path="/job/:order" component={Job} />
      </div>
    );
  }
}

export default App;
