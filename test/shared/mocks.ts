import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle } from "hardhat";
// import { Artifact } from "hardhat/types";
import ERC_20_ABI from "../../abis/erc20.abi.json";
import JobManager_ABI from "../../artifacts/contracts/JobManager.sol/JobManager.json";
import AaveManager_ABI from "../../artifacts/contracts/AaveManager.sol/AaveManager.json";
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

  return jobManager;
};

export const deployMockAaveManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const aaveManager: MockContract = await waffle.deployMockContract(
    deployer,
    AaveManager_ABI.abi
  );

  return aaveManager;
};

export const deployMockTradeManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const tradeManager: MockContract = await waffle.deployMockContract(
    deployer,
    TradeManager_ABI.abi
  );
  await tradeManager.mock.deposit.returns(true);

  return tradeManager;
};
