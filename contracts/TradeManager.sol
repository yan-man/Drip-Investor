// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./libraries/Jobs.sol";
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
    error TradeManager__InvalidId(uint256 jobId);

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

    modifier isValidJobId(uint256 jobId_) {
        bool _isValidId = _s_JobManager.isValidId(jobId_);
        if (!_isValidId) {
            revert TradeManager__InvalidId(jobId_);
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
        isValidJobId(jobId_)
        returns (bool _result)
    {
        // get job from jobmanager
        // _result = _s_LendingManager.deposit;
        // call aave manager, to deposit
        // set onBehalfOf to user

        (, address owner, , , , uint256 investmentAmount) = _s_JobManager
            .s_jobs(jobId_);

        _result = _s_LendingManager.deposit(owner, investmentAmount);
    }

    function swap(uint256 jobId_)
        public
        isInitialized
        isValidJobId(jobId_)
        returns (bool _result)
    {
        // pull some amount out of aave and swap using uniswap
        // amount of aave is governed by job details - investmentAmount
        // need to check if users balanceOf is > investmentAmount
        // set teh recipient to user's address
        // _result = true;

        // 1) withdraw from aave
        // a) get amt to withdraw
        (, address owner, , , , uint256 investmentAmount) = _s_JobManager
            .s_jobs(jobId_);
        // b) call _s_LendingManager withdraw, to this contract
        _s_LendingManager.withdraw(owner, investmentAmount);

        // 2) swap in Uniswap
        // a) call swap from DEXmanager, need to supply given addersses of tokens swap to and from

        // 3) update deposit/job amt in DCAManager
        // a) call DCAManager
    }
}
