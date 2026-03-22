
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Mail, MapPin, MoreVertical, Trash2, Edit2, FileText, User, Loader2 } from "lucide-react"
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

export default function ClientsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useUser()
  const firestore = useFirestore()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<any>(null)
  const [clientForm, setClientForm] = useState({ name: "", email: "", address: "" })

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
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleAddClient = () => {
    if (!clientForm.name || !clientForm.email || !user || !firestore) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" })
      return
    }

    const clientData = {
      organizationId: user.uid,
      ...clientForm,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    addDocumentNonBlocking(collection(firestore, 'organizations', user.uid, 'clients'), clientData)
    setClientForm({ name: "", email: "", address: "" })
    setIsAddOpen(false)
    toast({ title: "Client Added", description: `${clientData.name} has been added to your directory.` })
  }

  const handleEditClick = (client: any) => {
    setActiveClient(client)
    setClientForm({ name: client.name, email: client.email, address: client.address })
    setIsEditOpen(true)
  }

  const handleUpdateClient = () => {
    if (!user || !firestore || !activeClient) return
    const docRef = doc(firestore, 'organizations', user.uid, 'clients', activeClient.id)
    updateDocumentNonBlocking(docRef, { ...clientForm, updatedAt: serverTimestamp() })
    setIsEditOpen(false)
    toast({ title: "Client Updated", description: "Changes have been saved successfully." })
  }

  const handleDelete = (id: string) => {
    if (!user || !firestore) return
    const docRef = doc(firestore, 'organizations', user.uid, 'clients', id)
    deleteDocumentNonBlocking(docRef)
    toast({ title: "Client Deleted", description: "The client has been removed from your directory." })
  }

  const viewInvoices = (clientId: string) => {
    router.push(`/dashboard/invoices`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your customer directory and billing details.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90" onClick={() => setClientForm({ name: "", email: "", address: "" })}>
              <Plus className="size-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Enter the details for your new professional contact.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="e.g. Jane Doe" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="jane@example.com" value={clientForm.email} onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })} className="h-12 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Billing Address</Label>
                <Input id="address" placeholder="123 Main St, City, Country" value={clientForm.address} onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })} className="h-12 rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddClient} className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl">Save Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the information for {activeClient?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" value={clientForm.name} onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })} className="h-12 rounded-xl" />
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
            <Button onClick={handleUpdateClient} className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl">Update Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative bg-white p-2 rounded-xl border shadow-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search clients..." className="pl-10 border-none shadow-none focus-visible:ring-0" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-muted-foreground">Architecting directory...</div>
      ) : filteredClients.length > 0 ? (
        <Card className="overflow-hidden border-none shadow-lg rounded-2xl">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold">Client Name</TableHead>
                  <TableHead className="font-bold">Email Address</TableHead>
                  <TableHead className="font-bold">Billing Address</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="size-3 text-muted-foreground" />
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3 text-muted-foreground" />
                        {client.address}
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
                          <DropdownMenuItem onClick={() => viewInvoices(client.id)}><FileText className="size-4 mr-2" /> View Invoices</DropdownMenuItem>
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
          <h3 className="text-lg font-bold">Your Client Directory is Empty</h3>
          <p className="text-sm text-muted-foreground mb-6">Add your first client to start architecting invoices.</p>
          <Button onClick={() => setIsAddOpen(true)} className="bg-accent hover:bg-accent/90">Add First Client</Button>
        </div>
      )}
    </div>
  )
}
