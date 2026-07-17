/**
 * web3.ts — 신한 PoA 네트워크 설정 & Web3 유틸리티
 * Option C: 신한 슈퍼SOL 딥링크 전용 (설치 불필요)
 */

export const SHINHAN_CHAIN = {
  chainId: 0x539,        // 1337 decimal (로컬 시뮬레이션)
  chainName: '신한 PoA Mainnet',
  rpcUrls: ['https://rpc.shinhan-chain.io'],
  nativeCurrency: { name: 'Shinhan SOL Coin', symbol: 'SOLC', decimals: 18 },
  blockExplorerUrls: ['https://scan.shinhan-chain.io'],
};

export const SOLC_TOKEN_ADDRESS  = '0xSolC0000000000000000000000000000000001';
export const SBT_CONTRACT_ADDRESS = '0xSBT00000000000000000000000000000000001';
export const ESCROW_ADDRESS       = '0xEscr0000000000000000000000000000000001';
export const SBRIDGE_ADDRESS      = '0xSBridge0000000000000000000000000000001';

/** 신한 슈퍼SOL 앱 딥링크 생성 */
export function buildSuperSOLDeepLink(action: 'connect' | 'sign' | 'send', params: Record<string, string> = {}): string {
  const query = new URLSearchParams({ action, ...params }).toString();
  return `shinhan-supersol://wallet?${query}`;
}

/** 결정론적 지갑 주소 시뮬레이션 (사용자 세션 기반) */
export function generateSimulatedAddress(): string {
  const stored = sessionStorage.getItem('ddang_wallet_addr');
  if (stored) return stored;
  const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const addr = `0x${hex}`;
  sessionStorage.setItem('ddang_wallet_addr', addr);
  return addr;
}

/** 주소 줄임 표시 */
export function shortenAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/** 트랜잭션 해시 시뮬레이션 */
export function simulateTxHash(): string {
  const hex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `0x${hex}`;
}

/** 블록 번호 시뮬레이션 (시작값 + 경과 블록) */
const GENESIS_BLOCK = 18_427_001;
const GENESIS_TIME  = Date.now();
const BLOCK_TIME_MS = 3000; // 3초 블록 타임 (신한 PoA)
export function currentBlockNumber(): number {
  return GENESIS_BLOCK + Math.floor((Date.now() - GENESIS_TIME) / BLOCK_TIME_MS);
}

/** EIP-712 서명 시뮬레이션 */
export function simulateEIP712Signature(address: string, workId: string): string {
  const input = `${address}:${workId}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = Math.imul(31, hash) + input.charCodeAt(i) | 0;
  }
  return `0x${Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64)}1c`;
}

/** IPFS CID 시뮬레이션 */
export function simulateIPFS(data: object): string {
  const str = JSON.stringify(data);
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return `Qm${Math.abs(hash).toString(36).padStart(44, 'A').slice(0, 44)}`;
}

/** SOLC ↔ KRW 변환 */
export const SOLC_KRW_RATE = 1000; // 1 SOLC = ₩1,000
export const toKRW  = (solc: number) => solc * SOLC_KRW_RATE;
export const toSOLC = (krw: number)  => krw  / SOLC_KRW_RATE;
