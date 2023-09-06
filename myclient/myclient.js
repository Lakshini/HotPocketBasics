const HotPocket = require('hotpocket-js-client');
const fs = require('fs');

async function clientApp() {
    const keyFile = 'user.key';

    if(!fs.existsSync(keyFile)){
        const newKeyPair = await HotPocket.generateKeys();
        const saveData = Buffer.from(newKeyPair.privateKey).toString('hex');
        fs.writeFileSync(keyFile, saveData);
        console.log('New key pair generated..');
    }

    // Generate the key pair using saved private key data.
   const savedPrivateKeyHex = fs.readFileSync(keyFile).toString();
   const userKeyPair = await HotPocket.generateKeys(savedPrivateKeyHex);
   
   const client = await HotPocket.createClient(['wss://localhost:8081'], userKeyPair);

    //Establish HotPocket connection.
    if (!(await client.connect())) {
        console.log("Connection failed.");
        return;
    }
  
    console.log("HotPocket Connected.");
    console.log("Saying hello...");
    
    await client.submitContractInput("hello");

    client.on(HotPocket.events.contractOutput, (result) => {
        console.log("Received outputs:");
        result.outputs.forEach((o) => console.log(o));
  
        client.close();
  });
}

clientApp();