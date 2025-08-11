import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle, User, MapPin, Wrench, Camera, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  image_url?: string;
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'P3' as 'P1' | 'P2' | 'P3' | 'P4',
    status: 'Open' as 'Open' | 'Assigned' | 'In Progress' | 'Resolved',
    category: '',
    location: '',
    assignedTo: '',
    image_url: ''
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

  const uploadTicketImage = async (file: File, ticketId: string) => {
    if (!user) return null;

    try {
      setUploading(true);
      
      // Upload image to Supabase Storage bucket
      const { data, error } = await supabase.storage
        .from('ticket-images')
        .upload(`images/${ticketId}/${file.name}`, file);

      if (error) {
        console.error('Image upload error:', error);
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      // Get public URL for the uploaded image
      const imageUrl = supabase.storage.from('ticket-images').getPublicUrl(data.path).data.publicUrl;
      
      return imageUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setNewTicket({ ...newTicket, image_url: '' });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title || !newTicket.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let imageUrl = '';
    if (selectedImage) {
      const tempTicketId = Date.now().toString();
      imageUrl = await uploadTicketImage(selectedImage, tempTicketId) || '';
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

    onCreateTicket({ ...newTicket, priority, image_url: imageUrl });
    
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
      assignedTo: '',
      image_url: ''
    });
    removeImage();
    setShowCreateForm(false);
  };

  const handleVoiceTicketCreation = (description: string) => {
    const meta: any = (user as any)?.user_metadata || {};
    const displayName = meta.display_name || user?.email || 'Resident';
    const apartment = meta.apartment_number || meta.apartment || '';
    const voiceLocation = apartment ? `Apartment ${apartment}` : 'Unknown location';

    const short = description.trim().slice(0, 60);
    const lower = description.toLowerCase();

    // Determine priority based on seriousness
    const criticalKeywords = ['emergency','fire','smoke','gas leak','flood','injury','medical','break-in','security threat','electric shock'];
    const highKeywords = ['ac','air conditioning','heating','elevator','water leak','power outage','no power','lift','plumbing','leak'];
    const isCritical = criticalKeywords.some(k => lower.includes(k));
    const isHigh = highKeywords.some(k => lower.includes(k));
    let priority: 'P1' | 'P2' | 'P3' | 'P4' = isCritical ? 'P1' : isHigh ? 'P2' : 'P3';

    // Determine category
    let category: string = 'Maintenance';
    if (['noise','neighbor','music','loud'].some(k => lower.includes(k))) category = 'Noise Complaint';
    else if (['security','theft','intruder','break-in'].some(k => lower.includes(k))) category = 'Security';

    const voiceTicket: Omit<Ticket, 'id' | 'createdAt'> = {
      title: `Issue from ${displayName}${apartment ? ` (Apt ${apartment})` : ''}: ${short}${description.length > 60 ? '...' : ''}`,
      description,
      priority,
      status: 'Open',
      category,
      location: voiceLocation,
      assignedTo: '',
      image_url: ''
    };

    onCreateTicket(voiceTicket);
    toast({
      title: 'Ticket Created via Voice',
      description: 'Your complaint has been recorded.',
    });
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

              <div>
                <Label>Attach Image (Optional)</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label 
                      htmlFor="image-upload" 
                      className="flex items-center gap-2 cursor-pointer bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md text-sm"
                    >
                      <Camera className="h-4 w-4" />
                      {selectedImage ? 'Change Image' : 'Add Image'}
                    </Label>
                    {selectedImage && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-xs h-32 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Creating...' : 'Create Ticket'}
                </Button>
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
                      {ticket.image_url && (
                        <div className="mt-2">
                          <img 
                            src={ticket.image_url} 
                            alt="Ticket attachment" 
                            className="max-w-xs h-24 object-cover rounded-md border"
                          />
                        </div>
                      )}
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