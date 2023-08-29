'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import AVVY from '@avvy/client';
import { useAccount } from "wagmi";
import { providers } from 'ethers';

export default function CustomConnectButton() {
  const provider = new providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc')
  const { address } = useAccount();
  const [avvyName, setAvvy] = useState('');

  const fetchAvvy = async () => {
    const avvy = new AVVY(provider, {});
    // @ts-ignore
    const hash = await avvy.reverse(AVVY.RECORDS.EVM, address)
    let name;
    try {
      name = await hash?.lookup();
      setAvvy(name?.name);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchAvvy();
  }, [address]);
  return (

    <div className="flex items-center">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button className="btn btn-outline btn-warning" onClick={openConnectModal} type="button">
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button className="btn btn-outline btn-warning" onClick={openChainModal} type="button">
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      className="flex items-center text-gray-100"
                      onClick={openChainModal}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                          className="w-5 h-5"
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-5 h-5"
                            />
                          )}
                        </div>
                      )}
                      <span className="hidden sm:flex">{chain.name}</span>
                    </button>

                    <button className="btn btn-outline btn-warning" onClick={openAccountModal} type="button">
                      {avvyName ? avvyName
                        //  : ensName ? ensName
                        : account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ''}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  )
}