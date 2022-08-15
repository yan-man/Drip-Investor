// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DCAManager is Ownable {
    // Type declarations
    enum CoreContractId {
        DCA_OPTIONS, // 0
        JOB_MANAGER, // 1
        KEEPERS_MANAGER, // 2
        TRADE_MANAGER, // 3
        UNISWAP_MANAGER, // 4
        AAVE_MANAGER // 5
    }

    // State variables
    mapping(CoreContractId => address) public s_contractsLookup;
    bool public s_isInitialized;
    address public s_tokenAddr; // should be USDC addr

    // Events
    event DCAManager__ContractAddrSet(uint256 id);

    // Errors
    error CoreContractNotInitialized();

    // Modifiers
    modifier isInitialized() {
        if (!s_isInitialized) {
            revert CoreContractNotInitialized();
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
        emit DCAManager__ContractAddrSet(id_);
    }

    function _checkContractInitializationStatus()
        private
        returns (bool _isInitialized)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < 5; i++) {
            if (s_contractsLookup[CoreContractId(i)] != address(0)) {
                count++;
            } else {
                break;
            }
        }
        if (count == 5) {
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
    function createDCAJob(uint256 _amount) external isInitialized {
        // console.log("createDCAJob");
        bool _result = IERC20(s_tokenAddr).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        console.log(_result);
    }
}
