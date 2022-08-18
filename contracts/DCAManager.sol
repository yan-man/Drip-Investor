// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// import "./libraries/DCAOptions.sol";
import "./JobManager.sol";

contract DCAManager is Ownable {
    // Type declarations
    enum CoreContractId {
        JOB_MANAGER, // 0
        KEEPERS_MANAGER, // 1
        TRADE_MANAGER, // 2
        UNISWAP_MANAGER, // 3
        AAVE_MANAGER // 4
    }
    struct UserJobs {
        // uint256[] jobIds;
        mapping(uint256 => bool) job; // job id => exists?
    }

    // State variables
    mapping(CoreContractId => address) public s_contractsLookup;
    mapping(address => uint256) public s_deposits; // user address -> num tokens deposited
    mapping(address => UserJobs) internal s_userJobs; // user address -> num tokens deposited
    bool public s_isInitialized;
    address public s_tokenAddr; // should be USDC addr
    JobManager private _s_jm;

    // Events
    event LogContractAddrSet(uint256 id);
    event LogCreateJob(address addr, uint256 amount);

    // Errors
    error DCAManager__CoreContractNotInitialized();
    error DCAManager__InsufficientFunds();
    error DCAManager__TransferError();
    error DCAManager__InvalidJobId(uint256 jobId);
    error DCAManager__InvalidJobCreator(address addr);

    // Modifiers
    modifier isInitialized() {
        if (!s_isInitialized) {
            revert DCAManager__CoreContractNotInitialized();
        }
        _;
    }
    modifier hasFunds() {
        if (IERC20(s_tokenAddr).balanceOf(msg.sender) == 0) {
            revert DCAManager__InsufficientFunds();
        }
        _;
    }
    modifier isValidJobId(uint256 jobId_) {
        if (!_s_jm.isValidId(jobId_)) {
            revert DCAManager__InvalidJobId(jobId_);
        }
        _;
    }

    constructor(address tokenAddr_) {
        s_tokenAddr = tokenAddr_;
    }

    // Functions: view then pure
    // External functions
    // External functions that are view
    // External functions that are pure
    // Public functions
    // Internal functions
    // Private functions

    function setContractAddress(uint256 id_, address addr_) external onlyOwner {
        require(addr_ != address(0), "Zero addr");
        s_contractsLookup[CoreContractId(id_)] = addr_;
        if (id_ == uint(CoreContractId.JOB_MANAGER)) {
            _s_jm = JobManager(addr_);
        }
        bool _isInitialized = _checkContractInitializationStatus();
        if (_isInitialized) {
            s_isInitialized = _isInitialized;
        }
        emit LogContractAddrSet(id_);
    }

    function _checkContractInitializationStatus()
        private
        returns (bool _isInitialized)
    {
        uint256 _numContracts = uint(CoreContractId.AAVE_MANAGER);
        uint256 _count = 0;
        for (uint256 i = 0; i < _numContracts; i++) {
            if (s_contractsLookup[CoreContractId(i)] != address(0)) {
                _count++;
            } else {
                break;
            }
        }
        if (_count == _numContracts) {
            _isInitialized = true;
        }
    }

    // // Should receive tokens successfully before calling DCAOptions validation / Job Manager
    // function deposit(uint _amount) public payable {
    //     // IERC20(token).transferFrom(msg.sender, address(this), _amount);
    // }

    /**
     * @param amount_ amount of token that is
     * @param options_ options flag array. See DCAOptions library
     * should return nothing, will be a tx
     */
    function createDCAJob(uint256 amount_, uint256[] calldata options_)
        external
        isInitialized
        hasFunds
    {
        bool _result = IERC20(s_tokenAddr).transferFrom(
            msg.sender,
            address(this),
            amount_
        );
        if (!_result) {
            revert DCAManager__TransferError();
        }
        // add user token amount to existing deposit
        uint256 _deposit = s_deposits[msg.sender];
        s_deposits[msg.sender] = _deposit + amount_;
        uint256 _jobId = _s_jm.create(msg.sender, options_); // create DCA job
        s_userJobs[msg.sender].job[_jobId] = true;

        emit LogCreateJob(msg.sender, amount_);
    }

    function getUserJobIds(address addr_, uint256 id_)
        external
        view
        returns (bool)
    {
        return s_userJobs[addr_].job[id_];
    }

    function cancelJob(uint256 jobId_)
        external
        isValidJobId(jobId_)
        returns (bool)
    {
        if (!s_userJobs[msg.sender].job[jobId_]) {
            revert DCAManager__InvalidJobCreator(msg.sender);
        }
        // cancels DCA job, returns funds to user
        // _s_jm.cancel();
    }

    // function cancelAllJobs() returns (boolean)
}
