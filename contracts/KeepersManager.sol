// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// manage cnx with chainlink keepers
// act as upkeep contract: "https://keepers.chain.link/"
// validate logic on certain jobs - by calling Job manager?
// execute jobs by calling aave/uniswap managers

// calls:
// - TradeManager

// caller:
// - JobManager
contract KeepersManager {
    // mapping: jobId -> CRON job logic
    function executionLogic() public {
        // validation logic for executing DCA Job
        // check that existing amount is enough to DCA with. Else, set job inactive
    }
}
