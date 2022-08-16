import { Fixture, MockContract } from "ethereum-waffle";
import { ContractFactory, Wallet } from "ethers";
import { ethers } from "hardhat";
import { DCAManager } from "../../typechain-types";
import { deployMockUsdc } from "./mocks";

type UnitDCAManagerFixtureType = {
  dCAManager: DCAManager;
  mockUsdc: MockContract;
};

export const unitDCAManagerFixture: Fixture<UnitDCAManagerFixtureType> = async (
  signers: Wallet[]
) => {
  const deployer: Wallet = signers[0];

  const mockUsdc = await deployMockUsdc(deployer);
  const DCAOptions: ContractFactory = await ethers.getContractFactory(
    `DCAOptions`
  );
  const dCAOptions = await DCAOptions.deploy();

  // console.log(dCAOptions);
  const DCAManagerFactory: ContractFactory = await ethers.getContractFactory(
    `DCAManager`,
    { libraries: { DCAOptions: dCAOptions.address } }
  );
  // console.log(mockUsdc.address);

  const dCAManager: DCAManager = (await DCAManagerFactory.connect(
    deployer
  ).deploy(mockUsdc.address)) as DCAManager;

  await dCAManager.deployed();

  return { dCAManager, mockUsdc };
};
