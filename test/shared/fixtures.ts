import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import {
  DCAManager,
  JobManager,
  TradeManager,
  KeepersManager,
} from "../../typechain-types";
import {
  deployMockUsdc,
  deployMockJobManager,
  deployMockAaveManager,
  deployMockTradeManager,
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
};

type UnitKeepersManagerFixtureType = {
  keepersManager: KeepersManager;
  mockJobManager: MockContract;
  mockTradeManager: MockContract;
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
  const TradeManagerFactory: ContractFactory = await ethers.getContractFactory(
    `TradeManager`
  );
  const tradeManager: TradeManager = (await TradeManagerFactory.connect(
    deployer
  ).deploy()) as TradeManager;

  await tradeManager.deployed();

  return { tradeManager };
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
