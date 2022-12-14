import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import {
  DCAManager,
  JobManager,
  TradeManager,
  KeepersManager,
  LendingManager,
  DEXManager,
} from "../../typechain-types/contracts/";
import {
  deployMockUsdc,
  deployMockJobManager,
  deployMockLendingManager,
  deployMockTradeManager,
  deployMockDEXManager,
  deployMockDCAManager,
  deployMockILendingPoolAddressesProvider,
  deployMockILendingPool,
  deployMockISwapRouter,
  deployMockWeth,
  deployMockTransferHelper,
} from "./mocks";

type UnitDCAManagerFixtureType = {
  dCAManager: DCAManager;
  mockUsdc: MockContract;
  mockJobManager: MockContract;
  mockTradeManager: MockContract;
};

type UnitJobManagerFixtureType = {
  jobManager: JobManager;
};

type UnitTradeManagerFixtureType = {
  tradeManager: TradeManager;
  mockDEXManager: MockContract;
  mockLendingManager: MockContract;
  mockJobManager: MockContract;
  mockDCAManager: MockContract;
};

type UnitKeepersManagerFixtureType = {
  keepersManager: KeepersManager;
  mockJobManager: MockContract;
  mockTradeManager: MockContract;
};

type UnitLendingManagerFixtureType = {
  lendingManager: LendingManager;
  mockILendingPoolAddressesProvider: MockContract;
  mockILendingPool: MockContract;
};

type UnitDEXManagerFixtureType = {
  dEXManager: DEXManager;
  mockISwapRouter: MockContract;
};

export const unitDCAManagerFixture: Fixture<UnitDCAManagerFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];

  const mockUsdc = await deployMockUsdc(deployer);
  const mockJobManager = await deployMockJobManager(deployer);
  const mockTradeManager = await deployMockTradeManager(deployer);
  // const DCAOptions: ContractFactory = await ethers.getContractFactory(
  //   `DCAOptions`
  // );
  // const dCAOptions = await DCAOptions.deploy();
  const DCAManagerFactory: ContractFactory = await ethers.getContractFactory(
    `DCAManager`
    // { libraries: { DCAOptions: dCAOptions.address } }
  );
  const dCAManager: DCAManager = (await DCAManagerFactory.connect(
    deployer
  ).deploy(mockUsdc.address)) as DCAManager;
  await dCAManager.deployed();

  return { dCAManager, mockUsdc, mockJobManager, mockTradeManager };
};

export const unitJobManagerFixture: Fixture<UnitJobManagerFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];

  // const mockUsdc = await deployMockUsdc(deployer);
  // const mockJobManager = await deployMockJobManager(deployer);
  const DCAOptions: ContractFactory = await ethers.getContractFactory(
    `DCAOptions`
  );
  const dCAOptions = await DCAOptions.deploy();
  const JobManagerFactory: ContractFactory = await ethers.getContractFactory(
    `JobManager`,
    { libraries: { DCAOptions: dCAOptions.address } }
  );
  const jobManager: JobManager = (await JobManagerFactory.connect(
    deployer
  ).deploy()) as JobManager;

  await jobManager.deployed();

  return { jobManager };
};

export const unitTradeManagerFixture: Fixture<
  UnitTradeManagerFixtureType
> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];
  const mockJobManager = await deployMockJobManager(deployer);
  const mockLendingManager = await deployMockLendingManager(deployer);
  const mockDEXManager = await deployMockDEXManager(deployer);
  const mockDCAManager = await deployMockDCAManager(deployer);
  const TradeManagerFactory: ContractFactory = await ethers.getContractFactory(
    `TradeManager`
  );
  const tradeManager: TradeManager = (await TradeManagerFactory.connect(
    deployer
  ).deploy()) as TradeManager;

  await tradeManager.deployed();

  return {
    tradeManager,
    mockJobManager,
    mockLendingManager,
    mockDEXManager,
    mockDCAManager,
  };
};

export const unitKeepersManagerFixture: Fixture<
  UnitKeepersManagerFixtureType
> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];

  const mockJobManager = await deployMockJobManager(deployer);
  const mockTradeManager = await deployMockTradeManager(deployer);
  const KeepersManagerFactory: ContractFactory =
    await ethers.getContractFactory(`KeepersManager`);
  const keepersManager: KeepersManager = (await KeepersManagerFactory.connect(
    deployer
  ).deploy()) as KeepersManager;

  await keepersManager.deployed();

  return { keepersManager, mockJobManager, mockTradeManager };
};

export const unitLendingManagerFixture: Fixture<
  UnitLendingManagerFixtureType
> = async (signers: Wallet[]) => {
  const deployer: Wallet = signers[0];
  const mockUsdc = await deployMockUsdc(deployer);
  const mockILendingPoolAddressesProvider =
    await deployMockILendingPoolAddressesProvider(deployer);
  const mockILendingPool = await deployMockILendingPool(deployer);
  await mockILendingPoolAddressesProvider.mock.getLendingPool.returns(
    mockILendingPool.address
  );
  await mockILendingPool.mock.deposit.returns();
  await mockILendingPool.mock.withdraw.returns(0);
  const LendingManagerFactory: ContractFactory =
    await ethers.getContractFactory(`LendingManager`);
  const lendingManager: LendingManager = (await LendingManagerFactory.connect(
    deployer
  ).deploy(mockILendingPoolAddressesProvider.address)) as LendingManager;
  await lendingManager.deployed();

  // await iLendingPoolAddressesProvider.mock.getLendingPool.returns(true);

  return {
    lendingManager,
    mockILendingPoolAddressesProvider,
    mockILendingPool,
    mockUsdc,
  };
};

export const unitDEXManagerFixture: Fixture<UnitDEXManagerFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];
  const mockUsdc = await deployMockUsdc(deployer);
  const mockISwapRouter = await deployMockISwapRouter(deployer);
  const mockWeth = await deployMockWeth(deployer);
  const mockTransferHelper = await deployMockTransferHelper(deployer);
  // const WETH9 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
  const DEXManagerFactory: ContractFactory = await ethers.getContractFactory(
    `DEXManager`
    // { libraries: { TransferHelper: mockTransferHelper.address } }
  );
  const dEXManager: DEXManager = (await DEXManagerFactory.connect(
    deployer
  ).deploy(
    mockISwapRouter.address,
    mockUsdc.address,
    mockWeth.address
  )) as DEXManager;
  await dEXManager.deployed();
  await mockISwapRouter.mock.exactInputSingle.returns(0);
  // await mockUsdc.mock.call.returns(true, ethers.utils.formatBytes32String(""));
  return {
    dEXManager,
    mockISwapRouter,
    mockUsdc,
    mockWeth,
    mockTransferHelper,
  };
};
