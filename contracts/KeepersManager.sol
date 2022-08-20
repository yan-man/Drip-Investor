// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./JobManager.sol";

// manage cnx with chainlink keepers
// act as upkeep contract: "https://keepers.chain.link/"
// validate logic on certain jobs - by calling Job manager?
// execute jobs by calling aave/uniswap managers

// calls:
// - JobManager to see which active jobs to execute
// - TradeManager ot actually execute trade

// caller:
// - JobManager
contract KeepersManager is KeeperCompatibleInterface {
    // Type declarations
    // State variables
    // Events
    // Modifiers
    // constructor
    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure
    // Public functions
    // Internal functions
    // Private functions

    address private _s_jmAddr;

    function checkUpkeep(bytes calldata checkData_)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        require(_s_jmAddr != address(0), "JobManager not set");

        JobManager _jm = JobManager(_s_jmAddr);
        bool _isActiveJobs = _jm.isActiveJobs();
        if (_isActiveJobs) {
            upkeepNeeded = true;
        }
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        // if ((block.timestamp - lastTimeStamp) > interval) {
        //     lastTimeStamp = block.timestamp;
        //     counter = counter + 1;
        // }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }

    function setJobManager(address addr_) external {
        _s_jmAddr = addr_;
    }
}
