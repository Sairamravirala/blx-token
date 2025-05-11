// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract BLXLiquidityPool is Ownable, ReentrancyGuard {
    IERC20 public immutable tokenA; // BLX
    IERC20 public immutable tokenB; // ETH or stablecoin
    IERC20 public immutable lpToken;
    
    uint256 public totalLiquidity;
    uint256 public constant FEE = 30; // 0.3% fee
    AggregatorV3Interface internal priceFeed;

    event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    constructor(
        address _tokenA,
        address _tokenB,
        address _lpToken,
        address _priceFeed
    ) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        lpToken = IERC20(_lpToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external non