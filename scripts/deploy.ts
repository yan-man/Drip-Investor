import { run, ethers, network, artifacts } from "hardhat";
import { Wallet, ContractFactory } from "ethers";
import {
  deployMockLendingManager,
  deployMockILendingPool,
  deployMockILendingPoolAddressesProvider,
  deployMockISwapRouter,
  deployMockWeth,
  deployMockUsdc,
} from "../test/shared/mocks";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  DCAManager,
  JobManager,
  TradeManager,
  KeepersManager,
  LendingManager,
  DEXManager,
} from "../typechain-types/contracts/";

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

  const { lendingManager } = await deployLendingManager(signers);
  const { dEXManager } = await deployDEXManager(
    signers,
    mockUsdc.address,
    mockWeth.address
  );
  const { tradeManager } = await deployTradeManager(signers);
  const { jobManager } = await deployJobManager(signers);
  const { keepersManager } = await deployKeepersManager(signers);

  const { dCAManager } = await deployDCAManager(signers, mockUsdc.address);

  await lendingManager.setDepositToken(mockUsdc.address);

  await keepersManager.setTradeManager(tradeManager.address);
  await keepersManager.setJobManager(jobManager.address);

  await dCAManager.setContractAddress(0, jobManager.address);
  await dCAManager.setContractAddress(1, keepersManager.address);
  await dCAManager.setContractAddress(2, tradeManager.address);
  await dCAManager.setContractAddress(3, dEXManager.address);
  await dCAManager.setContractAddress(4, lendingManager.address);

  saveFrontendFiles(
    tradeManager,
    jobManager,
    dCAManager,
    keepersManager,
    dEXManager,
    lendingManager
  );
}

async function saveFrontendFiles(
  tradeManager: TradeManager,
  jobManager: JobManager,
  dCAManager: DCAManager,
  keepersManager: KeepersManager,
  dEXManager: DEXManager,
  lendingManager: LendingManager
) {
  const fs = require("fs");
  // const contractsDir = __dirname + "/../frontend/src/contracts";

  // if (!fs.existsSync(contractsDir)) {
  //   fs.mkdirSync(contractsDir, { recursive: true });
  // }

  // fs.writeFileSync(
  //   contractsDir + "/contract-address.json",
  //   JSON.stringify(
  //     {
  //       Appraiser: appraiser.address,
  //       Reviewer: reviewer.address,
  //       VRFv2Consumer: VRFv2Consumer.address,
  //     },
  //     undefined,
  //     2
  //   )
  // );

  // const KeepersManagerArtifact = artifacts.readArtifactSync("KeepersManager");
  // fs.writeFileSync(
  //   contractsDir + "/KeepersManager.json",
  //   JSON.stringify(KeepersManagerArtifact, null, 2)
  // );
}

async function deployKeepersManager(signers: SignerWithAddress[]) {
  const KeepersManager: ContractFactory = await ethers.getContractFactory(
    "KeepersManager"
  );
  const keepersManager: KeepersManager =
    (await KeepersManager.deploy()) as KeepersManager;

  await keepersManager.deployed();

  console.log("KeepersManager deployed to:", keepersManager.address);
  return { keepersManager };
}
async function deployDCAManager(signers: SignerWithAddress[], USDC: String) {
  const DCAManager: ContractFactory = await ethers.getContractFactory(
    "DCAManager"
  );
  const dCAManager: DCAManager = (await DCAManager.deploy(USDC)) as DCAManager;

  await dCAManager.deployed();

  console.log("DCAManager deployed to:", dCAManager.address);
  return { dCAManager };
}
async function deployJobManager(signers: SignerWithAddress[]) {
  const DCAOptions: ContractFactory = await ethers.getContractFactory(
    "DCAOptions"
  );
  const dCAOptions = await DCAOptions.deploy();

  const JobManager: ContractFactory = await ethers.getContractFactory(
    "JobManager",
    {
      libraries: {
        DCAOptions: dCAOptions.address,
      },
    }
  );
  const jobManager: JobManager = (await JobManager.deploy()) as JobManager;

  await jobManager.deployed();

  console.log("JobManager deployed to:", jobManager.address);
  console.log("DCAOptions lib deployed to:", dCAOptions.address);
  return { jobManager, dCAOptions };
}
async function deployTradeManager(signers: SignerWithAddress[]) {
  const TradeManager: ContractFactory = await ethers.getContractFactory(
    "TradeManager"
  );
  const tradeManager: TradeManager =
    (await TradeManager.deploy()) as TradeManager;

  await tradeManager.deployed();

  console.log("TradeManager deployed to:", tradeManager.address);
  return { tradeManager };
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

  const DEXManager: ContractFactory = await ethers.getContractFactory(
    "DEXManager"
  );
  const dEXManager: DEXManager = (await DEXManager.deploy(
    mockISwapRouter.address,
    mockUsdc,
    mockWeth
  )) as DEXManager;

  await dEXManager.deployed();

  console.log("SwapRouter deployed to:", mockISwapRouter.address);

  return { dEXManager };
}

async function deployLendingManager(signers: SignerWithAddress[]) {
  const mockILendingPool = await deployMockILendingPool(signers[0]);
  const mockILendingPoolAddressesProvider =
    await deployMockILendingPoolAddressesProvider(signers[0]);
  await mockILendingPoolAddressesProvider.mock.getLendingPool.returns(
    mockILendingPool.address
  );

  const LendingManager: ContractFactory = await ethers.getContractFactory(
    "LendingManager"
  );
  const lendingManager: LendingManager = (await LendingManager.deploy(
    mockILendingPoolAddressesProvider.address
  )) as LendingManager;

  await lendingManager.deployed();

  console.log("LendingManager deployed to:", lendingManager.address);
  return {
    lendingManager,
    mockILendingPool,
    mockILendingPoolAddressesProvider,
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
