import { run, ethers, network, artifacts } from "hardhat";
import { Wallet } from "ethers";
import {
  deployMockLendingManager,
  deployMockILendingPool,
  deployMockILendingPoolAddressesProvider,
  deployMockISwapRouter,
  deployMockWeth,
  deployMockUsdc,
} from "../test/shared/mocks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  await run("compile");
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await signers[0].getAddress()
  );

  const mockUsdc = await deployMockUsdc(signers[0]);
  const mockWeth = await deployMockWeth(signers[0]);
  console.log("Mock USDC deployed to:", mockUsdc.address);
  console.log("Mock WEth deployed to:", mockWeth.address);

  const lendingManager = await deployLendingManager(signers);
  const dEXManager = await deployDEXManager(
    signers,
    mockUsdc.address,
    mockWeth.address
  );
  const tradeManager = await deployTradeManager(signers);
  const jobManager = await deployJobManager(signers);
  const dCAManager = await deployDCAManager(signers, mockUsdc.address);
  const keepersManager = await deployKeepersManager(signers);
}

async function deployKeepersManager(signers: SignerWithAddress[]) {
  const KeepersManager = await ethers.getContractFactory("KeepersManager");
  const keepersManager = await KeepersManager.deploy();

  await keepersManager.deployed();

  console.log("KeepersManager deployed to:", keepersManager.address);
  return keepersManager;
}
async function deployDCAManager(signers: SignerWithAddress[], USDC: String) {
  const DCAManager = await ethers.getContractFactory("DCAManager");
  const dCAManager = await DCAManager.deploy(USDC);

  await dCAManager.deployed();

  console.log("DCAManager deployed to:", dCAManager.address);
  return dCAManager;
}
async function deployJobManager(signers: SignerWithAddress[]) {
  const DCAOptions = await ethers.getContractFactory("DCAOptions");
  const dCAOptions = await DCAOptions.deploy();

  const JobManager = await ethers.getContractFactory("JobManager", {
    libraries: {
      DCAOptions: dCAOptions.address,
    },
  });
  const jobManager = await JobManager.deploy();

  await jobManager.deployed();

  console.log("JobManager deployed to:", jobManager.address);
  console.log("DCAOptions lib deployed to:", dCAOptions.address);
  return jobManager;
}
async function deployTradeManager(signers: SignerWithAddress[]) {
  const TradeManager = await ethers.getContractFactory("TradeManager");
  const tradeManager = await TradeManager.deploy();

  await tradeManager.deployed();

  console.log("TradeManager deployed to:", tradeManager.address);
  return tradeManager;
}

async function deployDEXManager(
  signers: SignerWithAddress[],
  mockUsdc: String,
  mockWeth: String
) {
  const mockISwapRouter = await deployMockISwapRouter(signers[0]);

  // await mockILendingPoolAddressesProvider.mock.getLendingPool.returns(
  //   mockILendingPool.address
  // );

  const DEXManager = await ethers.getContractFactory("DEXManager");
  const dEXManager = await DEXManager.deploy(
    mockISwapRouter.address,
    mockUsdc,
    mockWeth
  );

  await dEXManager.deployed();

  console.log("SwapRouter deployed to:", mockISwapRouter.address);

  return dEXManager;
}

async function deployLendingManager(signers: SignerWithAddress[]) {
  const mockILendingPool = await deployMockILendingPool(signers[0]);
  const mockILendingPoolAddressesProvider =
    await deployMockILendingPoolAddressesProvider(signers[0]);
  await mockILendingPoolAddressesProvider.mock.getLendingPool.returns(
    mockILendingPool.address
  );

  const LendingManager = await ethers.getContractFactory("LendingManager");
  const lendingManager = await LendingManager.deploy(
    mockILendingPoolAddressesProvider.address
  );

  await lendingManager.deployed();

  console.log("LendingManager deployed to:", lendingManager.address);
  return lendingManager;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
