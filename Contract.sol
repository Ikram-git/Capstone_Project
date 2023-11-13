pragma solidity ^0.8.0;

//This is the contract for platform on the Ethereum blockchain. 
//The contract allows users to add a receipt to the platform by providing information about the user,
// the price of the products purchased, the products purchased, the quantity of each product, 
//the price of each product, the seller of each product, and the date and time of the purchase.
//The contract also checks that the user has sent enough Ether to cover the cost of the products 
//and sends any excess Ether back to the user. The contract also has a function to retrieve the history 
//of all receipts added to the platform.
contract Ecommerce {
    struct Receipt {
        string user;
        uint256 price;
        string[] products;
        string[] quantity;
        string[] prices;
        string[] seller;
        uint256 date_and_time;
    }

    address public owner;
    Receipt[] public history;

    constructor() {
        owner = msg.sender;
    }

    function addReceipt(
        string memory _user,
        uint256 _price,
        string[] memory _products,
        string[] memory _quantity,
        string[] memory _prices,
        string[] memory _seller
    ) public payable {
        require(msg.value >= _price, "Not enough Ether sent for payment");
        uint256 change = msg.value - _price;
        if (change > 0) {
            payable(msg.sender).transfer(change);
        }
        Receipt memory newReceipt = Receipt({
            user: _user,
            price: _price,
            products: _products,
            quantity: _quantity,
            prices: _prices,
            seller: _seller,
            date_and_time: block.timestamp
        });
        history.push(newReceipt);
    }

    function getHistory() public view returns (Receipt[] memory) {
        return history;
    }
}