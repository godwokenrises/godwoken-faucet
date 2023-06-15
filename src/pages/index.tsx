import useSWR from 'swr';
import { fetcher, formatValue, getAbbreviation, weiToEth } from '@/lib/utils';
import BeatLoader from 'react-spinners/BeatLoader';
import Button from 'react-bootstrap/Button';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Badge from '@/components/badge';
import { PrismaTransactionStatus } from '@/lib/constants';
import React from 'react';
import { Transaction } from '@prisma/client';

export default function Home() {
  const [address, setAddress] = React.useState('');
  const [claiming, setClaiming] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { data: balanceData } = useSWR('/api/balance', fetcher);
  const { data: txsData, mutate } = useSWR('/api/transactions', fetcher);
  const { transactions = [] } = txsData ?? {};

  const handleClaim = React.useCallback(async () => {
    if (claiming || !address) {
      return;
    }
    setErrorMessage('');
    setClaiming(true);
    const response = await fetch('/api/claim', {
      method: 'POST',
      body: JSON.stringify({ account: address }),
    });
    if (response.status === 200) {
      mutate();
      setAddress('');
      setErrorMessage('');
    } else {
      const { message } = await response.json();
      setErrorMessage(message);
    }
    setClaiming(false);
  }, [address, claiming, mutate]);

  return (
      <>
        <Head>
          <title>Godwoken Faucet</title>
        </Head>
        <main>
          <div className="fixed top-0 px-2 h-16 mt-8 ml-8 w-scrren bg-transparent">
            <Link href="https://godwoken.com/">
              <Image width={128} height={64} src="/logo.svg" alt="Godwoken Logo" />
            </Link>
          </div>
          <div
              className="flex flex-col justify-center items-center bg-green-950 w-full sm:min-h-[50vh]"
          >
            <div className="flex flex-col justify-center items-center pt-20">
              <Image
                  className="mt-12 mb-16"
                  src="/logo.svg"
                  height={269}
                  width={360}
                  alt="Godwoken"
              />
            </div>
            <div className="relative flex flex-col mb-12 w-full px-6 max-w-screen-sm">
              <div className="flex w-full justify-center">
                <input
                    className="h-10 w-full outline-none px-3 rounded-tl-lg rounded-bl-lg"
                    placeholder="Enter your Godwoken address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Button
                    className={`flex flex-col w-24 h-10 justify-center items-center px-3 border-2 border-white bg-green-600 hover:bg-opacity-70 ${
                        claiming
                            ? 'cursor-not-allowed bg-opacity-70'
                            : 'cursor-pointer'
                    }`}
                    onClick={handleClaim}
                    disabled={claiming}
                >
                  {claiming ? (
                      <BeatLoader color="#1E2430" size={10} />
                  ) : (
                      <span className="text-gray-800 font-semibold">Claim</span>
                  )}
                </Button>
              </div>
              {errorMessage && (
                  <div className="absolute -bottom-6 left-6 text-sm text-red-600 mt-1">
                    <span>Error: {errorMessage}</span>
                  </div>
              )}
            </div>
            <div className="mb-16">
            <span className="text-white">
              There are{' '}
              {balanceData ? formatValue(balanceData.balance) : '-.--'}{' '}
              Token(s) left in Godwoken Faucet
            </span>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8 mt-10 max-w-screen-md">
            <h2 className="text-3xl text-gray-800 font-semibold mb-6">Claims</h2>
            <div>
              {transactions.map((tx: Transaction) => {
                const date = new Date(tx.createdAt);
                return (
                    <div className="relative " key={tx.transactionHash}>
                      <div className="absolute -bottom-1 -left-1 bg-green-600 border border-gray-400 w-full h-full -z-10" />
                      <div className="flex flex-col p-8 mb-8 bg-white border border-gray-400 z-30">
                        <div className="flex flex-col sm:flex-row justify-between pb-2 border-b border-gray-200">
                          <span>{getAbbreviation(tx.transactionHash, 12, 20)}</span>
                          <span className="text-gray-600">
                        {date.toLocaleDateString()} {date.toLocaleTimeString()}
                      </span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between pt-2">
                          <div className="table">
                            <div className="table-row">
                              <span className="table-cell w-16">FROM: </span>
                              <span className="table-cell">
                            {getAbbreviation(tx.from, 12, 20)}
                          </span>
                            </div>
                            <div className="table-row">
                              <span className="table-cell w-16">TO: </span>
                              <span className="table-cell">
                            {getAbbreviation(tx.to, 12, 20)}
                          </span>
                            </div>
                          </div>
                          <span>
                        {weiToEth(BigInt(tx.value.toString()))} Token(s)
                      </span>
                        </div>
                        <div className="mt-4">
                          <Badge
                              status={tx.status}
                              text={PrismaTransactionStatus[tx.status]}
                          />
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </main>
      </>
  );
}
