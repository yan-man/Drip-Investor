// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

library Jobs {
    struct Job {
        uint256 id;
        address owner;
        uint256 frequencyOptionId;
        bool isActive;
        uint256 startTime;
        uint256 investmentAmount;
        // should have something like initialBalance
    }
}
