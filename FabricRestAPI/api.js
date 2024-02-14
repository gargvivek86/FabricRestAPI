'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

app.post('/api/addproduct/', async function (req, res) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log('Wallet path: ${walletPath}');
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('SupplyChainContract');
        // submit the specified transaction
        // AddNewCar  transaction - requires 5 argument, ex: (‘addProduct’, ‘2', ‘Mango’, ‘John’,’’, ‘’,’’)
        await contract.submitTransaction('addProduct', req.body.id, req.body.name, req.body.producer, '', '', '');
        console.log('Transaction has been submitted');
        res.send('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});

app.post('/api/recordmovement/', async function (req, res) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log('Wallet path: ${walletPath}');
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('SupplyChainContract');
        // submit the specified transaction
        // AddNewCar  transaction - requires 5 argument, ex: (‘recordProductMovement’, ‘2', ‘distributor’, ‘Sandeep’)
        await contract.submitTransaction('recordProductMovement', req.body.id, req.body.type, req.body.name);
        console.log('Movement has been added');
        res.send('Movement has been added');
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});


app.get('/api/queryproductbyid/:id', async function (req, res) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log('Wallet path: ${walletPath}');
        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('clientUser');
        if (!identity) {
            console.log('An identity for the user "clientUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'clientUser', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('SupplyChainContract');
        // QueryPropertyById transaction - requires one argument ex: (‘queryProductByID’, '2')

        const result = await contract.evaluateTransaction('queryProductByID',req.params.id);
	
        res.status(200).json({response: result.toString()});
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});




app.listen(8080, 'localhost');
console.log('Running on http://localhost:8080');
