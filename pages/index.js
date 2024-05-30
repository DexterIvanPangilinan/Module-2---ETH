import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [randomToken, setRandomToken] = useState(0);
  const [randomCar, setRandomCar] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(15);
      await tx.wait();
      getBalance();
    }
  };

  const getAll = async () => {
    if (atm && balance !== undefined) {
      // Withdraw entire balance
      let tx = await atm.withdraw(balance);
      await tx.wait();
      getBalance();
    }
  };

  const randomizeTokens = async () => {
    const tokenValues = [0, 10, 20, 100];
    const randomValue = tokenValues[Math.floor(Math.random() * tokenValues.length)];
    setRandomToken(randomValue);
    if (atm) {
      let tx = await atm.deposit(randomValue);
      await tx.wait();
      getBalance();
    }
  };

  const randomizeCar = async () => {
    const carList = [
      { name: "Tesla Model S", cost: 100 },
      { name: "BMW i8", cost: 80 },
      { name: "Audi R8", cost: 90 },
      { name: "Mercedes-Benz S-Class", cost: 70 },
      { name: "Porsche 911", cost: 85 }
    ];
  
    const randomIndex = Math.floor(Math.random() * carList.length);
    const selectedCar = carList[randomIndex];
  
    if (atm) {
      let tx = await atm.withdraw(selectedCar.cost);
      await tx.wait();
      getBalance();
    }
  
    setRandomCar(selectedCar.name);
  };

  const exit = () => {
    setAccount(undefined);
    setATM(undefined);
    setBalance(undefined);
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance == undefined) {
      getBalance();
    }

    const buttonStyles = {
        backgroundColor: '#4CAF50',
        border: 'none',
        color: 'white',
        padding: '15px 32px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '1rem',
        margin: '4px 2px',
        cursor: 'pointer',
        borderRadius: '8px',
      };
      
      return (
        <center>
          <div>
            <p style={{ fontSize: '1.2rem' }}><mark>Your Account: {account}</mark></p>
            <p style={{ fontSize: '1.2rem' }}><mark>Your Balance: {balance}</mark></p>
            <br />
            <button style={{ ...buttonStyles, backgroundColor: '#4CAF50' }} onClick={() => deposit(50)}>Deposit 50 Token</button>
            <button style={{ ...buttonStyles, backgroundColor: '#f44336' }} onClick={withdraw}>Withdraw 15 Token</button>
            <button style={{ ...buttonStyles, backgroundColor: '#008CBA' }} onClick={getAll}>Get all the Token</button>
            <button style={{ ...buttonStyles, backgroundColor: '#555555' }} onClick={randomizeTokens}>Randomize Tokens</button>
            <p style={{ fontSize: '1.2rem' }}>Random Token Amount: {randomToken}</p>
            <button style={{ ...buttonStyles, backgroundColor: '#555555' }} onClick={randomizeCar}>Randomize Car</button>
            <p style={{ fontSize: '1.2rem' }}>Random Car Brand: {randomCar}</p>
            <button style={{ ...buttonStyles, backgroundColor: '#f44336' }} onClick={exit}>Refresh</button>
          </div>
        </center>
      );
      
  };

  useEffect(() => {
    getWallet();
    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const updateClock = () => {
    let hr = document.querySelector('#hr');
    let mn = document.querySelector('#mn');
    let sc = document.querySelector('#sc');
    
    let day = new Date();
    let hh = day.getHours() * 30;
    let mm = day.getMinutes() * 6;
    let ss = day.getSeconds() * 6;
    hr.style.transform = `rotateZ(${hh+(mm/12)}deg)`;
    mn.style.transform = `rotateZ(${mm}deg)`;
    sc.style.transform = `rotateZ(${ss}deg)`;    
  };

  return (
    <main className="container">
      <header>
        <h1>Welcome to Dexter's ATM!</h1>
      </header>
      {initUser()}
      <div className="clock" id="clock">
        <div className="circle" id="sc" style={{ '--clr': 'red' }}><i></i></div>
        <div className="circle circle2" id="mn" style={{ '--clr': '#4c0041' }}><i></i></div>
        <div className="circle circle3" id="hr" style={{ '--clr': '#4c0041' }}><i></i></div>
      </div>
      <style jsx>{`
        .container {
          text-align: center;
          background-color: rgba(240, 248, 255, 0.8);
          padding: 20px;
          border-radius: 10px;
          margin-right: 10px;

        }
        header {
          background-color: #4682b4;
          color: white;
          padding: 10px;
          border-radius: 10px;
          margin: 5px;
        }
        
        main {
          background-color: light blue;
          height: 100vh;
            
        }
        .clock {
          background-image: url(https://i.pinimg.com/736x/39/fb/76/39fb765781f5b46586ee5104e6f9a121.jpg);
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
          position: absolute;
          top: 20px;
          right: 20px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4px solid #ff00d9;
        }
        .clock::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #2f363e;
          border: 2px solid #ff00d9;
          border-radius: 50%;
          z-index: 100000;
        }
        .circle {
          position: absolute;
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .circle i {
          position: absolute;
          width: 2px;
          height: 50%;
          background: var(--clr);
          transform-origin: bottom;
          transform: scaleY(0.5);
        }
        .circle2 {
          height: 150px;
        }
        .circle3 {
          height: 100px;
        }
      `}</style>
    </main>
  );
}
