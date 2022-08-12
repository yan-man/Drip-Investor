// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

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

    // Events
    event DCAManager__ContractAddrSet(uint256 id);

    // Modifiers
    constructor() {}

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

        emit DCAManager__ContractAddrSet(id_);
    }

    // Should receive tokens successfully before calling DCAOptions validation / Job Manager
    function deposit(uint _amount) public payable {
        // IERC20(token).transferFrom(msg.sender, address(this), _amount);
    }
}
