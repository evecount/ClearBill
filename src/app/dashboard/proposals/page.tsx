
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Trash2, FileSignature, Copy, ExternalLink, Share2, Sparkles, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function ProposalsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const firestore = useFirestore()
  const [search, setSearch] = useState("")
  const [origin, setOrigin] = useState("")

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const proposalsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return query(
      collection(firestore, 'organizations', user.uid, 'proposals'),
      orderBy('createdAt', 'desc')
    )
  }, [user, firestore])

  const { data: proposals, isLoading } = useCollection(proposalsQuery)

  const filteredProposals = proposals?.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleDelete = (id: string) => {
    if (!user || !firestore) return
    const docRef = doc(firestore, 'organizations', user.uid, 'proposals', id)
    deleteDocumentNonBlocking(docRef)
    toast({ title: "Proposal Deleted", description: "The strategic document has been removed." })
  }

  const copyLink = (id: string) => {
    const url = `${origin}/proposal/${user?.uid}/${id}`
    navigator.clipboard.writeText(url)
    toast({ title: "Link Copied", description: "Strategic dashboard URL copied to clipboard." })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
          <p className="text-muted-foreground">Draft and deliver high-value project wins.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/dashboard/proposals/new">
            <Plus className="size-4 mr-2" /> New Proposal
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search proposals..." 
            className="pl-10 border-none shadow-none focus-visible:ring-0" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground">Architecting proposal list...</div>
      ) : proposals && proposals.length > 0 ? (
        <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold">Proposal Title</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Estimate</TableHead>
                  <TableHead className="font-bold">Created</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <FileSignature className="size-4 text-accent" />
                        </div>
                        <span className="font-bold">{proposal.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none">
                        {proposal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-accent">
                      {proposal.estimatedAmount ? `$${proposal.estimatedAmount.toLocaleString()}` : "N/A"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {proposal.createdAt?.toDate ? proposal.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-accent hover:text-accent hover:bg-accent/10"
                          asChild
                          title="Open Client Dashboard"
                        >
                          <Link href={`/proposal/${user?.uid}/${proposal.id}`} target="_blank">
                             <ExternalLink className="size-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-accent hover:bg-accent/10"
                          onClick={() => copyLink(proposal.id)}
                          title="Copy Link"
                        >
                          <Share2 className="size-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                               <Link href="/dashboard/proposals/new">
                                 <Edit2 className="size-4 mr-2" /> Edit Strategy
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyLink(proposal.id)}>
                              <Copy className="size-4 mr-2" /> Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(proposal.id)}>
                              <Trash2 className="size-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="py-24 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <FileSignature className="size-12 mx-auto mb-4 text-slate-200" />
          <h3 className="text-lg font-bold">No Proposals Yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
            Proposals are the high-trust entry point for elite professional relationships.
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/dashboard/proposals/new">
              <Sparkles className="size-4 mr-2" /> Draft Your First Proposal
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
