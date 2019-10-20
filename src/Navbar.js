import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './tachyonStyles.css';

const initialState = {
	email: ''
}

class Navbar extends Component
{
	constructor(props)
	{
		super(props);
		this.state = initialState;
		// if(props.location.state!==undefined)
		// 	this.state.email = this.props.location.state.email;
	}

	// //and make currentUser null or something (no sessions)
	// handleSignOutClick = () => {
	// 	this.setState(initialState);
	// 	this.props.history.push("/");
	// }

	// handleGreetingClick = () => {
	// 	this.props.history.push("/profile");
	// }

	// handleProfileClick = () => {
	// 	this.props.history.push("/profile", {email: this.state.email});
	// }

	render() {
		return (
			<nav className="dt w-100 pa3 center navbar"> 
		        <div className="dtc v-mid pv1 ph3">
		          <a href="/" id="name" className="dib pa1 grow-large fw1 logo white">
		            LandYourGreen.space</a>
		        </div>

		        <div className="dtc v-mid tr pv1 ph3 sans-serif">
		          <p className="f3 fw2 hover-white no-underline white-90 dn dib-ns  ph3 pointer" 
		          	 >How it works</p>
		          <p className="f3 fw2 hover-white no-underline white-90 dn dib-ns  ph3 pointer" 
		          	 >Contact</p>

			      {
		         //  	this.props.greeting!==undefined ?
		         //  	<p className="f4 fw3 hover-black no-underline black-70 dib ml2 pv1 ph3 pointer"
		         //  		onClick = {this.handleGreetingClick}>
		         //  	 Hello, {this.props.greeting} </p> 
			        //   : this.state.email!=='' && this.props.register!==true?
			      	 // <p className="f4 fw3 hover-black no-underline black-70 dn dib-ns pv1 ph3 pointer" 
		         //  	 	onClick = {this.handleProfileClick}>Profile</p>
		         //  	 	: null
			      }

			      {
			      	//on click of sign out button should sign out and redirect to home page
		          	// this.props.signout===true ?
		          	// <p className="f4 fw3 hover-black no-underline black-70 dib ml2 pv1 ph3 ba pointer"
		          	// 	onClick = {this.handleSignOutClick}>
		          	//  Sign Out </p> 
			          // : null
			      }
		        </div>
	      </nav> 
	)}
}

export default withRouter(Navbar);