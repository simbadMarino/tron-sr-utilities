'use client';
import 'dotenv/config';
import { TronWeb } from 'tronweb';
import axios from 'axios';

async function updateSRInfo() {
    const tronWeb = new TronWeb({
        fullNode: process.env.FULL_NODE_NILE,
        solidityNode: process.env.FULL_NODE_NILE,
        eventServer: process.env.FULL_NODE_NILE,
        privateKey: process.env.PRIVATE_KEY,
    });

    const account = tronWeb.defaultAddress.base58;
    console.log("Account Address: ", account);

    // API Endpoint
    const apiUrl = "https://nile.trongrid.io/wallet/updatewitness";             //Uncomment this for Nile testnet
    //const apiUrl = "https://api.trongrid.io/wallet/updatewitness";            //Uncomment this for Mainnet 
    const SRAddress = "TZ7GK4q6DVrByQv7jky5SahiR1NUVVWDst";                     //Replace with your SR address
    const SRURL = "https://yourSRupdateURL.com";                                // Replace with your actual SR URL

    // Request Payload
    const requestData = {
        owner_address: SRAddress,
        update_url: SRURL,
        Permission_id: 0,       //Change if multisign is enabled
        visible: true
    };

    try {
        // Sending POST request using Axios
        const unsignedTransaction = await axios.post(apiUrl, requestData, {
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            }
        });
        console.log("Unsigned Transaction Response:", unsignedTransaction.data);
        const signedTransaction = await tronWeb.trx.sign(unsignedTransaction.data);
        const broadcastTransaction = await tronWeb.trx.sendRawTransaction(signedTransaction);

        console.log('Transaction hash:', broadcastTransaction.txid);
        console.log('Transaction result:', broadcastTransaction.result);



    } catch (error) {
        console.error("Error updating SR info:", error.response ? error.response.data : error.message);
    }
}

// Run the function
updateSRInfo();
