//SPDX-License-Identifier: MIT
//(License means open source)

pragma solidity ^0.8.16;

contract VendingMachine {
    address public owner;

    //To keep record how many refresher a particular address has.
    mapping(address => uint256) public refresherCount;

    //To keep record how many donuts a particular address has.
    mapping(address => uint256) public dounutCount;

    //To keep record how many lays a particular address has.
    mapping(address => uint256) public laysCount;

    constructor() {
        owner = msg.sender; //This will store the address of the person of deployed the smart constract

        refresherCount[address(this)] = 55; //Initially number of refresher present in Vending Machine.
        dounutCount[address(this)] = 50; //Initially number of donut present in Vending Machine.
        laysCount[address(this)] = 70; //Initially number of Lays present in Vending Machine.
    }

    function getRefresherStockLeft() public view returns (uint256) {
        return refresherCount[address(this)]; //Will return the amount of refresher left in vending machine.
    }

    function getDonutStockLeft() public view returns (uint256) {
        return dounutCount[address(this)]; //Will return the amount of refresher left in vending machine.
    }

    function getLaysStockLeft() public view returns (uint256) {
        return laysCount[address(this)]; //Will return the amount of refresher left in vending machine.
    }

    // Given functions let the owner restock the vending machine

    function restockRehresher(uint256 refresherPieces) public {
        require(
            msg.sender == owner,
            "Sorry! you are not the owner and only the owner can restock."
        );
        refresherCount[address(this)] += refresherPieces;
    }

    function restockDonut(uint256 donutPieces) public {
        require(
            msg.sender == owner,
            "Sorry! you are not the owner and only the owner can restock."
        );
        dounutCount[address(this)] += donutPieces;
    }

    function restockLays(uint256 laysPieces) public {
        require(
            msg.sender == owner,
            "Sorry! you are not the owner and only the owner can restock."
        );
        laysCount[address(this)] += laysPieces;
    }

    // function for purchasing Refreshers from the vending machine

    function numberOfRefresher(uint256 amountRefresher) public payable {
        //Functions and addresses declared payable can receive ether into the contract.
        require(
            msg.value >= amountRefresher * 0.2 ether,
            "The price you are trying to pay is not enough for the amount of donuts you are trying to buy "
        );

        require(
            refresherCount[address(this)] >= amountRefresher,
            "Sorry! Don't have enough refreshers to fulfill your request."
        );

        refresherCount[address(this)] -= amountRefresher;

        refresherCount[msg.sender] += amountRefresher;
    }

    // function for purchasing Donuts from the vending machine

    function numberOfDonut(uint256 amountDonut) public payable {
        //Functions and addresses declared payable can receive ether into the contract.
        require(
            msg.value >= amountDonut * 0.2 ether,
            "The price you are trying to pay is not enough for the amount of donuts you are trying to buy "
        );

        require(
            dounutCount[address(this)] >= amountDonut,
            "Sorry! Don't have enough donuts to fulfill your request."
        );

        dounutCount[address(this)] -= amountDonut;

        dounutCount[msg.sender] += amountDonut;
    }

    // function for purchasing Purchase Lays from the vending machine

    function numberOfLays(uint256 amountLays) public payable {
        //Functions and addresses declared payable can receive ether into the contract.
        require(
            msg.value >= amountLays * 0.1 ether,
            "The price you are trying to pay is not enough for the amount of Lays packet you are trying to buy "
        );

        require(
            laysCount[address(this)] >= amountLays,
            "Sorry! Don't have enough Lays packet to fulfill your request."
        );

        laysCount[address(this)] -= amountLays;

        laysCount[msg.sender] += amountLays;
    }
}
