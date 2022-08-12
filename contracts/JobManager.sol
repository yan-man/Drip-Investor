// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// calls:
// - KeepersManager

// caller:
// - User
// all other core contracts, to access contract address directory
contract JobManager {
    // save DCA jobs, mapping? job id -> Job struct
    struct Job {
        address owner;
        uint256 frequency;
        // style:
        // address from; // token addr (always USDC)
        // address to; // always wETH
        // always set these by default
    }

    
}
