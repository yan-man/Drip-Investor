// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DCAManager is Ownable {
    enum CoreContractId {
        DCA_OPTIONS, // 0
        JOB_MANAGER, // 1
        KEEPERS_MANAGER, // 2
        TRADE_MANAGER, // 3
        UNISWAP_MANAGER, // 4
        AAVE_MANAGER // 5
    }
    mapping(CoreContractId => address) public s_contractsLookup;

    constructor() {}

    function setContractAddress(uint256 id_, address addr_) external onlyOwner {
        require(addr_ != address(0), "Zero addr");
        s_contractsLookup[CoreContractId(id_)] = addr_;
    }

    // Should receive tokens successfully before calling DCAOptions validation / Job Manager
    function deposit(uint _amount) public payable {
        // IERC20(token).transferFrom(msg.sender, address(this), _amount);
    }
}
