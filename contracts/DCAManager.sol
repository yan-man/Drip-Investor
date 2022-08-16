// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./libraries/DCAOptions.sol";

contract DCAManager is Ownable {
    // Type declarations
    enum CoreContractId {
        JOB_MANAGER, // 0
        KEEPERS_MANAGER, // 1
        TRADE_MANAGER, // 2
        UNISWAP_MANAGER, // 3
        AAVE_MANAGER // 4
    }

    // State variables
    mapping(CoreContractId => address) public s_contractsLookup;
    bool public s_isInitialized;
    address public s_tokenAddr; // should be USDC addr

    // Events
    event LogContractAddrSet(uint256 id);

    // Errors
    error DCAManager__CoreContractNotInitialized();
    error DCAManager__InsufficientFunds();
    error DCAManager__TransferError();

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

    // Should receive tokens successfully before calling DCAOptions validation / Job Manager
    function deposit(uint _amount) public payable {
        // IERC20(token).transferFrom(msg.sender, address(this), _amount);
    }

    /**
     * @param _amount amount of token that is
     */
    function createDCAJob(uint256 _amount) external isInitialized hasFunds {
        bool _result = IERC20(s_tokenAddr).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        if (!_result) {
            revert DCAManager__TransferError();
        }
        // deposit for given user
        console.log(_result);

        DCAOptions.helptest();
    }
}
