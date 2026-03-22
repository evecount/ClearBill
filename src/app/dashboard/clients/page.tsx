
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_CLIENTS as INITIAL_CLIENTS } from "@/lib/mock-data"
import { Plus, Search, Mail, MapPin, MoreVertical, Trash2, Edit2, FileText, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ClientsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [clients, setClients] = useState(INITIAL_CLIENTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<any>(null)
  const [clientForm, setClientForm] = useState({ name: "", email: "", address: "" })

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClient = () => {
    if (!clientForm.name || !clientForm.email) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" })
      return
    }

    const client = {
      id: `client_${Date.now()}`,
      orgId: 'org_123',
      ...clientForm
    }

    setClients([client, ...clients])
    setClientForm({ name: "", email: "", address: "" })
    setIsAddOpen(false)
    toast({ title: "Client Added", description: `${client.name} has been added to your directory.` })
  }

  const handleEditClick = (client: any) => {
    setActiveClient(client)
    setClientForm({ name: client.name, email: client.email, address: client.address })
    setIsEditOpen(true)
  }

  const handleUpdateClient = () => {
    setClients(clients.map(c => c.id === activeClient.id ? { ...c, ...clientForm } : c))
    setIsEditOpen(false)
    toast({ title: "Client Updated", description: "Changes have been saved successfully." })
  }

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id))
    toast({ title: "Client Deleted", description: "The client has been removed from your directory." })
  }

  const viewInvoices = (clientName: string) => {
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
            <Button className="bg-accent hover:bg-accent/90 hidden md:flex" onClick={() => setClientForm({ name: "", email: "", address: "" })}>
              <Plus className="size-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-t-3xl sm:rounded-3xl">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Enter the details for your new customer.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Jane Doe" 
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="jane@example.com" 
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Billing Address</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St, City, Country" 
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddClient} className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl">Save Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="rounded-t-3xl sm:rounded-3xl">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>Update the information for {activeClient?.name}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={clientForm.name}
                onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input 
                id="edit-email" 
                value={clientForm.email}
                onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Billing Address</Label>
              <Input 
                id="edit-address" 
                value={clientForm.address}
                onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateClient} className="w-full h-12 bg-accent hover:bg-accent/90 rounded-xl">Update Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="relative flex-1 bg-white p-2 rounded-xl border shadow-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input 
          placeholder="Search clients..." 
          className="pl-10 border-none shadow-none focus-visible:ring-0" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Mobile Card List */}
      <div className="grid gap-4 md:hidden pb-12">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <Card key={client.id} className="overflow-hidden border-none shadow-md">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <User className="size-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditClick(client)}>
                      <Edit2 className="size-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => viewInvoices(client.name)}>
                      <FileText className="size-4 mr-2" /> Invoices
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="size-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-muted-foreground bg-white rounded-2xl border border-dashed">
            No clients found.
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden border-none shadow-lg rounded-2xl">
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
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
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
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditClick(client)}>
                            <Edit2 className="size-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => viewInvoices(client.name)}>
                            <FileText className="size-4 mr-2" /> View Invoices
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(client.id)}
                          >
                            <Trash2 className="size-4 mr-2" /> Delete Client
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
