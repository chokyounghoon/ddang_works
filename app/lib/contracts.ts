/**
 * contracts.ts — 스마트 컨트랙트 ABI 및 시뮬레이션 (Option C)
 */

// ── ERC-20 SOLC Token ABI (최소 인터페이스)
export const SolcTokenABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function totalSupply() view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
];

// ── ERC-5192 SBT ABI
export const SBTContractABI = [
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function locked(uint256 tokenId) view returns (bool)',
  'event Locked(uint256 tokenId)',
];

// ── Escrow Contract ABI
export const EscrowABI = [
  'function deposit(address worker, uint256 amount) payable',
  'function release(address worker, bytes32 workId)',
  'function slash(address worker, bytes32 reason)',
  'function getBalance(address worker) view returns (uint256)',
  'event Deposited(address indexed employer, address indexed worker, uint256 amount)',
  'event Released(address indexed worker, uint256 amount, bytes32 workId)',
];

// ── S-BRIDGE Oracle ABI
export const SBridgeABI = [
  'function requestSettlement(bytes32 workId, address worker, uint256 grossPay, uint256 feeRate) returns (bytes32 requestId)',
  'function fulfillSettlement(bytes32 requestId, bool approved, uint256 netPay)',
  'event OracleRequest(bytes32 indexed requestId, address worker, uint256 amount)',
  'event OracleFulfill(bytes32 indexed requestId, bool approved)',
];

// ── 시뮬레이션 토크노믹스 데이터
export const SOLC_TOKENOMICS = {
  totalSupply:   100_000_000,
  circulating:    42_381_950,
  burned:            412_880,
  staked:         18_200_000,
  workerPool:     55_000_000, // 55%
  ecosystem:      25_000_000, // 25%
  foundation:     20_000_000, // 20%
  stakingApy:     8.5,        // %
  priceKRW:       1_000,      // ₩1,000 per SOLC
  priceChange24h: +2.34,      // %
  marketCapKRW:   42_381_950_000,
  volume24hKRW:    1_240_000_000,
};

// ── 실시간 블록 트랜잭션 타입
export interface BlockTransaction {
  hash:   string;
  from:   string;
  to:     string;
  value:  string;
  type:   'ESCROW_DEPOSIT' | 'SETTLEMENT' | 'SBT_MINT' | 'TRANSFER' | 'STAKE';
  status: 'pending' | 'confirmed' | 'finalized';
  gasUsed: number;
}

// ── SBT 메타데이터
export interface SBTMetadata {
  tokenId:   string;
  owner:     string;
  name:      string;
  score:     number;
  grade:     string;
  ipfsUri:   string;
  mintedAt:  string;
  traits:    { trait_type: string; value: string | number }[];
  isLocked:  boolean;
}

/** SBT 메타데이터 생성 */
export function buildSBTMetadata(address: string, score: number, ipfsCid: string): SBTMetadata {
  const grade = score >= 950 ? '신한인증 1등급' : score >= 800 ? '신한인증 2등급' : '신한인증 3등급';
  return {
    tokenId:  `${parseInt(address.slice(2, 10), 16) % 100000}`,
    owner:    address,
    name:     `D-GCS ${score}점 SBT`,
    score,
    grade,
    ipfsUri:  `ipfs://${ipfsCid}`,
    mintedAt: new Date().toISOString(),
    isLocked: true,
    traits: [
      { trait_type: 'D-GCS Score',   value: score },
      { trait_type: 'Grade',          value: grade },
      { trait_type: 'Non-Transfer',   value: 'ERC-5192 Locked' },
      { trait_type: 'Issuer',         value: 'ShinhanDS' },
      { trait_type: 'Chain',          value: 'Shinhan PoA Mainnet' },
    ],
  };
}

/** 트랜잭션 시뮬레이션 생성기 */
export function generateMockTransaction(type: BlockTransaction['type']): BlockTransaction {
  const addrHex = () => `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  const txHash  = () => `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

  const typeMap: Record<BlockTransaction['type'], { value: string; gasUsed: number }> = {
    ESCROW_DEPOSIT: { value: '52.50 SOLC',  gasUsed: 63_421 },
    SETTLEMENT:     { value: '50.00 SOLC',  gasUsed: 45_218 },
    SBT_MINT:       { value: '0 SOLC',      gasUsed: 89_302 },
    TRANSFER:       { value: `${(Math.random() * 200).toFixed(2)} SOLC`, gasUsed: 21_000 },
    STAKE:          { value: `${(Math.random() * 500).toFixed(2)} SOLC`, gasUsed: 54_100 },
  };

  return {
    hash:    txHash(),
    from:    addrHex(),
    to:      addrHex(),
    value:   typeMap[type].value,
    type,
    status:  'pending',
    gasUsed: typeMap[type].gasUsed,
  };
}
