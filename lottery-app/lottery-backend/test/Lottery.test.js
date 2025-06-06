const ganache = require('ganache');
const { Web3 } = require('web3');
const assert = require('assert');

// updated imports added for convenience
const web3 = new Web3(ganache.provider())

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: accounts[0], gas:'1000000'})
});

describe('Lottery contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });
}
);

it('allows one account', async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
});


it('it akkows multiple accounts', async () => {
  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei('0.02', 'ether')
  });

  await lottery.methods.enter().send({
    from: accounts[1],
    value: web3.utils.toWei('0.02', 'ether')
  });

  await lottery.methods.enter().send({
    from: accounts[2],
    value: web3.utils.toWei('0.02', 'ether')
  });

  const players = await lottery.methods.getPlayers().call({
    from: accounts[0]
  });

  assert.equal(accounts[0], players[0]);
  assert.equal(accounts[1], players[1]);
  assert.equal(accounts[2], players[2]);

  assert.equal(3, players.length);

});

it('it require minimum ether', async () => {
  try{
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0', 'ether')
    });
    assert(false);
  }catch(err){
    assert(err);
  }
});

it('only manager call pick winner', async() => {
try {
  await lottery.methods.pickWinner().send({
    from: accounts[1]
  });
  assert(false);
} catch (e) {
  assert(e);
}
});


it('sends money to the winner and resets the player array', async() => {
  await lottery.methods.enter().send({
    from: accounts[0],
    value: web3.utils.toWei('2', 'ether')
  });
  const  initialBlance = await web3.eth.getBalance(accounts[0]);
  await lottery.methods.pickWinner().send({
    from: accounts[0]
  });
  const finalBalance = await web3.eth.getBalance(accounts[0]);
  const diff = finalBalance - initialBlance;
  // console.log(finalBalance-initialBlance);
  assert(diff > web3.utils.toWei('1.8', 'ether'));

});
