import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle } from "hardhat";
// import { Artifact } from "hardhat/types";
console.log(__dirname);
import ERC_20_ABI from "../../abis/erc20.abi.json";
import JobManager_ABI from "../../artifacts/contracts/JobManager.sol/JobManager.json";
import DEXManager_ABI from "../../artifacts/contracts/DEXManager.sol/DEXManager.json";
import LendingManager_ABI from "../../artifacts/contracts/LendingManager.sol/LendingManager.json";
import TradeManager_ABI from "../../artifacts/contracts/TradeManager.sol/TradeManager.json";

export async function deployMockUsdc(deployer: Signer): Promise<MockContract> {
  //   const erc20Artifact: Artifact = await artifacts.readArtifact("ERC20");
  const erc20: MockContract = await waffle.deployMockContract(
    deployer,
    ERC_20_ABI
  );

  await erc20.mock.decimals.returns(6);
  await erc20.mock.name.returns(`USD Coin`);
  await erc20.mock.symbol.returns(`USDC`);
  await erc20.mock.transferFrom.returns(true);
  await erc20.mock.balanceOf.returns(0);

  return erc20;
}

export const deployMockJobManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const jobManager: MockContract = await waffle.deployMockContract(
    deployer,
    JobManager_ABI.abi
  );
  await jobManager.mock.create.returns(1);
  await jobManager.mock.getActiveJobIds.returns([0, 2]);
  await jobManager.mock.isActiveJobs.returns(true);
  return jobManager;
};

export const deployMockTradeManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const tradeManager: MockContract = await waffle.deployMockContract(
    deployer,
    TradeManager_ABI.abi
  );
  await tradeManager.mock.deposit.returns(true);
  await tradeManager.mock.swap.returns(true);

  return tradeManager;
};

export const deployMockLendingManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const lendingManager: MockContract = await waffle.deployMockContract(
    deployer,
    LendingManager_ABI.abi
  );
  await lendingManager.mock.deposit.returns(true);

  return lendingManager;
};

export const deployMockDEXManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const dEXManager: MockContract = await waffle.deployMockContract(
    deployer,
    DEXManager_ABI.abi
  );

  return dEXManager;
};
