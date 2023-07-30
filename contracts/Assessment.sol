// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    string public name = "Senbonzakura";
    string public symbol = "SBZ";
    address payable public owner;
    uint256 public totalSupply;

    event Mint(uint256 amount);
    event Burn(uint256 amount);

    constructor(uint initTotalSupply) payable {
        owner = payable(msg.sender);
        totalSupply = initTotalSupply;
    }

    function getTokenName() public view returns(string memory){
        return name;
    }

     function getTokenSymbol() public view returns(string memory){
        return symbol;
    }


    function getTotalSupply() public view returns(uint256){
        return totalSupply;
    }

    function mint(uint256 _amount) public payable {
        uint _previousTotalSupply = totalSupply;
        require(msg.sender == owner, "You are not the owner of this account");
        totalSupply += _amount;
        assert(totalSupply == _previousTotalSupply + _amount);
        emit Mint(_amount);
    }

    error InsufficientSupply(uint256 totalSupply, uint256 amount);

    function burn(uint256 _amount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousTotalSupply = totalSupply;
        if (totalSupply < _amount) {
            revert InsufficientSupply({
                totalSupply: totalSupply,
                amount: _amount
            });
        }
        totalSupply -= _amount;
        assert(totalSupply == (_previousTotalSupply - _amount));
        emit Burn(_amount);
    }
}
