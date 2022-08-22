// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
pragma abicoder v2;

// Import this file to use console.log
import "hardhat/console.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "./libraries/TransferHelper.sol";

contract DEXManager {
    // Type declarations
    // State variables
    ISwapRouter public immutable s_swapRouter;
    address public immutable s_tokenIn;
    address public immutable s_tokenOut;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    // Events
    event LogSwap(uint256 tokenInAmount, uint256 tokenOutAmount);

    constructor(
        ISwapRouter _swapRouter,
        address tokenIn_,
        address tokenOut_
    ) {
        s_swapRouter = _swapRouter;
        s_tokenIn = tokenIn_;
        s_tokenOut = tokenOut_;
    }

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
        TransferHelper.safeApprove(_tokenIn, address(s_swapRouter), amountIn_);

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
