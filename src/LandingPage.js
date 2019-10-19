import React, { Component }  from 'react';
import { withRouter } from 'react-router-dom';
import "./tachyonStyles.css";
import Navbar from "./Navbar";
import SignIn from "./SignIn";
import Register from "./Register";
//import "./LandingPage.css";

const initialState = {
	register: ''
};

class LandingPage extends Component 
{
	constructor(props) 
	{
	  super(props);
	  this.state = initialState;
	  console.log(props, "Lander");
	  if(this.props.location.state !== undefined)
	  	this.state.register=this.props.location.state.register;
	  else
	  	this.state.register = false;
	}

	setRegister = (val) => {
		console.log("SETREGISTER: ",val);
		this.setState({register: val});
	}

	render() 
	{
	  return (
	  		<div className="backg">
	  			<div className="backg-sheet">
	  			<Navbar />
			  	<header className="sans-serif">
			  	{
			  		this.state.register==true ? <Register setReg={this.setRegister}/> 
			  			: <SignIn setReg = {this.setRegister}/>
				}
				</header>
				</div>
			</div>
	  );
	}
}

export default withRouter(LandingPage);