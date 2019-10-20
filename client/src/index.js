import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Header from './components/Header';
import * as serviceWorker from './serviceWorker';


const routing = (
    <Router>
      <div>
        <Header /> 
        <Switch>
          <Route exact path="/" component={App} />
          {/* <Route path="/users" component={Users} />
          <Route path="/contact" component={Contact} />
          <Route component={Notfound} /> */}
        </Switch>
      </div>
    </Router>
  );

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
