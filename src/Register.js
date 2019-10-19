import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './SignIn.css';
import './tachyonStyles.css';
import Button from 'react-bootstrap/Button';

const initialState = {
	email: "",
	password: "",
	confirmPassword: "",
	name: "",
	checkbox: false
};

class Register extends Component
{
	constructor(props) 
	{
	  super(props);
	  this.state = initialState;
	}

	handleSubmit = (event) => 
	{
		event.preventDefault();

		if(this.state.email==="" || this.state.name===""
			|| this.state.password==="")
			alert("Please fill out all details!");
		else if(!this.state.email.includes('@') 
			|| !this.state.email.includes('.'))
			alert("Enter a correct email address");
		else if(this.state.password!==this.state.confirmPassword)
			alert("Passwords don't match! Please try again!");
		else {
			//fetch
		}
	}

	handleChange = async (event) =>
	{
		const { name, value } = event.target;
		await this.setState({ [name]: value }); 
	}

	check = async (event) => 
	{
		const x = document.getElementById("check").checked;
    	document.getElementById("check").checked = x===true ? false : true;
    	await this.setState({checkbox: document.getElementById("check").checked});
	}

	handleSignInClick = () => {
		console.log("SIGNINCLICK", this.props)
		this.props.setReg(false);
	}

	render()
	{
		return (
    		<div className="flex-wrapper">
				<div className="sans-serif signin-form white-90">
					<div className = "form-div ba flex-col">
					    <h1 className = "black-80 f1 fw2 ba pv2"> Register </h1>
					    <form className="flex-col" onSubmit={this.handleSubmit}>

					    	<label> Email 
					    	<i className="fa fa-envelope ph1" aria-hidden="true"></i>
					    	</label>
					    	<input name="email" type="email" className="input-box-reg" required 
					    		placeholder="Email address" onChange={this.handleChange}
					    		/>
					    	<br/>
					    	<label> Name 
					    	<i className="fa fa-user ph1" aria-hidden="true"></i>
					    	</label>
					    	<input name="name" type="text" className="input-box-reg" required 
					    		placeholder="Full Name" onChange={this.handleChange}/>
					    	<br/>
					    	<label> Password <i className="fa fa-lock ph1" aria-hidden="true"></i> </label>
					    	<input name="password" type="password" className="input-box-reg" required
					    		placeholder="Password" onChange={this.handleChange}/>
					    	<br/>
					    	<label> Confirm Password <i className="fa fa-lock ph1" aria-hidden="true"></i> </label>
					    	<input name="confirmPassword" type="password" className="input-box-reg" required
					    		placeholder="Confirm Password" onChange={this.handleChange}/>

					    	{
					    		 <input className = "button" type="submit" value="Create a new account"
					    		 onClick = {this.handleSubmit}/>
					    	}
					    </form>
					    <span> or if you already have an account</span>
					    <input className = "button mt3 button2" type="submit" value="Sign In"
					    		onClick = {this.handleSignInClick}/>
				    </div>
			    </div>
	    	</div>
		);
	}
}

export default withRouter(Register);