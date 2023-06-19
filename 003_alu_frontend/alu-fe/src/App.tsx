// src/app.js
import './App.css';
import { ethers } from 'ethers'
import { useState } from 'react';
import AluArtifact from "./artifacts/contracts/Alu.sol/Alu.json"

const contractAddress = process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS || ""


function App() {
  const [aluData, setAluData] = useState(1)
  const [amount, setAmount] = useState(10)        // increment amount

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  
  async function _intializeContract(init: ethers.providers.JsonRpcSigner) {
    // We first initialize ethers by creating a provider using window.ethereum
    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    console.log(`contract address: ${contractAddress}`)
    console.log(`abi: ${AluArtifact.abi}`)
    console.log(`signer: ${signer}`)

    const contract = new ethers.Contract(
      contractAddress,
      AluArtifact.abi,
      init
    );

    console.log(`contract: ${contract}`)

    return contract
  }
  
  async function _getAluData() {
    const contract = await _intializeContract(signer)
    const value = await contract.get();
    console.log(`value: ${value}`)
    setAluData(Number(value));
  }

  async function makeIncrementCall() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const contract = await _intializeContract(signer)
      const contractCall = await contract.add(amount);
      await contractCall.wait();      // @todo: is this necessary?
      console.log(`add call tx hash: ${contractCall.hash}`);
      _getAluData()
    }
  }
  
  return (
    <div className="App">
      <header className="App-header">
        
        <button onClick={_getAluData}>get ALU data</button>

        <h1>{aluData}</h1>

        <input onChange={e => setAmount(Number(e.target.value))} placeholder="Increment Amount" />
        
        <button onClick={makeIncrementCall}>Increment</button>
      </header>
    </div>
  );
}
export default App;