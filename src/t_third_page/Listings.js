import React from 'react';
import './page3.scss'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge'
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom'
import * as V from 'victory';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryArea, VictoryStack, VictoryTheme } from 'victory';
import _ from 'lodash';

class Listings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: '', data: [], bid: -1, flag:0}//, vicData: this.getData() }
    console.log("Thirdpage check props", props);
    this.state.email = this.props.location.state.email;
    this.handleChange6 = this.handleChange6.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  // getData() {
  //   const bars = 7;
  //   return [1,2,3,4,5].map((bar) => {
  //     return {x: bar + 1, y: 4};
  //   });
  // }

async handleChange6(e) {
  await this.setState({bid: e.target.value})
 }

 // componentWillUnmount() {
 //    window.clearInterval(this.setStateInterval);
 //  }

 async componentDidMount() {

      // this.setState({
      //   data: this.getData()
      // });
    

    const url = 'http://54.193.24.23/forsale';
    try {
      const response = await fetch(url, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const json = await response.json();
      await this.setState({data : json});
      console.log(this.state.data);
    } catch (error) {
      console.error('Error', error);
    }
 }

handleClick = async (event) => {
  console.log(this.state.email, this.state.bid, event.target.id);
    //TODO send new value with id to backend and wait for response
    const url = 'http://54.193.24.23/forsale/update';
    const data1 = {
      bid: this.state.bid,
      id: event.target.id,
      bidder: this.state.email
    }
    console.log(data1, "DATA1");
    try {
      const response = await fetch(url, 
      {
        method: 'POST',
        body: JSON.stringify(data1),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const json = await response.json();
      console.log(json);
      if(json['Response'] == 0) {
        alert('Please enter above the current bid!')
      }
      else {
        window.location.reload();
      }
 }
 catch (error) {
      console.error('Error', error);
    }
  }

 render() {
  return (
    <div className = "page3bg">
    {
      this.state.data.length>0 ?
      this.state.data.map( item => 
      <div key ={item.id} className = "t_flexwrapper">
        <div className = "flex-item1">
          <img className="cardim" src={item.imgurl} />
        </div>

        <div className = "flex-item2">
          <Card className='t_card'>
              <Card.Body>
                <Card.Title className='t_Title'> {item.title}</Card.Title>
                <Card.Subtitle className="mb-2 t_Cardsub">
                <i className="fa fa-map-marker"></i> {item.location}</Card.Subtitle>
                <br/>
                <p style={{fontSize: '20px'}}> <b>Size :</b> <Badge variant='dark' active>{item.size}</Badge></p>
                <p style={{fontSize: '20px'}}> <b>Starting Price :</b> <Badge variant='dark' active> $ {item.price}/acre</Badge></p>
                <p style={{fontSize: '20px'}}> <b>Current Bid :</b> <Badge variant='dark' active> $ {item.currbid}/acre</Badge></p>
                <Accordion defaultActiveKey="1">
                <Accordion.Toggle as={Button} variant="link" eventKey="0" style = {{marginLeft:"-13px"}}>
                  <span className='t_desc'> 
                    <i className="fa fa-caret-right"></i> <b> Description  </b></span>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Text>
                    {item.desc}
                  </Card.Text>
                </Accordion.Collapse>
                </Accordion>
                <br></br>
                <Form className = 'form'>
                  <Form.Group controlId="formBasicSize" className = 'form-group'>
                    <Form.Label style={{fontWeight:'bold', fontSize: '20px'}}>Make A Bid</Form.Label>
                    <Form.Text className="text-muted" htmlFor="bid"></Form.Text>
                    <Form.Control type="text" placeholder="Price per acre" onChange={this.handleChange6}/>
                  </Form.Group>
                </Form>
                
                 <Button id = {item.id} variant="dark" size="lg" block onClick={this.handleClick}>
                  Submit
                </Button>
              
              </Card.Body>
            </Card>
        </div>
        <div className = "flex-item3">
          <VictoryChart theme={VictoryTheme.material}>
          <VictoryBar 
          data = {[
              {month: 1, rain: item.weather.precipitation['JAN']},
              {month: 2, rain: item.weather.precipitation['FEB']},
              {month: 3, rain: item.weather.precipitation['MAR']},
              {month: 4, rain: item.weather.precipitation['APR']},
              {month: 5, rain: item.weather.precipitation['MAY']},
              {month: 6, rain: item.weather.precipitation['JUN']},
              {month: 7, rain: item.weather.precipitation['JUL']},
              {month: 8, rain: item.weather.precipitation['AUG']},
              {month: 9, rain: item.weather.precipitation['SEP']},
              {month: 10, rain: item.weather.precipitation['OCT']},
              {month: 11, rain: item.weather.precipitation['NOV']},
              {month: 12, rain: item.weather.precipitation['DEC']}
            ]}
          x={"month"} y={"rain"}
            />

            </VictoryChart>
        {
          //   <VictoryChart
          //     domainPadding={{ x: 20 }}
          //     animate={{duration: 500}}
          //   >
          //   <VictoryBar
          //     data={this.state.data}
          //     style={{
          //       data: { fill: "tomato", width: 12 }
          //     }}
          //     animate={{
          //       onExit: {
          //         duration: 500,
          //         before: () => ({
          //           _y: 0,
          //           fill: "orange",
          //           label: "BYE"
          //         })
          //       }
          //     }}
          //   />
          // </VictoryChart>
        }
        </div>
      </div>
      ) : null }
    </div>
  );
}
}

export default withRouter(Listings);
