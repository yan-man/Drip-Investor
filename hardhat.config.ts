import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "hardhat-watcher";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  watcher: {
    // compilation: {
    //   tasks: ["compile"],
    //   files: ["./contracts"],
    //   ignoredFiles: ["**/.vscode"],
    //   verbose: true,
    // },
    ci: {
      tasks: [
        "clean",
        { command: "compile", params: { quiet: true } },
        {
          command: "test",
          params: { noCompile: false },
        },
      ],
      files: ["./test/**/*", "./contracts/**/*"],
      verbose: true,
    },
    // test: {
    //   tasks: [{ command: "test", params: { noCompile: false } }],
    //   files: ["./test/**/*"],
    //   verbose: true,
    // },
  },
};

export default config;
