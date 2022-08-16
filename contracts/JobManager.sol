// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./libraries/DCAOptions.sol";

// called by:
// - KeepersManager

// caller:
// - User
// all other core contracts, to access contract address directory
contract JobManager {
    // Type declarations
    // save DCA jobs, mapping? job id -> Job struct
    struct Job {
        address owner;
        uint256 frequencyOptionId;
        // style:
        // address from; // token addr (always USDC)
        // address to; // always wETH
        // always set these by default
    }

    // State variables
    Job[] public s_jobs;

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

    function create() external returns (uint256 _jobId) {}
}
