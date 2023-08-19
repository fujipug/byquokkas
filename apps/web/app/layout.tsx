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
            <Header appName="By Quokkas" showLogo={false} />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 my-8 sm:my-12 mx-4 sm:mx-0">{children}</div>
            <Analytics />
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
