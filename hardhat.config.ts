import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
      },
      {
        version: '0.4.22',
      }
    ]
  },

  defaultNetwork: "hardhat",
  networks: {
    "hardhat": {},
    "polygonMumbai": {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: ["privateKey"]
    }
  }
};

export default config;
