import React from 'react';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Mypage.scss'
import Modal from 'react-bootstrap/Button'
import MyVerticallyCenteredModal from './MyVerticallyCenteredModal';
import { withRouter } from 'react-router-dom';


class Secondpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: '', modalShow : false};
    console.log("Secondpage check props", props);
    this.state.email = this.props.location.state.email;
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

 handleBuyersClick = () => {
  this.props.history.push("/results", {
    email: this.state.email
  });
 }

 handleHide() {
  this.setState({modalShow: false});
 }

render() {
  const mod = this.state.modal;
  return (
    <div className="t_backg">
      <div className="t_buttons">
        <Button size="lg" onClick={this.handleClick} className="t_button2" variant="outline-dark">Sellers</Button>
        <MyVerticallyCenteredModal
        show={this.state.modalShow}
        onHide = {this.handleHide}
        />
        <Button size="lg" className="t_button1" variant="outline-dark"
          onClick={this.handleBuyersClick}>Buyers</Button>
      </div>
    </div>
  );
}
}

export default withRouter(Secondpage);
