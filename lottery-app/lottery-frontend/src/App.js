import logo from "./logo.svg";
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
    state = { 
    manager: '' ,
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  // component renders --> componentDidMount() is called --> call method on contract --> set data on 'state' 
  async componentDidMount() {
    const manager = await lottery.methods.manager().call(); /// no need to specify from field as metamask has defaukt account already set
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    
    this.setState({ manager, players, balance });
    console.log("App component is mounted");
  }

  onSubmit = async (event) => {
    event.preventDefault();
    
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });

  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' }); 

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked!' });
  };


  render() {
    console.log("App component is rendered");
    web3.eth.getAccounts().then(console.log);
    console.log(web3.version);
    return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {this.state.manager},
        Players {this.state.players.length} participated,
        competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!
      </p>

      <hr />

      <form onSubmit={this.onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value={this.state.value} onChange={event => this.setState({ value: event.target.value })}/> 
        </div>
        <button>Enter</button>
      </form>
      <hr/>

<h4>Ready to pick a winner?</h4>
<button onClick={async () => {this.onClick();}}>Pick a winner!</button>


      <h1>{this.state.message}</h1>

    </div>
    );
  }
}
export default App;
