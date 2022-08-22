// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./JobManager.sol";
import "./TradeManager.sol";

contract KeepersManager is KeeperCompatibleInterface {
    JobManager private _s_jm;
    TradeManager private _s_tm;

    error KeepersManager__NotInitialized();

    modifier isInitialized() {
        if (address(_s_jm) == address(0) || address(_s_tm) == address(0)) {
            revert KeepersManager__NotInitialized();
        }
        _;
    }

    function checkUpkeep(bytes calldata checkData_)
        external
        view
        override
        isInitialized
        returns (bool upkeepNeeded, bytes memory performData)
    {
        bool _isActiveJobs = _s_jm.isActiveJobs();
        if (_isActiveJobs) {
            upkeepNeeded = true;
        }
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override isInitialized {
        uint256[] memory _activeJobIds = _s_jm.getActiveJobIds();

        if (_activeJobIds.length > 0) {
            for (uint256 i = 0; i < _activeJobIds.length; i++) {
                uint256 _jobId = _activeJobIds[i];
                _s_tm.executeJob(_jobId); // perform each swap
            }
        }
    }

    function setJobManager(address addr_) external {
        _s_jm = JobManager(addr_);
    }

    function setTradeManager(address addr_) external {
        _s_tm = TradeManager(addr_);
    }
}
