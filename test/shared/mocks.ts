import { MockContract } from "ethereum-waffle";
import { Signer } from "ethers";
import { waffle, ethers } from "hardhat";
// import { Artifact } from "hardhat/types";
import ERC_20_ABI from "../../abis/erc20.abi.json";
import JobManager_ABI from "../../artifacts/contracts/JobManager.sol/JobManager.json";
import DEXManager_ABI from "../../artifacts/contracts/DEXManager.sol/DEXManager.json";
import LendingManager_ABI from "../../artifacts/contracts/LendingManager.sol/LendingManager.json";
import TradeManager_ABI from "../../artifacts/contracts/TradeManager.sol/TradeManager.json";
import DCAManager_ABI from "../../artifacts/contracts/DCAManager.sol/DCAManager.json";
import ILendingPoolAddressesProvider_ABI from "../../artifacts/contracts/interfaces/Aave/ILendingPoolAddressesProvider.sol/ILendingPoolAddressesProvider.json";
import ILendingPool_ABI from "../../artifacts/contracts/interfaces/Aave/ILendingPool.sol/ILendingPool.json";
import ISwapRouter_ABI from "../../artifacts/@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json";
import TransferHelper_ABI from "../../artifacts/contracts/libraries/TransferHelper.sol/TransferHelper.json";

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

export async function deployMockWeth(deployer: Signer): Promise<MockContract> {
  //   const erc20Artifact: Artifact = await artifacts.readArtifact("ERC20");
  const weth: MockContract = await waffle.deployMockContract(
    deployer,
    ERC_20_ABI
  );

  await weth.mock.decimals.returns(18);
  await weth.mock.name.returns(`Wrapped Ether`);
  await weth.mock.symbol.returns(`WETH`);
  await weth.mock.transferFrom.returns(true);
  await weth.mock.balanceOf.returns(0);

  return weth;
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
  await jobManager.mock.s_jobs.returns(
    ethers.BigNumber.from("0"), // jobId
    jobManager.address, // owner address
    ethers.BigNumber.from("0"), // frequencyOptionId
    true, // isActive
    ethers.BigNumber.from("1661074126"), // startTime
    ethers.BigNumber.from("100") // investmentAmount
  );
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
  await tradeManager.mock.executeJob.returns(true);

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
  await lendingManager.mock.withdraw.returns(true);
  await lendingManager.mock.setDepositToken.returns();

  return lendingManager;
};

export const deployMockDEXManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const dEXManager: MockContract = await waffle.deployMockContract(
    deployer,
    DEXManager_ABI.abi
  );

  await dEXManager.mock.swap.returns(0);
  return dEXManager;
};

export const deployMockDCAManager = async (
  deployer: Signer
): Promise<MockContract> => {
  const dCAManager: MockContract = await waffle.deployMockContract(
    deployer,
    DCAManager_ABI.abi
  );

  await dCAManager.mock.reduceDeposit.returns(true);
  return dCAManager;
};

export const deployMockILendingPoolAddressesProvider = async (
  deployer: Signer
): Promise<MockContract> => {
  const iLendingPoolAddressesProvider: MockContract =
    await waffle.deployMockContract(
      deployer,
      ILendingPoolAddressesProvider_ABI.abi
    );
  return iLendingPoolAddressesProvider;
};

export const deployMockILendingPool = async (
  deployer: Signer
): Promise<MockContract> => {
  const iLendingPool: MockContract = await waffle.deployMockContract(
    deployer,
    ILendingPool_ABI.abi
  );
  await iLendingPool.mock.withdraw.returns(0);
  return iLendingPool;
};

export const deployMockISwapRouter = async (
  deployer: Signer
): Promise<MockContract> => {
  const iSwapRouter: MockContract = await waffle.deployMockContract(
    deployer,
    ISwapRouter_ABI.abi
  );
  await iSwapRouter.mock.exactInputSingle.returns(0);
  return iSwapRouter;
};

export const deployMockTransferHelper = async (
  deployer: Signer
): Promise<MockContract> => {
  const transferHelper: MockContract = await waffle.deployMockContract(
    deployer,
    TransferHelper_ABI.abi
  );
  return transferHelper;
};
