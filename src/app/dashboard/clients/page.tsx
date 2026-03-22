
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Mail, MapPin, MoreVertical, Trash2, Edit2, FileText, User, Building2, Loader2, ShieldAlert, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useUser, useFirestore, useCollection } from "@/firebase"
import { useMemoFirebase } from "@/firebase/provider"
import { collection, query, orderBy, serverTimestamp, doc } from "firebase/firestore"
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const STRATEGIC_LEADS = [
  {
    name: "National Museum of Singapore (NMS)",
    company: "National Heritage Board",
    email: "DigiMuse@nhb.gov.sg",
    address: "93 Stamford Rd, Singapore 178897"
  },
  {
    name: "ArtScience Museum",
    company: "Marina Bay Sands",
    email: "MuseumEnquiries@marinabaysands.com",
    address: "6 Bayfront Ave, Singapore 018974"
  },
  {
    name: "Singapore Art Museum (SAM)",
    company: "Singapore Art Museum",
    email: "residencies@singaporeartmuseum.sg",
    address: "39 Keppel Rd, Tanjong Pagar Distripark, Singapore 089065"
  },
  {
    name: "Peranakan Museum",
    company: "Peranakan Museum",
    email: "nhb_tpm_edu@nhb.gov.sg",
    address: "39 Armenian St, Singapore 179941"
  }
]

