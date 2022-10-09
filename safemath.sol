pragma solidity ^0.8.0;

//Math operations with safety checks that throw on error

library SafeMath {
  
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        //Multiplies two numbers, throws on overflow.
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }
 
    function div(uint256 a, uint256 b) internal pure returns (uint256) {     
        //Integer division of two numbers, truncating the quotient.
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        //Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
        assert(b <= a);
        return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        //dev Adds two numbers, throws on overflow.
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
