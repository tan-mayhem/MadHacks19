import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class MyVerticallyCenteredModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title:'', location:'', size:'', price:'', shortdesc:'', imageurl:'', phone:'', txt:'', flag:0}
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.handleChange5 = this.handleChange5.bind(this);
    this.handleChange6 = this.handleChange6.bind(this);
    this.handleChange7 = this.handleChange7.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  async handleClick(e) {
    const url = 'http://54.193.24.23/addforsale'
    const data = {seller:'jack', title:this.state.title, location:this.state.location, size:this.state.size, price:this.state.price, desc:this.state.shortdesc, imgurl:this.state.imageurl, phone:this.state.phone};
    try {
      const response = await fetch(url, 
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const json = await response.json();
      console.log("KK "+json);
      if(json['Response'] === 1) {
        this.setState({flag: '1', txt:'Submitted Successfully!'})
      }
    } catch (error) {
      console.error('Error', error);
    }
 }

  async handleChange1(e) {
  await this.setState({title: e.target.value})
 }
 async handleChange2(e) {
  await this.setState({location: e.target.value})
 }
 async handleChange3(e) {
  await this.setState({size: e.target.value})
 }
 async handleChange4(e) {
  await this.setState({price: e.target.value})
 }
 async handleChange5(e) {
  await this.setState({shortdesc: e.target.value})
 }
 async handleChange6(e) {
  await this.setState({imageurl: e.target.value})
 }
 async handleChange7(e) {
  await this.setState({phone: e.target.value})
 }

render() { 
  return (
    <Modal
      {...this.props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Enter Details 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form className = 'form'>
        <Form.Group controlId="formBasicSize" className = 'form-group'>
          <Form.Label style={{fontWeight:'bold'}}>Phone Number (Text Notification)</Form.Label>
          <Form.Text className="text-muted" htmlFor="short"></Form.Text>
          <Form.Control type="text" placeholder="Phone Number" onChange={this.handleChange7}/>
        </Form.Group>
        <Form.Group controlId="formBasicTitle" className = 'form-group'>
          <Form.Label style={{fontWeight:'bold'}}>Title</Form.Label>
          <Form.Text className="text-muted" htmlFor="title"></Form.Text>
          <Form.Control type="text" placeholder="Title" onChange={this.handleChange1}/>
        </Form.Group>
        <Form.Group controlId="formBasicLocation" className = 'form-group'>
        <Form.Label style={{fontWeight:'bold'}}>Location</Form.Label>
        <Form.Text className="text-muted" htmlFor="location"></Form.Text>
        <Form.Control type="text"  placeholder="Location" onChange={this.handleChange2}/>
        </Form.Group>
        <Form.Group controlId="formBasicSize" className = 'form-group'>
          <Form.Label style={{fontWeight:'bold'}}>Size of Land</Form.Label>
          <Form.Text className="text-muted" htmlFor="size"></Form.Text>
          <Form.Control type="text" placeholder="Size" onChange={this.handleChange3}/>
        </Form.Group>
        <Form.Group controlId="formBasicSize" className = 'form-group'>
          <Form.Label style={{fontWeight:'bold'}}>Price of land per acre</Form.Label>
          <Form.Text className="text-muted" htmlFor="price"></Form.Text>
          <Form.Control type="text" placeholder="Price" onChange={this.handleChange4}/>
        </Form.Group>
        <Form.Group controlId="formBasicSize" className = 'form-group'>
          <Form.Label style={{fontWeight:'bold'}}>Description</Form.Label>
          <Form.Text className="text-muted" htmlFor="short"></Form.Text>
          <Form.Control type="text" placeholder="Description" onChange={this.handleChange5}/>
        </Form.Group>
        <Form.Group controlId="formBasicSize" className = 'form-group'>
          <Form.Label style={{fontWeight:'bold'}}>Image URL</Form.Label>
          <Form.Text className="text-muted" htmlFor="short"></Form.Text>
          <Form.Control type="text" placeholder="URL" onChange={this.handleChange6}/>
        </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" size="lg" onClick={this.handleClick} className="btn" block>
        Submit
        </Button>
        <span style={{color:'green'}}>{this.state.txt}</span>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
}

export default MyVerticallyCenteredModal;