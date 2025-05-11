// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract BLXVault is AccessControl, ReentrancyGuard {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    uint256 public constant APY = 10; // 10% APY
    uint256 public constant YEAR = 365 days;
    
    IERC20 public immutable blxToken;
    uint256 public totalDeposits;
    
    struct Deposit {
        uint256 amount;
        uint256 timestamp;
    }
    
    mapping(address => Deposit) public deposits;
    
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);

    constructor(address _blxToken) {
        blxToken = IERC20(_blxToken);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, msg.sender);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be positive");
        
        // Calculate pending rewards if existing deposit
        if (deposits[msg.sender].amount > 0) {
            uint256 pending = calculateRewards(msg.sender);
            deposits[msg.sender].amount += pending;
        }
        
        blxToken.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender].amount += amount;
        deposits[msg.sender].timestamp = block.timestamp;
        totalDeposits += amount;
        
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount <= deposits[msg.sender].amount, "Insufficient balance");
        
        uint256 reward = calculateRewards(msg.sender);
        uint256 total = amount + reward;
        
        deposits[msg.sender].amount -= amount;
        deposits[msg.sender].timestamp = block.timestamp;
        totalDeposits -= amount;
        
        blxToken.transfer(msg.sender, total);
        emit Withdrawn(msg.sender, amount, reward);
    }

    function calculateRewards(address user) public view returns (uint256) {
        Deposit memory dep = deposits[user];
        if (dep.amount == 0) return 0;
        
        uint256 duration = block.timestamp - dep.timestamp;
        return (dep.amount * APY * duration) / (YEAR * 100);
    }
}