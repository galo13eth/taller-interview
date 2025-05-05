import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)] items-center justify-center text-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Decentralized Governance
        </h1>
        <p className="text-xl text-muted-foreground">
          Submit and vote on proposals to shape the future of our ecosystem
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/submit-proposal">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
            >
              Submit a Proposal
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/view-proposals">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Proposals
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
