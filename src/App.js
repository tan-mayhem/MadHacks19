import React from 'react';
import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Mypage.scss'
import Modal from 'react-bootstrap/Button'
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalShow : false};
    this.handleClick = this.handleClick.bind(this);
    this.handleHide = this.handleHide.bind(this);
  }

async handleClick(e) {
    this.setState({modalShow : true});
    const url = 'http://54.193.24.23/test'
    //const data = {username:this.state.userName, password:this.state.password, action:this.state.act};
    try {
      const response = await fetch(url, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error('Error', error);
    }
 }

 handleHide() {
  this.setState({modalShow: false});
 }

render() {
  const mod = this.state.modal;
  return (
    <div className="backg">
      <div className="buttons">
        <Button size="lg" onClick={this.handleClick} className="button2" variant="outline-dark">Sellers</Button>
        <MyVerticallyCenteredModal
        show={this.state.modalShow}
        onHide = {this.handleHide}
        />
        <Button size="lg" className="button1" variant="outline-dark">Buyers</Button>
      </div>
    </div>
  );
}
}

export default App;
