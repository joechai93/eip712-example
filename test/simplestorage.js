const SimpleStorage = artifacts.require("./SimpleStorage.sol");

const {ethers} = require('ethers');

contract("SimpleStorage", accounts => {
  
  it("...should store the value 89.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    // Set value of 89
    await simpleStorageInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });

  it("test signing", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    wallet = new ethers.Wallet("0xa6ca049a74028044af56a45173781442dcd47caa03ac2a085046f22bb981f6ab");
    // console.log(wallet.address);
    

    // signature = await wallet.signMessage('fsdf');
    // guessAddress = ethers.utils.verifyMessage('fsdf', signature);
    // console.log(guessAddress);

    // expect(await simpleStorageInstance.testSigner(signature)).to.equal(true);

    const test = 0x512345673440;
    const testBytes = ethers.utils.arrayify(test);
    const messageHash = ethers.utils.hashMessage(testBytes);
    //Sign the messageHash
    const messageHashBytes = ethers.utils.arrayify(messageHash);
    const signature = await wallet.signMessage(testBytes);
    //Recover the address from signature
    const recoveredAddress = ethers.utils.verifyMessage(testBytes, signature);
    console.log("singerAddress                   :", wallet.address);
    console.log("recovered address from ethers   :", recoveredAddress);

    //Expect the recovered address is equal to the address of signer 
    expect(recoveredAddress).to.equal(wallet.address);

    //Recover the address from contract TestSign
    const split = ethers.utils.splitSignature(signature);
    const actualSigner = await simpleStorageInstance.recover(messageHash, split.v, split.r, split.s);
    console.log("recovered address from ecrecover:", actualSigner);
    expect(actualSigner).to.equal(wallet.address);

    contract_addr = simpleStorageInstance.contract;
    // Testing sign typed data
    domain = {
      name:"name",
      version:"1",
      chainId:1337,
      verifyingContract:'0xC4ceaC808B8a909CCED3849eCc90FB1cB7cdcD96'
    };
       
    types = {
      set:[
        {name:"buyer",type:"address"}
      ],
    };

    value = {
      buyer:'0xC832FF11B06801c3d81CcBe7708AFb62B72e312f'
    };

    let sig_second = await wallet._signTypedData(domain, types, value);
    console.log("recovered address from ethers typed data:", ethers.utils.verifyTypedData(domain, types, value, sig_second));
    hash_second = ethers.utils._TypedDataEncoder.hash( domain , types , value );
    const splitsecond = ethers.utils.splitSignature(sig_second);
    const actualsecond = await simpleStorageInstance.recover(hash_second, splitsecond.v, splitsecond.r, splitsecond.s);
    console.log("recovered second  address from ecrecover:", actualsecond);

    const third = await simpleStorageInstance.testSigner(sig_second);
    console.log("test signer: ", third);


  })
});
