// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// provide options data structures for DCA jobs
// provide validation logic for DCA options
library DCAOptions {
    // options:
    // frequency of DCA (monthly, secondly)
    // amount for DCA (% or raw vals)
    // for V1, only allow raw vals

    enum frequencyUnits {
        SECONDS,
        HOURS,
        DAYS,
        WEEKS,
        MONTHS
    }

    function helptest() public view {
        console.log("testme");
    }
}
