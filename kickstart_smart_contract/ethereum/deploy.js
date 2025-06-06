const HDWalletProvider = require('@truffle/hdwallet-provider')
const {Web3} = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(

    'olympic reduce color mixture program voyage motion tribe someone future tennis bachelor',
    'https://sepolia.infura.io/v3/3244c5ffb30e486b984f14231aa82d47'

);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
    console.log("provider stopped");
}
console.log("out of deploy function");
deploy();