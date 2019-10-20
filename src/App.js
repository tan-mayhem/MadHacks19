import React, { Component }  from 'react';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import Secondpage from './t_second_page/Secondpage';
import Listings from './t_third_page/Listings';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import Button from 'react-bootstrap/Button';
import './App.css';

const initialState = {
  currentUser: {
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    joined: ''
  }
}

class App extends Component 
{
  constructor(props) 
  {
    super(props);
    console.log("APP");
    this.state = initialState;
  }

  // WAIT FOR BACKEND DEVELOPMENT 
  // componentDidMount () {
  //   fetch('http://localhost:3000')
  //     .then(res => res.json())
  //     .then(console.log);
  // }

  render()
  {
    return (
      <div>
        <Switch>
          <Route exact path = '/' 
            render = { () => <LandingPage currentUser={this.state.currentUser} /> }
          />

          <Route exact path = '/profile' 
            render = { () => <Secondpage /> }
          />

          <Route exact path = '/results' 
            render = { () => <Listings /> }
          />
        </Switch>
      </div>
    );
  }
}

export default App;
