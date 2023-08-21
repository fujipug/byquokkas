'use client'
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { chains, wagmiConfig } from "../../../packages/wagmi-config/wagmi-config";
import { Analytics } from "@vercel/analytics/react";
import Header from "ui/Header";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} theme={darkTheme()}>
            <Header appName="Swop" showLogo={true} />
            <div className="">{children}</div>
            <Analytics />
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
