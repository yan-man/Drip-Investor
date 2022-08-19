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

    // deposit into Aave; could be something else
    function deposit() public returns (bool _result) {
        _result = true;
    }

    // when DCA is actually executed, make sure to update deposit
    // function executeSwap
}
