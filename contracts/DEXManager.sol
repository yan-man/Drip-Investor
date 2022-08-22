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
    // address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    // address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    // address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address public immutable s_tokenIn;
    address public immutable s_tokenOut;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    // Events
    event LogSwap(uint256 tokenInAmount, uint256 tokenOutAmount);

    // Errors

    // Modifiers

    constructor(
        ISwapRouter _swapRouter,
        address tokenIn_,
        address tokenOut_
    ) {
        s_swapRouter = _swapRouter;
        s_tokenIn = tokenIn_;
        s_tokenOut = tokenOut_;
    }

    // constructor
    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure
    // Public functions
    // Internal functions
    // Private functions

    function swap(address recipient_, uint256 amountIn_)
        external
        returns (uint256 _amountOut)
    {
        // msg.sender must approve this contract
        address _tokenIn = s_tokenIn;
        address _tokenOut = s_tokenOut;

        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(
            _tokenIn,
            msg.sender,
            address(this),
            amountIn_
        );

        // Approve the router to spend DAI.
        // TransferHelper.safeApprove(_tokenIn, address(s_swapRouter), amountIn_);

        // exact input swap
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: recipient_,
                deadline: block.timestamp,
                amountIn: amountIn_,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        _amountOut = s_swapRouter.exactInputSingle(params);

        emit LogSwap(amountIn_, _amountOut);
    }
}