export default function ClientsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [activeClient, setActiveClient] = useState<any>(null)
  const [clientForm, setClientForm] = useState({ name: "", company: "", email: "", address: "" })

  const clientsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null
    return query(
      collection(firestore, 'organizations', user.uid, 'clients'),
      orderBy('createdAt', 'desc')
    )
  }, [user, firestore])

  const { data: clients, isLoading } = useCollection(clientsQuery)

  const filteredClients = clients?.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleSeedLeads = async () => {
    if (!user || !firestore || isSeeding) return
    setIsSeeding(true)
    
    try {
      const colRef = collection(firestore, 'organizations', user.uid, 'clients')
      STRATEGIC_LEADS.forEach(lead => {
        addDocumentNonBlocking(colRef, {
          ...lead,
          organizationId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      })
      toast({ 
        title: "Strategic Leads Injected", 
        description: "Singapore's elite museum ecosystem has been added to your directory." 
      })
    } catch (error) {
      toast({ title: "Injection Error", description: "Failed to seed leads.", variant: "destructive" })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleOpenAddDialog = (open: boolean) => {
    setIsAddOpen(open)
    if (open) {
      setClientForm({ name: "", company: "", email: "", address: "" })
    }
  }

  const handleAddClient = () => {
    if (isSaving) return

    if (!user) {
      toast({ 
        title: "Identity Not Found", 
        description: "Your professional session is still initializing.", 
        variant: "destructive" 
      })
      return
    }

    if (!clientForm.name.trim() || !clientForm.email.trim()) {
      toast({ title: "Facts Required", description: "Name and email are required to anchor a client.", variant: "destructive" })
      return
    }

    setIsSaving(true)
    const clientData = {
      organizationId: user.uid,
      name: clientForm.name.trim(),
      company: clientForm.company.trim(),
      email: clientForm.email.trim(),
      address: clientForm.address.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    addDocumentNonBlocking(collection(firestore, 'organizations', user.uid, 'clients'), clientData)
      .then(() => {
        toast({ title: "Client Saved", description: `${clientData.name} has been added to your directory.` })
        setIsAddOpen(false)
        setIsSaving(false)
      })
  }

  const handleEditClick = (client: any) => {
    setActiveClient(client)
    setClientForm({ 
      name: client.name, 
      company: client.company || "", 
      email: client.email, 
      address: client.address 
    })
    setIsEditOpen(true)
  }

  const handleUpdateClient = () => {
    if (!user || !firestore || !activeClient) return

    if (!clientForm.name.trim() || !clientForm.email.trim()) {
      toast({ title: "Validation Fault", description: "Name/email cannot be empty.", variant: "destructive" })
      return
    }

    const docRef = doc(firestore, 'organizations', user.uid, 'clients', activeClient.id)
    updateDocumentNonBlocking(docRef, { 
      name: clientForm.name.trim(),
      company: clientForm.company.trim(),
      email: clientForm.email.trim(),
      address: clientForm.address.trim(),
      updatedAt: serverTimestamp() 
    })
    setIsEditOpen(false)
    toast({ title: "Client Updated", description: "Professional details persisted." })
  }

  const handleDelete = (id: string) => {
    if (!user || !firestore) return
    const docRef = doc(firestore, 'organizations', user.uid, 'clients', id)
    deleteDocumentNonBlocking(docRef)
    toast({ title: "Client Removed", description: "The contact has been removed from your ecosystem." })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Your directory of professional partnerships.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="border-accent text-accent hover:bg-accent/5"
            onClick={handleSeedLeads}
            disabled={isSeeding}
          >
            {isSeeding ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
            Inject Singapore Leads
          </Button>

          <Dialog open={isAddOpen} onOpenChange={handleOpenAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90">
                <Plus className="size-4 mr-2" /> Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl">
              <DialogHeader>
                <DialogTitle>New Professional Contact</DialogTitle>
                <DialogDescription>Define the facts for your new client relationship.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Alex Rivera" 
                    value={clientForm.name} 
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} 
                    className="h-12 rounded-xl" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company / Organization</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      id="company" 
                      placeholder="e.g. Nexus Creative" 
                      value={clientForm.company} 
                      onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })} 
                      className="h-12 pl-10 rounded-xl" 
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="alex@example.com" 
                    value={clientForm.email} 
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} 
                    className="h-12 rounded-xl" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Billing Address</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Studio Way, Unit 4" 
                    value={clientForm.address} 
                    onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })} 
                    className="h-12 rounded-xl" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddClient} disabled={isSaving} className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold">
                  {isSaving ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                  Persist Client
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Client Strategy</DialogTitle>
            <DialogDescription>Update the identity markers for {activeClient?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-company">Company / Organization</Label>
              <Input id="edit-company" value={clientForm.company} onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input id="edit-email" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="h-12 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Billing Address</Label>
              <Input id="edit-address" value={clientForm.address} onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })} className="h-12 rounded-xl" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateClient} className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl font-bold">Update Strategy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative bg-white p-2 rounded-xl border shadow-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search clients..." className="pl-10 border-none shadow-none focus-visible:ring-0" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {isLoading || isUserLoading ? (
        <div className="py-24 text-center text-muted-foreground flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">Architecting directory...</span>
        </div>
      ) : filteredClients.length > 0 ? (
        <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold">Client / Company</TableHead>
                  <TableHead className="font-bold">Contact Email</TableHead>
                  <TableHead className="font-bold">Billing Address</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{client.name}</span>
                        {client.company && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                            <Building2 className="size-2.5" />
                            {client.company}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-3 text-muted-foreground" />
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-3 text-muted-foreground" />
                        {client.address || "No address provided"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(client)}><Edit2 className="size-4 mr-2" /> Edit Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push('/dashboard/invoices')}><FileText className="size-4 mr-2" /> View Invoices</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(client.id)}><Trash2 className="size-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="py-24 text-center bg-white rounded-2xl border border-dashed">
          <User className="size-12 mx-auto mb-4 text-slate-200" />
          <h3 className="text-lg font-bold">Directory Empty</h3>
          <p className="text-sm text-muted-foreground mb-6">Add your first client to start architecting high-value invoices.</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => setIsAddOpen(true)} className="bg-accent hover:bg-accent/90 font-bold">Add First Client</Button>
            <Button variant="outline" onClick={handleSeedLeads} disabled={isSeeding} className="border-accent text-accent">
               {isSeeding ? <Loader2 className="size-4 animate-spin mr-2" /> : <Sparkles className="size-4 mr-2" />}
               Inject Museum Leads
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
