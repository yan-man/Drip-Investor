import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle } from "hardhat";
// import { Artifact } from "hardhat/types";
import ERC_20_ABI from "../../abis/erc20.abi.json";
import JobManager_ABI from "../../artifacts/contracts/JobManager.sol/JobManager.json";

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
