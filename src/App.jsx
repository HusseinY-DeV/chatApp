import React, { Component } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import profile from './profile.jpeg';
import './App.css';


const Input = styled.div`
 opacity : ${({show}) => show ? 1 : 0};
 position : absolute;
 top: 50px;
 left: 10px;
 width:300px;
 height: 6vh;
 display:flex;
`;

class App extends Component {

  state = {
    isConnected:false,
    id:null,
    oldmsgs : [],
    text : '',
    name : 'Guest',
    show : false,
    val:''
  }
  socket = null

  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on('connect', () => {
      this.setState({id : this.socket.io.engine.id});
      this.setState({isConnected:true})
    })


    this.socket.on('peeps',(people)=>{
      this.setState({peeps : [...people]})
    })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
    })

    this.socket.on("next", (message_from_server) => {
      console.log(message_from_server);
      console.log('here');
    });

    /** this will be useful way, way later **/
    this.socket.on('room', old_messages => {
      this.setState({oldmsgs : old_messages})
    })

  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }


  render() {
    return (
      <div className="App">
        <Input show={this.state.show}>
          <input type="text" placeholder="New name" 
          onChange={e => this.setState({val : e.target.value})}
          />
          <button
          onClick={e => {
            e.preventDefault();
            if(this.state.val) {
              this.setState({name:this.state.val})
              this.setState({show:false})
            }else {
              this.setState({show:false})

            }
           
          }}
          >Change</button>
        </Input>
        <div className="header">
        <img src={profile} width="30px"/>
        <h3 className="status"
        onClick={(e) => {
          e.preventDefault();
          this.setState({show : !this.state.show})
        }}
        >
           {this.state.isConnected ? 'connected' : 'disconnected'} as {this.state.name}  </h3>
          </div>
        <div className="form">
          <div className="inputs">
          <input type="text" placeholder="message" onChange={e =>   this.setState({text:e.target.value})}
          className="text-inp"
          value={this.state.text}
          />
          <button
          onClick={() => {
            if(this.state.text)
            {
              this.setState({text:''})
              this.socket.emit("message",{
                text:this.state.text,
                id: this.state.id,
                name : this.state.name
              });
            }
          
          }}

          className="send"
          >Send</button>
          </div>
        </div>
        <center>Codi-Tech Room Messages :</center>
        <div className="messages">
        {this.state.oldmsgs.map((o,i) => {
          return (
            <div className="e-ms" key={i}>
              <div className="msg-header">
                <img src={profile} width="30px"/>
                <p className="name">{o.name}</p>
              </div>
              <p className="msg">{o.text}</p>
            </div>
          )
        })}
         </div>
      </div>
    );
  }
}

export default App;
