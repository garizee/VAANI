import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle, User, MapPin, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
  category: string;
  location: string;
  createdAt: Date;
  assignedTo?: string;
  estimatedResolution?: Date;
}

interface TicketManagementProps {
  tickets: Ticket[];
  onCreateTicket: (ticket: Omit<Ticket, 'id' | 'createdAt'>) => void;
  onUpdateTicket: (id: string, updates: Partial<Ticket>) => void;
}

export const TicketManagement: React.FC<TicketManagementProps> = ({
  tickets,
  onCreateTicket,
  onUpdateTicket
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTicket, setSearchTicket] = useState('');
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'P3' as 'P1' | 'P2' | 'P3' | 'P4',
    status: 'Open' as 'Open' | 'Assigned' | 'In Progress' | 'Resolved',
    category: '',
    location: '',
    assignedTo: ''
  });

  const priorityConfig = {
    P1: { label: 'Critical', color: 'destructive', icon: AlertCircle },
    P2: { label: 'High', color: 'warning', icon: AlertCircle },
    P3: { label: 'Medium', color: 'default', icon: Clock },
    P4: { label: 'Low', color: 'secondary', icon: Clock }
  } as const;

  const statusConfig = {
    Open: { label: 'Open', color: 'secondary', icon: AlertCircle },
    Assigned: { label: 'Assigned', color: 'default', icon: User },
    'In Progress': { label: 'In Progress', color: 'warning', icon: Wrench },
    Resolved: { label: 'Resolved', color: 'success', icon: CheckCircle }
  } as const;

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Auto-assign priority based on keywords
    const description = newTicket.description.toLowerCase();
    let priority: 'P1' | 'P2' | 'P3' | 'P4' = newTicket.priority;
    
    if (description.includes('emergency') || description.includes('urgent') || 
        description.includes('fire') || description.includes('flood')) {
      priority = 'P1';
    } else if (description.includes('AC') || description.includes('heating') || 
               description.includes('elevator')) {
      priority = 'P2';
    }

    onCreateTicket({ ...newTicket, priority });
    
    toast({
      title: "Ticket Created",
      description: `Ticket #${Date.now().toString().slice(-4)} has been created successfully.`,
    });

    setNewTicket({
      title: '',
      description: '',
      priority: 'P3',
      status: 'Open',
      category: '',
      location: '',
      assignedTo: ''
    });
    setShowCreateForm(false);
  };

  const handleVoiceTicketCreation = (description: string) => {
    // Process voice input for ticket creation
    let voiceTicket = {
      title: description.substring(0, 50) + "...",
      description,
      priority: 'P3' as 'P1' | 'P2' | 'P3' | 'P4',
      status: 'Open' as 'Open' | 'Assigned' | 'In Progress' | 'Resolved',
      category: 'Voice Complaint',
      location: 'To be determined',
      assignedTo: ''
    };

    // Auto-assign priority and category based on voice input
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('emergency') || lowerDesc.includes('urgent')) {
      voiceTicket.priority = 'P1';
    } else if (lowerDesc.includes('AC') || lowerDesc.includes('air conditioning') || 
               lowerDesc.includes('heating') || lowerDesc.includes('elevator')) {
      voiceTicket.priority = 'P2';
    }

    if (lowerDesc.includes('maintenance')) voiceTicket.category = 'Maintenance';
    else if (lowerDesc.includes('noise') || lowerDesc.includes('neighbor')) voiceTicket.category = 'Noise Complaint';
    else if (lowerDesc.includes('security')) voiceTicket.category = 'Security';

    onCreateTicket(voiceTicket);
  };

  const findTicketById = (ticketId: string) => {
    return tickets.find(ticket => ticket.id.includes(ticketId));
  };

  const getTicketStatusResponse = (ticketId: string) => {
    const ticket = findTicketById(ticketId);
    if (!ticket) {
      return "I couldn't find a ticket with that number. Please check the ticket ID and try again.";
    }

    const statusInfo = statusConfig[ticket.status];
    return `Ticket ${ticket.id} is currently ${ticket.status.toLowerCase()}. ${
      ticket.assignedTo ? `Assigned to ${ticket.assignedTo}.` : ''
    } Priority level: ${ticket.priority}.`;
  };

  React.useEffect(() => {
    // Listen for voice commands from parent component
    const handleVoiceCommand = (event: CustomEvent) => {
      const { command, data } = event.detail;
      
      if (command === 'create_complaint' && data?.description) {
        handleVoiceTicketCreation(data.description);
      } else if (command === 'check_ticket_status' && data?.ticketId) {
        const response = getTicketStatusResponse(data.ticketId);
        toast({
          title: "Ticket Status",
          description: response,
        });
      }
    };

    window.addEventListener('voiceCommand', handleVoiceCommand as EventListener);
    return () => window.removeEventListener('voiceCommand', handleVoiceCommand as EventListener);
  }, [tickets]);

  return (
    <div className="space-y-6">
      {/* Ticket Search and Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Support Ticket Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search">Search Ticket by ID</Label>
              <Input
                id="search"
                placeholder="Enter ticket ID (e.g., 2035)"
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  const ticket = findTicketById(searchTicket);
                  if (ticket) {
                    toast({
                      title: `Ticket ${ticket.id}`,
                      description: getTicketStatusResponse(searchTicket),
                    });
                  } else {
                    toast({
                      title: "Ticket Not Found",
                      description: "Please check the ticket ID and try again.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!searchTicket}
              >
                Check Status
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant="default"
            >
              Create New Ticket
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Issue Title *</Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newTicket.category} 
                    onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="noise">Noise Complaint</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="utilities">Utilities</SelectItem>
                      <SelectItem value="common-areas">Common Areas</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newTicket.location}
                  onChange={(e) => setNewTicket({ ...newTicket, location: e.target.value })}
                  placeholder="e.g., Apartment 5B, Lobby, Parking Garage"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Ticket</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No tickets found. Create your first ticket or use voice commands to report issues.
              </p>
            ) : (
              tickets.slice(0, 5).map((ticket) => {
                const PriorityIcon = priorityConfig[ticket.priority].icon;
                const StatusIcon = statusConfig[ticket.status].icon;
                
                return (
                  <div key={ticket.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">#{ticket.id}</h4>
                        <Badge variant={priorityConfig[ticket.priority].color as any}>
                          <PriorityIcon className="h-3 w-3 mr-1" />
                          {priorityConfig[ticket.priority].label}
                        </Badge>
                        <Badge variant={statusConfig[ticket.status].color as any}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[ticket.status].label}
                        </Badge>
                      </div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {ticket.location}
                        </span>
                        <span>{ticket.createdAt.toLocaleDateString()}</span>
                        {ticket.assignedTo && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {ticket.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};