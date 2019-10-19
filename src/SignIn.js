import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './SignIn.css';
// import Button from 'react-bootstrap/Button';

const initialState = {
	email: "",
	password: "",
	checkbox: false,
};

class SignIn extends Component 
{
	constructor(props) 
	{
	  super(props);
	  this.state = initialState;
	  console.log("yo")
	}

	handleSubmit = async (event) => 
	{
		event.preventDefault();
		if(this.state.email==="" || this.state.password==="")
			alert("Enter login credentials");
		else
		{
			//fetch
			// const url = 'http://54.193.24.23/test'
		 //   	const data = {email:this.state.email, password:this.state.password};
		 //   	try {
		 //   		const response = await fetch(url, 
		 //   		{
		 //   			method: 'POST',
		 //   			body: JSON.stringify(data),
		 //   			headers: {
		 //   				'Content-Type': 'application/json'
		 //   			},
		 //   		});
		 //   		const json = await response.json();
		 //      	if(json['Result'] === 1) {
		 //        	console.log(json['Cookie']);
		 //        let path = Flood;
		 //        this.props.history.push(path)
		 //        this.setState({flag: 1, txt:'', redir:'true'});
		 //        this.props.loginSuccessHandler()
		 //      }
		 //      else {
		 //         this.setState({flag:2, txt:'Wrong Username or Password'}); 
		 //      }
		 //   		console.log('Success', JSON.stringify(json));
		 //      //console.log(json['Cookie']);
		 //   	} catch (error) {
		 //   		console.error('Error', error);
		 //   	}
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

	handleRegisterClick = (event) => {
		console.log(this.props, "REGCLICK");
		this.props.setReg(true);
	}

	render() 
	{ 
	    return (
    		<div className="flex-wrapper">
				<div className="sans-serif signin-form white-90">
					<div className = "form-div ba flex-col">
					    <h1 className = "black-80 f1 fw2 ba pv2 header"> Sign In </h1>
					    <form className="flex-col" onSubmit={this.handleSubmit}>

					    	<label> Email 
					    	<i className="fa fa-user ph1" aria-hidden="true"></i>
					    	</label>
					    	<input name="email" type="email" className="input-box" required 
					    		placeholder="Email address" onChange={this.handleChange}/>
					    	<br/>
					    	<label> Password <i className="fa fa-lock ph1" aria-hidden="true"></i> </label>
					    	<input name="password" type="password" className="input-box" required
					    		placeholder="Password" onChange={this.handleChange}/>

					    	<div className="checkbox" onClick={this.check}>
					    		<input id="check" type="checkbox" name="checkbox"
					    			onClick={this.check}/> Keep me logged in
					    	</div>
					    	{
					    		 <input className = "button" type="submit" value="Sign In"
					    		 onClick = {this.handleSubmit}/>
					    	}
					    </form>

					    <span> or </span>
					    <input className = "button button2-cr" type="submit" value="Create an account"
					    		onClick = {this.handleRegisterClick}/>
				    </div>
			    </div>
	    	</div>
	    );
	}
}

export default withRouter(SignIn);