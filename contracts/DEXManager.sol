// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

// Import this file to use console.log
import "hardhat/console.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

// connect to uniswap, execute txs for swaps
// caller: TradeManager
contract DEXManager {
    // Type declarations
    // State variables
    ISwapRouter public immutable s_swapRouter;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public s_tokenIn;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    // Events
    event LogSetTokenIn(address tokenIn);

    // Errors
    // Modifiers

    constructor(ISwapRouter _swapRouter) {
        s_swapRouter = _swapRouter;
    }

    // constructor
    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure
    // Public functions
    // Internal functions
    // Private functions

    function setTokenIn(address tokenIn_) external {
        s_tokenIn = tokenIn_;
        emit LogSetTokenIn(tokenIn_);
    }

    function swap(address recipient_, uint256 amountIn)
        external
        returns (uint256 amountOut)
    {
        // msg.sender must approve this contract

        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(
            DAI,
            msg.sender,
            address(this),
            amountIn
        );

        // Approve the router to spend DAI.
        TransferHelper.safeApprove(DAI, address(s_swapRouter), amountIn);

        // exact input swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: DAI,
                tokenOut: WETH9,
                fee: poolFee,
                recipient: recipient_,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = s_swapRouter.exactInputSingle(params);
    }
}
