const HotPocket = require("hotpocket-nodejs-contract");

const mycontract = async (ctx) => {
    // Smart contract logic.
    console.log('Blank contract');
    console.log("Ledger number :", ctx.lclSeqNo);
    console.log("Connected users :", ctx.users.count());

    for(const user of ctx.users.list()){
        console.log("User public key :", user.publicKey);

        // Loop the inputs sent by user
        console.log(user.inputs);
        for(const input of user.inputs){
            const buffer = await ctx.users.read(input);
            const message = buffer.toString();

            console.log("Received input : ", message);
            await user.send(`You said '${message}'`);
            await user.send(`Thanks for talking to me!`);
        }
    }
}

const hpc = new HotPocket.Contract();
hpc.init(mycontract);