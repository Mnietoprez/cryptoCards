pragma solidity ^0.8.0;

contract CardToken {
    //premium token used to open packs
    
    using SafeMath for uint256;
    
    address public god;
    string public constant name = "cardcoins";
    string public constant symbol = "CRD";
    uint8 public constant decimals = 10;

    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    uint256 private totalSupply_ = 100000000*10**uint256(decimals);

    constructor() {
        god = msg.sender;
        balances[msg.sender] = totalSupply_;
    }

    modifier onlyGod() {
        //checks that the function is called by the creator of the contract
        require(msg.sender == god);
        _;
    }

    function changeGod(address _newGod) public onlyGod(){
        god = _newGod;
    }

    address cardContractAddress;

    function setContract(address _contractAddress) public onlyGod(){
        //sets the address of the main card contract in order to give it permissions over token management
        cardContractAddress = _contractAddress;
    }

    
    modifier onlyContract() {
        //checks that the function is called by the contract
        require(msg.sender == cardContractAddress);
        _;
    }
    

    function generate(uint _amount, address _to) external onlyContract() {
        //only the contract can call this function and give tokens to the chosen address
        balances[_to]=balances[_to] + _amount;
    }


    function burn(uint _amount, address _to) external onlyContract {
        require (msg.sender == cardContractAddress);
        //only the contract can call this function and burn tokens from the chosen address
        balances[_to]=balances[_to] - _amount;
    }


    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }


    function balanceOf(address tokenOwner) public view returns (uint256) {
        return balances[tokenOwner];
    }


    function transfer(address receiver, uint256 numTokens) public returns (bool) {

        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;

    }


    function approve(address delegate, uint256 numTokens) public returns (bool) {
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }


    function allowance(address owner, address delegate) public view returns (uint) {
        return allowed[owner][delegate];
    }


    function transferFrom(address owner, address buyer, uint256 numTokens) public returns (bool) {

        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;

    }
}



library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}



