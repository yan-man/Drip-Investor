// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./DEXManager.sol";
import "./LendingManager.sol";
import "./JobManager.sol";

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
    LendingManager private _s_LendingManager;
    DEXManager private _s_DEXManager;
    JobManager private _s_JobManager;

    // Events
    event LogContractsSet(
        address lenderAddr,
        address DEXAddr,
        address jobManagerAddr
    );

    error TradeManager__NotInitialized();

    // Modifiers
    modifier isInitialized() {
        if (
            address(_s_LendingManager) == address(0) ||
            address(_s_DEXManager) == address(0) ||
            address(_s_JobManager) == address(0)
        ) {
            revert TradeManager__NotInitialized();
        }
        _;
    }

    // constructor
    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure
    // Public functions
    // Internal functions
    // Private functions

    // set uniswap address
    function setTradingContractAddresses(
        address lenderAddr_,
        address DEXAddr_,
        address jobManagerAddr_
    ) public {
        _s_DEXManager = DEXManager(DEXAddr_);
        _s_LendingManager = LendingManager(lenderAddr_);
        _s_JobManager = JobManager(jobManagerAddr_);

        emit LogContractsSet(DEXAddr_, lenderAddr_, jobManagerAddr_);
    }

    // deposit into Aave
    function deposit(uint256 jobId_)
        public
        isInitialized
        returns (bool _result)
    {
        _result = true;
        // call aave manager, to deposit
        // set onBehalfOf to user
    }

    function swap(uint256 jobId_) public isInitialized returns (bool _result) {
        // pull some amount out of aave and swap using uniswap
        // amount of aave is governed by job details - investmentAmount
        // need to check if users balanceOf is > investmentAmount
        // set teh recipient to user's address
        _result = true;
    }

    // when DCA is actually executed, make sure to update deposit
    // function executeSwap
}
