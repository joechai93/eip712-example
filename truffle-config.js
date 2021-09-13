const path = require("path");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "universe season village burst twice nasty wrestle green steak rhythm normal snow";
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      provider: () =>
      new HDWalletProvider(mnemonic, "http://127.0.0.1:8545"),
      network_id: "1337"
    }
    // rinkeby: {
    //   provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/423cea75c9a54548b6c871e5bc63f03e`),
    //   network_id: 4,       // rinkeby's id
    //   gas: 5500000,        
    //   timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    //   skipDryRun: true,    // Skip dry run before migrations? (default: false for public nets )
    //   from: 'add address to deploy contract with'    
    // }
  },
  compilers: {
    solc: {
      version: "0.8.0"
   }
  }
};
