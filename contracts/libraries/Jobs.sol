// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

library Jobs {
    struct Job {
        uint256 id;
        address owner;
        uint256 frequencyOptionId;
        bool isActive;
        uint256 startTime;
        uint256 investmentAmount;
    }
}
