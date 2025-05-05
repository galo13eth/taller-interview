"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { createProposal } from "@/lib/contract"
import { useRouter } from "next/navigation"

export default function SubmitProposal() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { isConnected, isCorrectNetwork, connectWallet, switchToSepolia } = useWallet()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit a proposal",
        variant: "destructive",
      })
      return
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong network",
        description: "Please switch to Sepolia network",
        variant: "destructive",
      })
      switchToSepolia()
      return
    }

    if (!title || !description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const success = await createProposal(title, description)

      if (success) {
        toast({
          title: "Proposal submitted!",
          description: "Your proposal has been successfully submitted to the blockchain",
        })
        setTitle("")
        setDescription("")
        router.push("/view-proposals")
      } else {
        toast({
          title: "Submission failed",
          description: "There was an error submitting your proposal",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your proposal",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="container max-w-lg py-12 flex flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="mb-6">Connect your wallet to submit a proposal</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isCorrectNetwork) {
    return (
      <div className="container max-w-lg py-12 flex flex-col items-center justify-center text-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Wrong Network</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="mb-6">Please switch to Sepolia network to submit a proposal</p>
            <Button onClick={switchToSepolia}>Switch to Sepolia</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-12">
      <Card className="border-purple-500/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Submit Proposal</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Proposal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-input/40 focus-visible:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Proposal description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] border-input/40 focus-visible:ring-purple-500"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Proposal
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
