import { run, ethers, network, artifacts } from "hardhat";
import { Wallet } from "ethers";
import {
  deployMockLendingManager,
  deployMockILendingPool,
  deployMockILendingPoolAddressesProvider,
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
  const lendingManager = await deployLendingManager(signers);
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
