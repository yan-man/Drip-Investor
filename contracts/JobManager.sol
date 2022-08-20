// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./libraries/DCAOptions.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./libraries/DCAOptions.sol";
import "./DCAManager.sol";

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
        uint256 investmentAmount;
        // should have something like initialBalance
    }

    // State variables
    mapping(uint256 => Job) public s_jobs; // jobId -> Job
    Counters.Counter private _jobIds; // 0-indexed
    uint256 public _s_numActiveJobs; // needed to simplify memory array passed from getValidIds
    // DCAManager private _s_dcam;

    // Events
    event LogCreate(address owner, uint256 investmentAmount, uint256[] options);
    event LogCancelJob(uint256 id);

    // Errors
    error JobManager__InvalidOwner();
    error DCAOptions__InvalidOptions();
    error JobManager__InvalidAmount();
    error JobManager__InvalidId(uint256 id);

    // Modifiers
    modifier validateOptions(uint256[] calldata options_) {
        if (!DCAOptions.validate(options_)) {
            revert DCAOptions__InvalidOptions();
        }
        _;
    }
    modifier validateCreate(address owner_, uint256 investmentAmount_) {
        if (owner_ == address(0)) {
            revert JobManager__InvalidOwner();
        }
        if (investmentAmount_ <= 0) {
            revert JobManager__InvalidAmount();
        }
        _;
    }
    modifier validateCancel(uint256 id_) {
        if (!this.isValidId(id_)) {
            revert JobManager__InvalidId(id_);
        }
        _;
    }

    // constructor

    // constructor(address dCAManager_) {
    //     _s_dcam = DCAManager(dCAManager_);
    // }

    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure\
    // Public functions
    // Internal functions
    // Private functions

    function isValidId(uint256 id_) external view returns (bool _result) {
        if (s_jobs[id_].startTime != 0 && s_jobs[id_].isActive) {
            _result = true;
        }
    }

    function getCurrentId() external view returns (uint256) {
        return _jobIds.current();
    }

    function getActiveJobIds()
        external
        view
        returns (uint256[] memory _result)
    {
        uint256 _numActiveJobs = _s_numActiveJobs;
        _result = new uint256[](_numActiveJobs);
        uint256 _resultId;
        uint256 _idx;
        uint256 _maxId = _jobIds.current();
        while (_idx < _maxId && _resultId < _numActiveJobs) {
            Job memory _job = s_jobs[_idx];
            if (_job.startTime != 0 && _job.isActive) {
                _result[_resultId] = _job.id;
                _resultId++;
            }
            _idx++;
        }
    }

    function isActiveJobs() external view returns (bool _isActive) {
        uint256 _idx;
        uint256 _maxId = _jobIds.current();
        while (_idx < _maxId) {
            Job memory _job = s_jobs[_idx];
            if (_job.startTime != 0 && _job.isActive) {
                _isActive = true;
                break;
            }
            _idx++;
        }
    }

    // external, only called by DCAManager
    // should save a new job and show active or not
    // return newly saved id

    function create(
        address owner_,
        uint256 investmentAmount_,
        uint256[] calldata options_
    )
        external
        validateCreate(owner_, investmentAmount_)
        validateOptions(options_)
        returns (uint256 _jobId)
    {
        _jobId = _jobIds.current();
        s_jobs[_jobId] = Job({
            id: _jobId,
            owner: owner_,
            frequencyOptionId: options_[0],
            startTime: block.timestamp,
            isActive: true,
            investmentAmount: investmentAmount_
        });
        _jobIds.increment();
        _s_numActiveJobs++;
        emit LogCreate(owner_, investmentAmount_, options_);
    }

    function cancel(uint256 id_)
        external
        validateCancel(id_)
        returns (bool _result)
    {
        Job storage _job = s_jobs[id_];
        _job.isActive = false;
        _result = true;
        _s_numActiveJobs--;
        emit LogCancelJob(id_);
    }
}
