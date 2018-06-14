import React from 'react';
import { Route } from 'react-router-dom';
import Rename from './components/Rename';
import Reset from './components/Reset';
import Logs from './components/Logs';
import Settings from './components/Settings';

class App extends React.Component {
  render() {
    return (
      <div>
        <Route path="/" exact component={Rename} />
        <Route path="/reset" component={Reset} />
        <Route path="/logs" component={Logs} />
        <Route path="/settings" component={Settings} />
      </div>
    );
  }
}

export default App;
