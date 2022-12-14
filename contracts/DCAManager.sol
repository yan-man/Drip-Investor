// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./JobManager.sol";
import "./TradeManager.sol";

// should own the tokens, and delegate access to necessary parties
contract DCAManager is Ownable {
    // Type declarations
    enum CoreContractId {
        JOB_MANAGER, // 0
        KEEPERS_MANAGER, // 1
        TRADE_MANAGER, // 2
        DEX_MANAGER, // 3
        LENDING_MANAGER // 4
    }

    // State variables
    mapping(CoreContractId => address) public s_contractsLookup;
    // mapping(address => uint256) public s_deposits; // user address -> num tokens deposited
    mapping(address => mapping(uint256 => uint256)) public s_userJobs; // user address -> (job id -> num tokens deposited); should probs be userFunds
    bool public s_isInitialized;
    address public s_tokenAddr; // should be USDC addr
    JobManager private _s_jm;
    TradeManager private _s_tm;

    // Events
    event LogContractAddrSet(uint256 id);
    event LogCreateJob(address addr, uint256 amount);
    event LogCancelJob(uint256 jobId);
    event LogDepositReduced(uint256 jobId, uint256 amount);

    // Errors
    error DCAManager__CoreContractNotInitialized();
    error DCAManager__InsufficientFunds();
    error DCAManager__TransferError();
    error DCAManager__InvalidJobId(uint256 jobId);
    error DCAManager__InvalidJobCreator(address addr);
    error DCAManager__JobManager__Cancel();
    error DCAManager__InvalidInvestment();
    error DCAManager__TradeManager__DepositError();

    // Modifiers
    modifier isInitialized() {
        if (!s_isInitialized) {
            revert DCAManager__CoreContractNotInitialized();
        }
        _;
    }
    modifier hasFunds(uint256 amount_) {
        if (IERC20(s_tokenAddr).balanceOf(msg.sender) < amount_) {
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
    modifier validateInputs(uint256 amount_, uint256 investmentAmount_) {
        // console.log("here validateInputs");
        if (amount_ < investmentAmount_) {
            revert DCAManager__InvalidInvestment();
        }
        _;
    }

    constructor(address tokenAddr_) {
        s_tokenAddr = tokenAddr_;
    }

    function setContractAddress(uint256 id_, address addr_) external onlyOwner {
        require(addr_ != address(0), "Zero addr");
        s_contractsLookup[CoreContractId(id_)] = addr_;
        if (id_ == uint(CoreContractId.JOB_MANAGER)) {
            _s_jm = JobManager(addr_);
        } else if (id_ == uint(CoreContractId.TRADE_MANAGER)) {
            _s_tm = TradeManager(addr_);
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
        uint256 _numContracts = uint(CoreContractId.LENDING_MANAGER);
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

    /**
     * @param amount_ amount of token that is
     * @param options_ options flag array. See DCAOptions library
     * should return nothing, will be a tx
     */
    function createDCAJob(
        uint256 amount_,
        uint256 investmentAmount_,
        uint256[] calldata options_
    )
        external
        validateInputs(amount_, investmentAmount_)
        isInitialized
        hasFunds(amount_)
    {
        bool _result = IERC20(s_tokenAddr).transferFrom(
            msg.sender,
            address(this),
            amount_
        );
        if (!_result) {
            revert DCAManager__TransferError();
        }
        _result = _s_tm.deposit(msg.sender, amount_);
        if (!_result) {
            revert DCAManager__TradeManager__DepositError();
        }
        uint256 _jobId = _s_jm.create(msg.sender, investmentAmount_, options_); // create DCA job

        s_userJobs[msg.sender][_jobId] = amount_;

        // Approve LendingPool contract to move your DAI
        // IERC20(s_depositTokenAddress).approve(address(s_lendingPool), _amount);

        // TODO: give approvals for total amount
        // - to Aave lending: IERC20(daiAddress).approve(provider.getLendingPoolCore(), amount_);
        // - to TradeManager
        // - to LendingManager
        // - to DEXManager

        emit LogCreateJob(msg.sender, amount_);
    }

    function cancelJob(uint256 jobId_)
        external
        isValidJobId(jobId_)
        returns (bool _result)
    {
        if (s_userJobs[msg.sender][jobId_] == 0) {
            revert DCAManager__InvalidJobCreator(msg.sender);
        }
        uint256 _amount = s_userJobs[msg.sender][jobId_];
        s_userJobs[msg.sender][jobId_] = 0;
        _result = _s_jm.cancel(jobId_);
        if (!_result) {
            revert DCAManager__JobManager__Cancel();
        }
        _result = IERC20(s_tokenAddr).transferFrom(
            address(this),
            msg.sender,
            _amount
        );
        emit LogCancelJob(jobId_);
    }

    // after DCA is done, reduce the deposit amt owed to user
    function reduceDeposit(
        uint256 jobId_,
        address investor_,
        uint256 amount_
    ) external returns (bool _result) {
        s_userJobs[investor_][jobId_] -= amount_;
        _result = true;
        emit LogDepositReduced(jobId_, amount_);
    }
}
