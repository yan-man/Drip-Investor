import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { DCAManager, JobManager } from "../../typechain-types";
import {
  deployMockUsdc,
  deployMockJobManager,
  deployMockAaveManager,
  deployMockTradeManager,
} from "./mocks";

type UnitDCAManagerFixtureType = {
  dCAManager: DCAManager;
  mockUsdc: MockContract;
};

type UnitJobManagerFixtureType = {
  jobManager: JobManager;
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
