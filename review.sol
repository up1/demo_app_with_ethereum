pragma solidity ^0.4.0;

contract ReviewContract2 {

    address creator;

    event notify(address user, uint reviewScore);

    mapping(address => uint) public allUsers;

    function ReviewContract() {
        creator = msg.sender;
    }

    function newReview(address user, uint score) {
        allUsers[user] += score;
        notify(user, score);
    }

    function getReviewByUser(address user) returns(uint) {
        return allUsers[user];
    }

}
