pragma solidity ^0.8.0;

import "./cardmanager.sol";
//import "./safemath.sol";

interface IERC721{

  event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
  event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
  function balanceOf(address _owner) external view returns (uint256 _balance);
  function ownerOf(uint256 _tokenId) external view returns (address _owner);
  function transfer(address _to, uint256 _tokenId) external;
  function approve(address _to, uint256 _tokenId) external;
  function takeOwnership(uint256 _tokenId) external;

}

contract CardNFT is CardManager, IERC721{

    using SafeMath for uint256;

    
    mapping (uint => address) cardApprovals;

    function balanceOf (address _owner) public view returns (uint256 _balance) {
       return cardCounter[_owner];
    }  

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
       return cardToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        cardCounter[_to] = cardCounter[_to].add(1);
        cardCounter[_from] = cardCounter[_from].sub(1);
        cardToOwner[_tokenId] = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwner(_tokenId) { 
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwner(_tokenId) {
        cardApprovals[_tokenId] = _to;
        emit Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(cardApprovals[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }

}