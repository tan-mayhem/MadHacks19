import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

class MyVerticallyCenteredModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {title:'', location:'', size:'', price:''}
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange1.bind(this);
    this.handleChange4 = this.handleChange2.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  async handleClick(e) {
    const url = 'http://54.193.24.23/addforsale'
    const data = {seller:'jack', title:this.state.title, location:this.state.location, size:this.state.size, price:this.state.price};
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
    } catch (error) {
      console.error('Error', error);
    }
 }

  handleChange1(e) {
  this.setState({title: e.target.value})
 }
 handleChange2(e) {
  this.setState({location: e.target.value})
 }
 handleChange3(e) {
  this.setState({size: e.target.value})
 }
 handleChange4(e) {
  this.setState({price: e.target.value})
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
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" size="lg" onClick={this.handleClick} className="btn" block>
        Submit
        </Button>
        <Button onClick={this.props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
}

export default MyVerticallyCenteredModal;