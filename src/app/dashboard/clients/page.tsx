
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_CLIENTS as INITIAL_CLIENTS } from "@/lib/mock-data"
import { Plus, Search, Mail, MapPin, MoreVertical, Trash2, Edit2, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function ClientsPage() {
  const { toast } = useToast()
  const [clients, setClients] = useState(INITIAL_CLIENTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newClient, setNewClient] = useState({ name: "", email: "", address: "" })

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast({ title: "Error", description: "Name and email are required.", variant: "destructive" })
      return
    }

    const client = {
      id: `client_${Date.now()}`,
      orgId: 'org_123',
      ...newClient
    }

    setClients([client, ...clients])
    setNewClient({ name: "", email: "", address: "" })
    setIsAddOpen(false)
    toast({ title: "Client Added", description: `${client.name} has been added to your directory.` })
  }

  const handleDelete = (id: string) => {
    setClients(clients.filter(c => c.id !== id))
    toast({ title: "Client Deleted", description: "The client has been removed from your directory." })
  }

  const handleAction = (action: string, clientName: string) => {
    toast({ title: action, description: `Performing ${action.toLowerCase()} for ${clientName}...` })
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
            <Button className="bg-accent hover:bg-accent/90">
              <Plus className="size-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Enter the details for your new customer. They will appear in invoice selections.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Jane Doe" 
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="jane@example.com" 
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Billing Address</Label>
                <Input 
                  id="address" 
                  placeholder="123 Main St, City, Country" 
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddClient} className="bg-accent hover:bg-accent/90">Save Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search clients..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Billing Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                          <DropdownMenuItem onClick={() => handleAction("Edit", client.name)}>
                            <Edit2 className="size-4 mr-2" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction("View Invoices", client.name)}>
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
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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
