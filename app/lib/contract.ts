import { ethers } from "ethers"

export const CONTRACT_ADDRESS = "0x20b16a3741825ef0058fe295e38d969ff44c2004"
export const CHAIN_ID = "11155111" // Sepolia

export const CONTRACT_ABI = [
  { inputs: [], name: "DescriptionCannotBeEmpty", type: "error" },
  { inputs: [{ internalType: "uint256", name: "length", type: "uint256" }], name: "DescriptionTooLong", type: "error" },
  { inputs: [], name: "TitleCannotBeEmpty", type: "error" },
  { inputs: [{ internalType: "uint256", name: "length", type: "uint256" }], name: "TitleTooLong", type: "error" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "proposer", type: "address" },
      { indexed: false, internalType: "uint256", name: "proposalNumber", type: "uint256" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      { indexed: false, internalType: "string", name: "description", type: "string" },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allProposals",
    outputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "_title", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProposals",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
        ],
        internalType: "struct IProposals.Proposal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getProposalsByAddress",
    outputs: [
      {
        components: [
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
        ],
        internalType: "struct IProposals.Proposal[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalProposalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalProposalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "userProposals",
    outputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
]

export type Proposal = {
  title: string
  description: string
  timestamp?: number
  proposer?: string
}

export async function getContract() {
  if (typeof window === "undefined") return null

  try {
    const { ethereum } = window as any
    if (!ethereum) return null

    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  } catch (error) {
    console.error("Failed to get contract:", error)
    return null
  }
}

export async function getAllProposals(): Promise<Proposal[]> {
  const contract = await getContract()
  if (!contract) return []

  try {
    const proposals = await contract.getAllProposals()
    return proposals.map((p: any) => ({
      title: p.title,
      description: p.description,
      timestamp: Date.now() - Math.floor(Math.random() * 10 * 86400000), // Random timestamp for demo
    }))
  } catch (error) {
    console.error("Failed to get proposals:", error)
    return []
  }
}

export async function createProposal(title: string, description: string): Promise<boolean> {
  const contract = await getContract()
  if (!contract) return false

  try {
    const tx = await contract.createProposal(title, description)
    await tx.wait()
    return true
  } catch (error) {
    console.error("Failed to create proposal:", error)
    return false
  }
}

export async function getProposalCount(): Promise<number> {
  const contract = await getContract()
  if (!contract) return 0

  try {
    const count = await contract.getTotalProposalCount()
    return Number(count)
  } catch (error) {
    console.error("Failed to get proposal count:", error)
    return 0
  }
}

export async function getUserProposals(address: string): Promise<Proposal[]> {
  const contract = await getContract()
  if (!contract) return []

  try {
    const proposals = await contract.getProposalsByAddress(address)
    return proposals.map((p: any) => ({
      title: p.title,
      description: p.description,
      timestamp: Date.now() - Math.floor(Math.random() * 10 * 86400000), // Random timestamp for demo
    }))
  } catch (error) {
    console.error("Failed to get user proposals:", error)
    return []
  }
}
