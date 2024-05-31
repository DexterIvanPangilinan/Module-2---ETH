// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Assessment {
    mapping(address => uint256) private balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function deposit(uint256 amount) public {
        require(amount > 0, "Deposit amount must be greater than zero");
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) public {
        require(amount <= balances[msg.sender], "Insufficient balance");
        require(amount > 0, "Withdraw amount must be greater than zero");
        balances[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount);
    }

    function withdrawAll() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");
        balances[msg.sender] = 0;
        emit Withdraw(msg.sender, amount);
    }

    function randomizeTokens(uint256 amount) public {
        require(amount > 0, "Token amount must be greater than zero");
        balances[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function randomizeCar(uint256 carCost) public {
        require(carCost <= balances[msg.sender], "Insufficient balance for car");
        balances[msg.sender] -= carCost;
        emit Withdraw(msg.sender, carCost);
    }
}
