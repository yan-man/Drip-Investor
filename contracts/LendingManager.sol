// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./interfaces/Aave/ILendingPoolAddressesProvider.sol";
import "./interfaces/Aave/ILendingPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// connect to aave, execute txs for lending
// caller: TradeManager
contract LendingManager {
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
    // when DCA is actually executed, make sure to update deposit
    function executeDeposit() public {
        // Retrieve LendingPool address
        ILendingPoolAddressesProvider provider = ILendingPoolAddressesProvider(
            address(0x88757f2f99175387aB4C6a4b3067c77A695b0349)
        );
        ILendingPool lendingPool = ILendingPool(provider.getLendingPool());

        // Input variables
        // address daiAddress = address(
        //     0x6B175474E89094C44Da98b954EedeAC495271d0F
        // ); // mainnet DAI -> should be USDC
        // uint256 amount = 1000 * 1e18;
        // uint16 referral = 0;

        // // Approve LendingPool contract to move your DAI
        // IERC20(daiAddress).approve(provider.getLendingPoolCore(), amount);

        // // Deposit 1000 DAI
        // lendingPool.deposit(daiAddress, amount, referral);
    }
}
