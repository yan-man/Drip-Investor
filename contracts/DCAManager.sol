// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DCAManager is Ownable {
    constructor() {}

    // Should receive tokens successfully before calling DCAOptions validation / Job Manager
    function deposit(uint _amount) public payable {
        // IERC20(token).transferFrom(msg.sender, address(this), _amount);
    }
}
