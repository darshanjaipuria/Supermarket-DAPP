import Head from 'next/head'
import { useState, useEffect } from 'react'
import Web3 from 'web3'
import vendingMachineContract from '../blockchain/vending'
import 'bulma/css/bulma.css'
import styles from '../styles/VendingMachine.module.css'

const Supermarket = () => {
    const [error, setError] = useState('')

    const [refreshersInventory, setRefreshers] = useState('')
    const [cupcakesInventory, setCupcakes] = useState('')
    const [laysInventory, setLays] = useState('')

    const [successRefreshersMessage, setRefreshersSuccessMessage] = useState('')
    const [successCupcakesMessage, setCupcakesSuccessMessage] = useState('')
    const [successLaysMessage, setLaysSuccessMessage] = useState('')

    const [myRefreshersCount, setMyRefresherCount] = useState('')
    const [myCupcakesCount, setMyCupcakesCount] = useState('')
    const [myLaysCount, setMyLaysCount] = useState('')

    const [buyRefreshersCount, setBuyRefreshersCount] = useState('')
    const [buyCupcakesCount, setBuyCupcakesCount] = useState('')
    const [buyLaysCount, setBuyLaysCount] = useState('')


    const [web3, setWeb3] = useState(null)
    const [address, setAddress] = useState(null)
    const [vmContract, setVmContract] = useState(null)

    const [refreshersPurchases, setRefreshersPurchases] = useState(0)
    const [cupcakesPurchases, setCupcakesPurchases] = useState(0)
    const [laysPurchases, setLaysPurchases] = useState(0)

    useEffect(() => {

        if (vmContract) getRefresherStockLeft()
        if (vmContract) getDonutStockLeft()
        if (vmContract) getLaysStockLeft()
        if (vmContract && address) getMyRefreshersCountHandler()
        if (vmContract && address) getMyCupcakeCountHandler()
        if (vmContract && address) getMyLaysCountHandler()
    }, [vmContract, address, refreshersPurchases, cupcakesPurchases, laysPurchases])

    const getRefresherStockLeft = async () => {
        const refreshers = await vendingMachineContract.methods.getRefresherStockLeft().call()
        setRefreshers(refreshers)
    }

    const getDonutStockLeft = async () => {
        const cupcakes = await vendingMachineContract.methods.getDonutStockLeft().call()
        setCupcakes(cupcakes)
    }

    const getLaysStockLeft = async () => {
        const lays = await vendingMachineContract.methods.getLaysStockLeft().call()
        setLays(lays)
    }

    const getMyRefreshersCountHandler = async () => {

        const donutCount = await vendingMachineContract.methods.refresherCount(address).call()
        setMyRefresherCount(donutCount)
    }
    const getMyCupcakeCountHandler = async () => {

        const cupcakeCount = await vendingMachineContract.methods.dounutCount(address).call()
        setMyCupcakesCount(cupcakeCount)
    }
    const getMyLaysCountHandler = async () => {

        const laysCount = await vendingMachineContract.methods.laysCount(address).call()
        setMyLaysCount(laysCount)
    }



    const updateRefreshersQty = event => {

        setBuyRefreshersCount(event.target.value)

    }
    const updateCupcakesQty = event => {

        setBuyCupcakesCount(event.target.value)

    }
    const updateLaysQty = event => {

        setBuyLaysCount(event.target.value)

    }



    const buyRefreshersButton = async () => {
        try {
            await vmContract.methods.numberOfRefresher(buyRefreshersCount).send({
                from: address,
                value: web3.utils.toWei('0.002', 'ether') * buyRefreshersCount
            })
            // setRefreshersPurchases++
            setRefreshersSuccessMessage(`${buyRefreshersCount} Refresher Purchased Successfully`)

            if (vmContract) getRefresherStockLeft()
            if (vmContract && address) getMyRefreshersCountHandler()

        } catch (err) {
            setError(err.message)
        }
    }

    const buyCupcakesButton = async () => {
        try {
            await vmCachineContract.methods.numberOfDonut(buyCupcakesCount).send({
                from: address,
                value: web3.utils.toWei('0.002', 'ether') * buyCupcakesCount
            })
            // setCupcakesPurchases++;
            setCupcakesSuccessMessage(`${buyCupcakesCount} Cupcake Purchased Successfully`)

            if (vmContract) getDonutStockLeft()
            if (vmContract && address) getMyCupcakeCountHandler()

        } catch (err) {
            setError(err.message)
        }
    }
    const buyLaysButton = async () => {
        try {
            await vmContract.methods.numberOfLays(buyLaysCount).send({
                from: address,
                value: web3.utils.toWei('0.001', 'ether') * buyLaysCount
            })
            // setLaysPurchases++;
            setLaysSuccessMessage(`${buyLaysCount} Lays Purchased Successfully`)

            if (vmContract) getLaysStockLeft()
            if (vmContract && address) getMyLaysCountHandler()

        } catch (err) {
            setError(err.message)
        }
    }

    const connectWalletHandler = async () => {
        /*Checking if metamask is available*/
        if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
            try {
                /*Requesting for wallet connect */
                await window.ethereum.request({ method: "eth_requestAccounts" });         //requesting the account

                /*set web3 instance*/
                web3 = new Web3(window.ethereum);
                setWeb3(web3)

                /*get list of accounts */
                const accounts = await web3.eth.getAccounts()
                setAddress(accounts[0])

                /*create local contract */
                const vm = vendingMachineContract(web3)
                setVmContract(vm)

                getMyRefreshersCountHandler()
                getMyCupcakeCountHandler()
                getMyLaysCountHandler()

            } catch (err) {
                setError(err.message);   //Will show the error caught on browser
            }

        } else {
            //MetaMask not installed
            console.log("Please install Metamask.");
        }
    }
    return (
        <div >
            <Head>
                <title>Supermarket DApp</title>
                <meta name="description" content="Supermarket on Blockchain" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>
            <nav className='navbar mt-8 mb-8 ' style={{ marginTop: '10px', color: 'red' }} >
                <div className='container'>
                    <div className='navbar-brand'>
                        <h1>Supermarket DApp</h1>
                    </div>
                    <div className='navbar-end'>
                        <button onClick={connectWalletHandler} className='button is-primary'>Connect Wallet</button>
                    </div>
                </div>
            </nav>
            <section>
                <div className='container'>
                    <h2>Products avilable in Supermarket: </h2>
                    <p>Refreshers : {refreshersInventory} </p>
                    <p>Cupcakes : {cupcakesInventory} </p>
                    <p>Lays : {laysInventory} </p>
                </div>
            </section>
            <section>
                <div className='container'>
                    <h2>My Account: </h2>
                    <p>Refreshers : {myRefreshersCount} </p>
                    <p>Cupcakes : {myCupcakesCount} </p>
                    <p>Lays : {myLaysCount} </p>
                </div>
            </section>
            <section className='mt-5'>
                <div className='container'>
                    <div className='field'>
                        <label className='label'>Buy Refreshers </label>
                        <div className='control'>
                            <input onChange={updateRefreshersQty} className='input' type="text" placeholder="Number of Refreshers" />
                        </div>
                        <button onClick={buyRefreshersButton} className='button is-primary'>Buy! Now</button>
                        <label className='label'>Buy Cupcakes </label>
                        <div className='control'>
                            <input onChange={updateCupcakesQty} className='input' type="text" placeholder="Number of Cupcakes" />
                        </div>
                        <button onClick={buyCupcakesButton} className='button is-primary'>Buy! Now</button>
                        <label className='label'>Buy Lays </label>
                        <div className='control'>
                            <input onChange={updateLaysQty} className='input' type="text" placeholder="Number of Lays" />
                        </div>
                        <button onClick={buyLaysButton} className='button is-primary'>Buy! Now</button>
                    </div>
                </div>
            </section>
            <section>
                <div className='container has-text-danger'>
                    <p>{error}</p>
                </div>
            </section>
            <section>
                <div className='container has-text-success'>
                    <p>{successRefreshersMessage}</p>
                    <p>{successCupcakesMessage}</p>
                    <p>{successLaysMessage}</p>
                </div>
            </section>
        </div>
    )
}
export default Supermarket;