"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { ethers } from "ethers"
import { CHAIN_ID } from "@/lib/contract"

type WalletContextType = {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  chainId: string | null
  switchToSepolia: () => Promise<void>
  isCorrectNetwork: boolean
}

const WalletContext = createContext<WalletContextType>({
  address: null,
  isConnected: false,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  chainId: null,
  switchToSepolia: async () => {},
  isCorrectNetwork: false,
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)

  const connectWallet = async () => {
    if (typeof window === "undefined") return

    const { ethereum } = window as any
    if (!ethereum) {
      alert("Please install MetaMask to use this dApp")
      return
    }

    setIsConnecting(true)

    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)

        const provider = new ethers.BrowserProvider(ethereum)
        const network = await provider.getNetwork()
        setChainId(network.chainId.toString())
        setIsCorrectNetwork(network.chainId.toString() === CHAIN_ID)
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAddress(null)
    setIsConnected(false)
    setChainId(null)
    setIsCorrectNetwork(false)
  }

  const switchToSepolia = async () => {
    const { ethereum } = window as any
    if (!ethereum) return

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${Number.parseInt(CHAIN_ID).toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${Number.parseInt(CHAIN_ID).toString(16)}`,
              chainName: "Sepolia Test Network",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://sepolia.infura.io/v3/"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        })
      }
    }
  }

  useEffect(() => {
    const checkConnection = async () => {
      const { ethereum } = window as any
      if (!ethereum) return

      try {
        const accounts = await ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)

          const provider = new ethers.BrowserProvider(ethereum)
          const network = await provider.getNetwork()
          setChainId(network.chainId.toString())
          setIsCorrectNetwork(network.chainId.toString() === CHAIN_ID)
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }

    if (typeof window !== "undefined") {
      checkConnection()
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const { ethereum } = window as any
    if (!ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      } else {
        setAddress(null)
        setIsConnected(false)
      }
    }

    const handleChainChanged = (chainId: string) => {
      setChainId(Number.parseInt(chainId).toString())
      setIsCorrectNetwork(Number.parseInt(chainId).toString() === CHAIN_ID)
      window.location.reload()
    }

    ethereum.on("accountsChanged", handleAccountsChanged)
    ethereum.on("chainChanged", handleChainChanged)

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged)
      ethereum.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        chainId,
        switchToSepolia,
        isCorrectNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
