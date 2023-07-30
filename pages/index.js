import {useState, useEffect} from "react";
import {ethers} from "ethers";
import token_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [totalSupply, setTotalSupply] = useState(undefined);
  const [tokenName, setTokenName] = useState(undefined);
  const [tokenSymbol, setTokenSymbol] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const tokenABI = token_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getTokenContract();
  };

  const getTokenContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(contractAddress, tokenABI, signer);
 
    setToken(tokenContract);
  }

  const getTokenName = async () => {
    if(token){
      setTokenName((await token.getTokenName()));
    }
  }

  const getTokenSymbol = async () => {
    if(token){
      setTokenSymbol((await token.getTokenSymbol()))
    }
  }
  const getTotalSupply = async() => {
    if (token) {
      setTotalSupply((await token.getTotalSupply()).toNumber());
    }
  }

  const mint = async() => {
    if (token) {
      let tx = await token.mint(1);
      await tx.wait()
      getTotalSupply();
    }
  }

  const burn = async() => {
    if (token) {
      let tx = await token.burn(1);
      await tx.wait()
      getTotalSupply();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (totalSupply == undefined) {
      getTotalSupply();
    }

    if (tokenName == undefined) {
      getTokenName();
    }

    if (tokenSymbol == undefined) {
      getTokenSymbol();
    }


    return (
      <div>
        <p>Token Name: {tokenName}</p>
        <p>Token Symbol: {tokenSymbol}</p>
        <p>Your Account: {account}</p>
        <p>Total Supply: {totalSupply} {tokenSymbol}</p>
        <button onClick={mint}>Mint 1 SBZ</button>
        <button onClick={burn}>Burn 1 SBZ</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome Web3 User!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
