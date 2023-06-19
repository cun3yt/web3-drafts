require("dotenv").config();

const hre = require("hardhat");

const alu = {
    abi: require('../artifacts/contracts/Alu.sol/Alu.json').abi,
    address: process.env.SEPOLIA_CONTRACT_ADDRESS
}

// call Alu contract to add 10, then wait and call to get the value
async function main() {
    const [signer, otherAccount] = await hre.ethers.getSigners();
    
    const aluContract = new hre.ethers.Contract(alu.address, alu.abi, signer);

    const addTen = await aluContract.add(10, {
        gas: 1000000
    });
    console.log('tx hash:', addTen.hash);

    // wait and call to get the value
    const value = await aluContract.get();
    console.log('value', value);
}

// call main
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
