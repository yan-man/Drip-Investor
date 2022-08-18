// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./libraries/DCAOptions.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// called by:
// - KeepersManager

// caller:
// - User
// all other core contracts, to access contract address directory
contract JobManager {
    using Counters for Counters.Counter;

    // Type declarations
    // save DCA jobs, mapping? job id -> Job struct
    struct Job {
        uint256 id;
        address owner;
        uint256 frequencyOptionId;
        bool isActive;
        uint256 startTime;
        uint256 amount;
        // style:
        // address from; // token addr (always USDC)
        // address to; // always wETH
        // always set these by default
    }

    // State variables
    mapping(uint256 => Job) public s_jobs; // jobId -> Job
    Counters.Counter private _jobIds; // 0-indexed

    // Events
    // Modifiers
    // constructor

    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure\
    // Public functions
    // Internal functions
    // Private functions

    // external, only called by DCAManager
    // should save a new job and show active or not
    // return newly saved id
    function create(address owner_, uint256[] calldata options_)
        external
        returns (uint256 _jobId)
    {
        _jobId = _jobIds.current();
        s_jobs[_jobId] = Job({
            id: _jobId,
            owner: owner_,
            frequencyOptionId: options_[0],
            startTime: block.timestamp,
            isActive: true,
            amount: 0
        });
        _jobIds.increment();
    }

    function isValidId(uint256 id_) public view returns (bool _result) {
        if (s_jobs[id_].startTime != 0) {
            _result = true;
        }
    }

    // function cancel (uint256 id)
    // erases Job of given jobId - set inactive
    // return true if so

    // function getJobId
    // just get the next jobId
    // return jobIds.current()
}
