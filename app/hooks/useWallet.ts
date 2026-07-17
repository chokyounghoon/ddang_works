'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  generateSimulatedAddress,
  shortenAddr,
  currentBlockNumber,
  simulateEIP712Signature,
  buildSuperSOLDeepLink,
} from '../lib/web3';

const SOLC_STORAGE_KEY = 'ddang_solc_balance';

export interface WalletState {
  address: string | null;
  shortAddress: string;
  solcBalance: number;
  isConnected: boolean;
  isConnecting: boolean;
  blockNumber: number;
  deepLink: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  signWork: (workId: string, amount: number) => Promise<string>;
  addSolc: (amount: number) => void;
  error: string | null;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [solcBalance, setSolcBalance] = useState(524.3);
  const [isConnecting, setIsConnecting] = useState(false);
  const [blockNumber, setBlockNumber] = useState(currentBlockNumber());
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;
  const shortAddress = address ? shortenAddr(address) : '';
  const deepLink = buildSuperSOLDeepLink('connect', { appId: 'ddang-works', callback: 'https://alba-super-sol.pages.dev' });

  // 저장된 세션 복원
  useEffect(() => {
    const stored = sessionStorage.getItem('ddang_wallet_connected');
    if (stored === 'true') {
      const addr = generateSimulatedAddress();
      setAddress(addr);
    }
    const bal = localStorage.getItem(SOLC_STORAGE_KEY);
    if (bal) setSolcBalance(parseFloat(bal));
  }, []);

  // 실시간 블록 카운터 (3초 주기)
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber(currentBlockNumber());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /** 신한 슈퍼SOL 앱 딥링크 연결 (Option C) */
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    // 데스크탑/웹 데모: 딥링크 없이 즉시 시뮬레이션
    // (실제 모바일 앱 배포 시 shinhan-supersol:// 딥링크 활성화)
    await new Promise(res => setTimeout(res, 800));

    const addr = generateSimulatedAddress();
    setAddress(addr);
    sessionStorage.setItem('ddang_wallet_connected', 'true');
    setIsConnecting(false);
  }, []);


  const disconnect = useCallback(() => {
    setAddress(null);
    sessionStorage.removeItem('ddang_wallet_connected');
    sessionStorage.removeItem('ddang_wallet_addr');
  }, []);

  /** EIP-712 서명 시뮬레이션 */
  const signWork = useCallback(async (workId: string, amount: number): Promise<string> => {
    if (!address) return '';
    await new Promise(res => setTimeout(res, 800)); // 서명 딜레이 시뮬레이션
    return simulateEIP712Signature(address, workId);
  }, [address]);

  /** SOLC 잔액 증가 (정산 시 호출) */
  const addSolc = useCallback((amount: number) => {
    setSolcBalance(prev => {
      const next = parseFloat((prev + amount).toFixed(2));
      localStorage.setItem(SOLC_STORAGE_KEY, next.toString());
      return next;
    });
  }, []);

  return {
    address, shortAddress, solcBalance, isConnected,
    isConnecting, blockNumber, deepLink,
    connect, disconnect, signWork, addSolc, error,
  };
}
