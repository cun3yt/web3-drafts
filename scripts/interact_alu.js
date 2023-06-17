const { Web3 } = require('web3');

const nodeUrl = 'http://localhost:8545';
const web3 = new Web3(nodeUrl);

const alu = {
    abi: require('../artifacts/contracts/Alu.sol/Alu.json').abi,
    address: '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707'
}

const aluContract = new web3.eth.Contract(alu.abi, alu.address); 

// call Alu contract to add 10, then wait and call to get the value
async function main() {
    const providersAccounts = await web3.eth.getAccounts();
	const defaultAccount = providersAccounts[2];

    // call Alu contract to add 10
    const addTen = await aluContract.methods.add(10).send({
        from: defaultAccount, 
        gas: 1000000
    });
    console.log('addTen', addTen);

    // wait and call to get the value
    const value = await aluContract.methods.get().call();
    console.log('value', value);
}

// call main
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
