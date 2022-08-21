// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./AaveManager.sol";

// manage txs for DCA:
// deposit into aave for lending fees
// trade on uniswap DEX for actual DCA
// after swapping, transfer eth funds to user

// calls:
// uniswapManager
// aave manager

// caller:
// KeepersManager
contract TradeManager {
    // Type declarations
    // State variables
    // Events
    // Modifiers
    // constructor
    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure
    // Public functions
    // Internal functions
    // Private functions

    // deposit into Aave
    function deposit() public returns (bool _result) {
        _result = true;
        // call aave manager, to deposit
        // set onBehalfOf to user
    }

    function swap(uint256 jobId) public returns (bool _result) {
        // pull some amount out of aave and swap using uniswap
        // amount of aave is governed by job details - investmentAmount
        // need to check if users balanceOf is > investmentAmount
        // set teh recipient to user's address
        _result = true;
    }

    // when DCA is actually executed, make sure to update deposit
    // function executeSwap
}
