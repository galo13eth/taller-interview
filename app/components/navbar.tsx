"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Wallet, PlusCircle, List, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { useWallet } from "@/context/wallet-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const pathname = usePathname()
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, isCorrectNetwork, switchToSepolia } =
    useWallet()

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-full bg-purple-600 p-1">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl hidden md:inline-block">Governance dApp</span>
          </Link>
          <nav className="ml-6 hidden md:flex gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Home
            </Link>
            <Link
              href="/submit-proposal"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === "/submit-proposal" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Submit
            </Link>
            <Link
              href="/view-proposals"
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground/80",
                pathname === "/view-proposals" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Proposals
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "hidden sm:flex",
                    isCorrectNetwork
                      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                      : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 hover:text-yellow-500",
                  )}
                >
                  {shortenAddress(address!)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!isCorrectNetwork && <DropdownMenuItem onClick={switchToSepolia}>Switch to Sepolia</DropdownMenuItem>}
                <DropdownMenuItem onClick={disconnectWallet}>Disconnect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const { isConnected, connectWallet } = useWallet()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t bg-background p-2">
      <Link href="/" className="flex flex-col items-center p-2">
        <Home className={cn("h-5 w-5", pathname === "/" ? "text-primary" : "text-muted-foreground")} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link href="/submit-proposal" className="flex flex-col items-center p-2">
        <PlusCircle
          className={cn("h-5 w-5", pathname === "/submit-proposal" ? "text-primary" : "text-muted-foreground")}
        />
        <span className="text-xs mt-1">Submit</span>
      </Link>
      <Link href="/view-proposals" className="flex flex-col items-center p-2">
        <List className={cn("h-5 w-5", pathname === "/view-proposals" ? "text-primary" : "text-muted-foreground")} />
        <span className="text-xs mt-1">Proposals</span>
      </Link>
      {!isConnected && (
        <button onClick={connectWallet} className="flex flex-col items-center p-2">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs mt-1">Connect</span>
        </button>
      )}
    </div>
  )
}
