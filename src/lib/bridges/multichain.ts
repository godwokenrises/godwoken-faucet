interface TokenStruct {
  decimal: number
  address: string
}

export const multichainMainnetTokens: { [key: string]: TokenStruct } = {
  USDC: {
    address: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    decimal: 6,
  },
  USDT: {
    address: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
    decimal: 6,
  },
  WBTC: {
    address: "0xb44a9b6905af7c801311e8f4e76932ee959c663c",
    decimal: 8,
  },
  ETH: {
    address: "0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c",
    decimal: 18,
  },
  DAI: {
    address: "0x765277eebeca2e31912c9946eae1021199b39c61",
    decimal: 18,
  },
}
