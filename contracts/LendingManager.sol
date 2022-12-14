// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "./interfaces/Aave/ILendingPoolAddressesProvider.sol";
import "./interfaces/Aave/ILendingPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingManager {
    // Type declarations
    // State variables
    address public s_depositTokenAddress; //USDC
    ILendingPool public s_lendingPool;
    ILendingPoolAddressesProvider public s_provider; // 0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6 for polygon mumbai
    mapping(address => uint256) public s_deposits; // user addr -> num tokens deposited

    // Events
    event LogDeposit(address onBehalfOf, uint256 depositAmount);
    event LogWithdrawal(address to, uint256 withdrawalAmount);
    event LogSetDepositTokenAddress(address token);

    // Errors
    error LendingManager__NotInitialized();

    modifier isInitialized() {
        if (
            s_depositTokenAddress == address(0) ||
            address(s_lendingPool) == address(0) ||
            address(s_provider) == address(0)
        ) {
            revert LendingManager__NotInitialized();
        }
        _;
    }

    constructor(address LendingPoolAddressesProviderAddr_) {
        // Retrieve LendingPool address
        s_provider = ILendingPoolAddressesProvider(
            LendingPoolAddressesProviderAddr_
        );
        s_lendingPool = ILendingPool(s_provider.getLendingPool());
    }

    function setDepositToken(address addr_) external {
        s_depositTokenAddress = addr_;

        emit LogSetDepositTokenAddress(addr_);
    }

    // when DCA is actually executed, make sure to update deposit
    function deposit(address onBehalfOf_, uint256 depositAmount_)
        public
        isInitialized
        returns (bool _result)
    {
        s_lendingPool.deposit(
            s_depositTokenAddress,
            depositAmount_ * 1e18,
            onBehalfOf_,
            0 // referral code
        );
        _result = true;

        emit LogDeposit(onBehalfOf_, depositAmount_);
    }

    function withdraw(address to_, uint256 withdrawalAmount_)
        public
        isInitialized
        returns (bool _result)
    {
        uint256 _amount = withdrawalAmount_ * 1e18;

        uint256 _withdrawnAmount = s_lendingPool.withdraw(
            s_depositTokenAddress,
            _amount,
            to_ // maybe send straight to DEXManager
        );
        if (_withdrawnAmount > 0) {
            _result = true;
        }
        emit LogWithdrawal(to_, _withdrawnAmount);
    }
}
