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
    DCAManager private _s_DCAManager;

    // Events
    event LogContractsSet(
        address lenderAddr,
        address DEXAddr,
        address jobManagerAddr,
        address DCAManagerAddr
    );
    event LogExecuteJob(uint256 jobId);
    event LogDeposit(address investor, uint256 investmentAmount);

    error TradeManager__NotInitialized();
    error TradeManager__InvalidId(uint256 jobId);
    error TradeManager__InsufficientFunds(
        address investor,
        uint256 investmentAmount
    );

    // Modifiers
    modifier isInitialized() {
        if (
            address(_s_LendingManager) == address(0) ||
            address(_s_DEXManager) == address(0) ||
            address(_s_JobManager) == address(0) ||
            address(_s_DCAManager) == address(0)
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

    function _hasFunds(
        address investor_,
        uint256 jobId_,
        uint256 investmentAmount_
    ) private view {
        if (_s_DCAManager.s_userJobs(investor_, jobId_) < investmentAmount_) {
            revert TradeManager__InsufficientFunds(
                investor_,
                investmentAmount_
            );
        }
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
        address jobManagerAddr_,
        address DCAManagerAddr_
    ) public {
        _s_DEXManager = DEXManager(DEXAddr_);
        _s_LendingManager = LendingManager(lenderAddr_);
        _s_JobManager = JobManager(jobManagerAddr_);
        _s_DCAManager = DCAManager(DCAManagerAddr_);

        emit LogContractsSet(
            DEXAddr_,
            lenderAddr_,
            jobManagerAddr_,
            DCAManagerAddr_
        );
    }

    // deposit into Aave
    function deposit(address investorAddr_, uint256 depositAmount_)
        public
        isInitialized
        returns (bool _result)
    {
        _result = _s_LendingManager.deposit(investorAddr_, depositAmount_);
        emit LogDeposit(investorAddr_, depositAmount_);
    }

    // withdraw from aave
    // swap via uniswap
    function executeJob(uint256 jobId_)
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

        _hasFunds(owner, jobId_, investmentAmount);

        // b) call _s_LendingManager withdraw, to this contract
        _s_LendingManager.withdraw(address(this), investmentAmount);

        // 2) swap in Uniswap
        // a) call swap from DEXmanager, need to supply given addersses of tokens swap to and from
        uint256 _amountSwapped = _s_DEXManager.swap(owner, investmentAmount);
        if (_amountSwapped > 0) {
            _result = true;
        }

        // 3) update deposit/job amt in DCAManager
        // a) call DCAManager
        _s_DCAManager.reduceDeposit(jobId_, owner, _amountSwapped);

        emit LogExecuteJob(jobId_);
    }
}
