"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, Search, User } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { getAllProposals, getUserProposals, type Proposal } from "@/lib/contract"

export default function ViewProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { isConnected, address, connectWallet } = useWallet()

  useEffect(() => {
    async function fetchProposals() {
      setLoading(true)
      try {
        if (activeTab === "my" && address) {
          const userProposals = await getUserProposals(address)
          setProposals(userProposals)
        } else {
          const allProposals = await getAllProposals()
          setProposals(allProposals)
        }
      } catch (error) {
        console.error("Error fetching proposals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProposals()
  }, [activeTab, address])

  const filteredProposals = proposals.filter((proposal) => {
    return (
      proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <div className="container max-w-lg py-12 flex flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="mb-6">Connect your wallet to view proposals</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search proposals..."
            className="w-full sm:w-[300px] pl-8 border-input/40 focus-visible:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Proposals</TabsTrigger>
            <TabsTrigger value="my">My Proposals</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6">
        {loading ? (
          // Loading skeletons
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="border-purple-500/10">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
              </Card>
            ))
        ) : filteredProposals.length > 0 ? (
          filteredProposals.map((proposal, index) => (
            <Card key={index} className="border-purple-500/20 transition-all duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-xl">{proposal.title}</CardTitle>
                  {proposal.timestamp && (
                    <Badge variant="outline" className="flex gap-1 items-center">
                      <Clock className="h-3 w-3" />
                      {formatDate(proposal.timestamp)}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{proposal.description}</p>
                {proposal.proposer && (
                  <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    Proposed by: {truncateAddress(proposal.proposer)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed border-2 border-muted">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center">No proposals found</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setActiveTab("all")
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
