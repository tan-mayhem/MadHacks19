import React from 'react';
import './page3.scss'
import Spinner from 'react-bootstrap/Spinner'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import 'bootstrap/dist/css/bootstrap.min.css';
import Badge from 'react-bootstrap/Badge'
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom'
import * as V from 'victory';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel, VictoryTheme } from 'victory';
import Navbar from '../Navbar';

class Listings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {email: '', data: [], bid: -1, flag:0, loading: true}//, vicData: this.getData() }
    console.log("Thirdpage check props", props);
    if(this.props.location.state!=undefined)
      this.state.email = this.props.location.state.email;
    else
      props.history.push('/');
    this.handleChange6 = this.handleChange6.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

async handleChange6(e) {
  await this.setState({bid: e.target.value})
 }

 async componentDidMount() {

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
    await this.setState({loading: false});
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
    this.state.loading == true ? 
      <div>
      <div className = "page3bg2">
      <Navbar />
      <div className="spin_s"><Spinner variant='success' animation="border" /> <span><b>Loading...</b></span></div>
      </div>
      </div>
      :
    <div className = "page3bg">
    <Navbar />
    {
      this.state.data.length>0 ?
      this.state.data.map( item => 
      <div key ={item.id} className = "t_flexwrapper">
        <div className = "flex-item1">
          <img className="cardim" src={item.imgurl} alt="Land"/>
        </div>

        <div className = "flex-item2">
          <Card className='t_card'>
              <Card.Body>
                <Card.Title className='t_Title'> {item.title}</Card.Title>
                <Card.Subtitle className="mb-2 t_Cardsub">
                <i className="fa fa-map-marker"></i> {item.location}</Card.Subtitle>
                <br/>
                <p style={{fontSize: '20px'}}> <b>Size :</b> <Badge variant='dark' active>{item.size} acres</Badge></p>
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
          <div className = "chart_s">
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLabel text="Rainfall" x={180} y={30} textAnchor="middle"/>
            <VictoryBar  style={{ data: { fill: "orange" } }} 
              data = {[
                {month: 1, rain: Number(item.weather.precipitation['JAN'])},
                {month: 2, rain: Number(item.weather.precipitation['FEB'])},
                {month: 3, rain: Number(item.weather.precipitation['MAR'])},
                {month: 4, rain: Number(item.weather.precipitation['APR'])},
                {month: 5, rain: Number(item.weather.precipitation['MAY'])},
                {month: 6, rain: Number(item.weather.precipitation['JUN'])},
                {month: 7, rain: Number(item.weather.precipitation['JUL'])},
                {month: 8, rain: Number(item.weather.precipitation['AUG'])},
                {month: 9, rain: Number(item.weather.precipitation['SEP'])},
                {month: 10, rain: Number(item.weather.precipitation['OCT'])},
                {month: 11, rain: Number(item.weather.precipitation['NOV'])},
                {month: 12, rain: Number(item.weather.precipitation['DEC'])}
              ]}
              x={"month"} y={"rain"}
            />
          </VictoryChart>

          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLabel text="Pressure" x={180} y={30} textAnchor="middle"/>
            <VictoryBar  style={{ data: { fill: "orange" } }} 
            data = {[
                {month: 1, rain: Number(item.weather.pressure['JAN'])},
                {month: 2, rain: Number(item.weather.pressure['FEB'])},
                {month: 3, rain: Number(item.weather.pressure['MAR'])},
                {month: 4, rain: Number(item.weather.pressure['APR'])},
                {month: 5, rain: Number(item.weather.pressure['MAY'])},
                {month: 6, rain: Number(item.weather.pressure['JUN'])},
                {month: 7, rain: Number(item.weather.pressure['JUL'])},
                {month: 8, rain: Number(item.weather.pressure['AUG'])},
                {month: 9, rain: Number(item.weather.pressure['SEP'])},
                {month: 10, rain: Number(item.weather.pressure['OCT'])},
                {month: 11, rain: Number(item.weather.pressure['NOV'])},
                {month: 12, rain: Number(item.weather.pressure['DEC'])}
              ]}
            x={"month"} y={"rain"}
              />
          </VictoryChart>

          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLabel text="Temperature" x={180} y={30} textAnchor="middle"/>
            <VictoryBar  style={{ data: { fill: "orange" } }} 
            data = {[
                {month: 1, rain: Number(item.weather.temperature['JAN'])},
                {month: 2, rain: Number(item.weather.temperature['FEB'])},
                {month: 3, rain: Number(item.weather.temperature['MAR'])},
                {month: 4, rain: Number(item.weather.temperature['APR'])},
                {month: 5, rain: Number(item.weather.temperature['MAY'])},
                {month: 6, rain: Number(item.weather.temperature['JUN'])},
                {month: 7, rain: Number(item.weather.temperature['JUL'])},
                {month: 8, rain: Number(item.weather.temperature['AUG'])},
                {month: 9, rain: Number(item.weather.temperature['SEP'])},
                {month: 10, rain: Number(item.weather.temperature['OCT'])},
                {month: 11, rain: Number(item.weather.temperature['NOV'])},
                {month: 12, rain: Number(item.weather.temperature['DEC'])}
              ]}
            x={"month"} y={"rain"}
              />
          </VictoryChart>

          </div>
          <div>
            <p className = "rec-crop"> Recommended harvest: {item.crop[0]['S']}, {item.crop[1]['S']}
              , and {item.crop[2]['S']}</p>
          </div>
        </div>
      </div>
      ) : null }
    </div>
  );
}
}

export default withRouter(Listings);
