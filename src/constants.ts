

export const FEST_TOKEN_ADDRESS = "0x578814d5304A9aAcf098D6b6D9BF6FE3b8e19021"; // Fest Token Address on Fest Chain

export const ERC20ABI = [
    "function mint(address,uint256) public",
    "function transferFrom(address from, address to, uint256 value) public returns (bool) ",
    "function transfer(address to, uint256 value) public virtual returns (bool)",
    "function balanceOf(address account) public view returns (uint256)"
]