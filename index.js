// imports
import { ethers } from "./ethers-5.6.esm.min.js"
import { fundMeABI, fundMeAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

const contractAddressDisplay = document.getElementById("connectedContract")
const currentBalanceDisplay = document.getElementById("currentBalanceDisplay")
currentBalanceDisplay.innerHTML = "Click 'Contract Balance' to update"
// if there's an address in constants, display it
if (fundMeAddress) {
    contractAddressDisplay.innerHTML = `${fundMeAddress}`
} else {
    contractAddressDisplay.innerHTML =
        "This form could not connect to its contract on chain..."
}

// connect function
// uses window.ethereum injected by Metamask:
async function connect() {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
        } catch (error) {
            console.log(error)
        }
        connectButton.innerHTML = "Connected!"
        connectButton.style.backgroundImage =
            "linear-gradient(rgb(83, 209, 161), rgb(166, 238, 190))"
        // get connected accounts
        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
    } else {
        connectButton.innerHTML = "Install Metamask."
        connectButton.style.backgroundImage =
            "linear-gradient(rgb(209, 83, 100), rgb(238, 166, 181))"
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        // provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // wallet/signer
        const signer = provider.getSigner()
        // contract from our backend (address and abi in constants.js)
        const contract = new ethers.Contract(fundMeAddress, fundMeABI, signer)
        try {
            // from here make transactions just like backend
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            // call and await our function that returns a promise, passing in response and provider
            await listenForTranactionMine(transactionResponse, provider)
            console.log("Transaction done!")
        } catch (error) {
            console.log(error)
        }
    }
}

// withdraw function (frontend)
async function withdraw() {
    if (window.ethereum !== "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(fundMeAddress, fundMeABI, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTranactionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

// get balance function
async function getBalance() {
    if (window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(fundMeAddress) // imported from constants!
        console.log(ethers.utils.formatEther(balance))
        currentBalanceDisplay.innerHTML = `Current Balance: ${balance} ETH`
    } else {
        currentBalanceDisplay.innerHTML = `Current alance could not be fetched.`
    }
}

// function to listen for transaction to be mined
// function itself not async but returns a promise we then await resolve on.
function listenForTranactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        // listen for transaction finishing
        // provider.on fires every time the passed in event fires
        // provider.once fires once, the next time passed in event fires
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            )
            // call resolve inside the callback .once(), so the promise resolves after the transactionResponse.hash is ready
            resolve()
        })
    })
}
