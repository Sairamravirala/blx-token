// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BLXStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;
    
    uint256 public rewardRate = 10; // 10% APR
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    
    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
    }
    
    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _stakingToken, address _rewardsToken) {
        stakingToken = IERC20(_stakingToken);
        rewardsToken = IERC20(_rewardsToken);
        lastUpdateTime = block.timestamp;
    }

    function stake(uint256 amount) external nonReentrant {
        updateReward(msg.sender);
        
        if (amount > 0) {
            stakingToken.safeTransferFrom(msg.sender, address(this), amount);
            stakes[msg.sender].amount += amount;
        }
        
        stakes[msg.sender].rewardDebt = stakes[msg.sender].amount * rewardPerTokenStored / 1e18;
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        updateReward(msg.sender);
        require(amount <= stakes[msg.sender].amount, "Insufficient stake");
        
        if (amount > 0) {
            stakes[msg.sender].amount -= amount;
            stakingToken.safeTransfer(msg.sender, amount);
        }
        
        stakes[msg.sender].rewardDebt = stakes[msg.sender].amount * rewardPerTokenStored / 1e18;
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() external nonReentrant {
        updateReward(msg.sender);
        uint256 reward = stakes[msg.sender].amount * rewardPerTokenStored / 1e18 - stakes[msg.sender].rewardDebt;
        if (reward > 0) {
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function updateReward(address account) internal {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;
        if (account != address(0)) {
            stakes[account].rewardDebt = stakes[account].amount * rewardPerTokenStored / 1e18;
        }
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalStaked() == 0) return rewardPerTokenStored;
        return rewardPerTokenStored + 
            ((block.timestamp - lastUpdateTime) * rewardRate * 1e18) / (365 days);
    }

    function totalStaked() public view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }
}

contract BLXLiquidStaking is BLXStaking {
    IERC20 public immutable derivativeToken;
    
    constructor(
        address _stakingToken,
        address _rewardsToken,
        address _derivativeToken
    ) BLXStaking(_stakingToken, _rewardsToken) {
        derivativeToken = IERC20(_derivativeToken);
    }

    function stake(uint256 amount) public override nonReentrant {
        super.stake(amount);
        derivativeToken.mint(msg.sender, amount);
    }

    function withdraw(uint256 amount) public override nonReentrant {
        derivativeToken.burnFrom(msg.sender, amount);
        super.withdraw(amount);
    }
}