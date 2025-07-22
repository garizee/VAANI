import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { VoiceInterface } from '@/components/voice/VoiceInterface';
import { TicketManagement, Ticket } from '@/components/tickets/TicketManagement';
import { EventRecommendations, CommunityEvent } from '@/components/events/EventRecommendations';
import { FeedbackAnalytics, EventFeedback } from '@/components/analytics/FeedbackAnalytics';
import { 
  Home, 
  Headphones, 
  Ticket as TicketIcon, 
  Calendar, 
  BarChart3,
  Building2,
  Users,
  Mic
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: '2035',
      title: 'Air conditioning not working in apartment 5B',
      description: 'The AC has been making strange noises and not cooling properly for the past two days.',
      priority: 'P2',
      status: 'In Progress',
      category: 'Maintenance',
      location: 'Apartment 5B',
      createdAt: new Date('2024-01-15'),
      assignedTo: 'Mike Johnson'
    },
    {
      id: '2036',
      title: 'Elevator making loud noise',
      description: 'The main elevator is making grinding sounds when moving between floors 3-5.',
      priority: 'P1',
      status: 'Assigned',
      category: 'Maintenance',
      location: 'Main Elevator',
      createdAt: new Date('2024-01-16'),
      assignedTo: 'Sarah Chen'
    },
    {
      id: '2037',
      title: 'Sewage leaking in basement parking',
      description: 'There is a strong sewage leak near parking spot B-15. The smell is unbearable and water is pooling.',
      priority: 'P1',
      status: 'Open',
      category: 'Plumbing',
      location: 'Basement Parking B-15',
      createdAt: new Date('2024-01-14'),
      assignedTo: 'Plumbing Team'
    },
    {
      id: '2038',
      title: 'Broken electrical panel on 7th floor',
      description: 'The electrical panel cover is hanging loose and some switches are not working properly.',
      priority: 'P1',
      status: 'Assigned',
      category: 'Electrical',
      location: '7th Floor Corridor',
      createdAt: new Date('2024-01-13'),
      assignedTo: 'Electrical Team'
    },
    {
      id: '2039',
      title: 'Lift stuck between 4th and 5th floor',
      description: 'The service elevator has been stuck for 30 minutes. Emergency button pressed but no response.',
      priority: 'P1',
      status: 'In Progress',
      category: 'Emergency',
      location: 'Service Elevator',
      createdAt: new Date('2024-01-17'),
      assignedTo: 'Emergency Response'
    },
    {
      id: '2040',
      title: 'Guard harassment of domestic help',
      description: 'Security guard at main gate has been asking inappropriate questions and delaying entry for domestic helpers.',
      priority: 'P2',
      status: 'Open',
      category: 'Security',
      location: 'Main Gate',
      createdAt: new Date('2024-01-12'),
      assignedTo: 'Security Manager'
    },
    {
      id: '2041',
      title: 'Elevator door not closing properly',
      description: 'The main elevator doors take multiple attempts to close and sometimes open unexpectedly.',
      priority: 'P2',
      status: 'Open',
      category: 'Maintenance',
      location: 'Main Elevator',
      createdAt: new Date('2024-01-11'),
      assignedTo: null
    }
  ]);

  const [selectedEvents, setSelectedEvents] = useState<CommunityEvent[]>([]);
  const [feedbacks, setFeedbacks] = useState<EventFeedback[]>([
    {
      id: 'fb1',
      eventId: 'event-1',
      eventTitle: 'Rooftop Sunset Yoga',
      rating: 5,
      feedback: 'Amazing experience! The sunset views were breathtaking and the instructor was wonderful.',
      feedbackType: 'text',
      category: 'positive',
      submittedAt: new Date('2024-01-10')
    },
    {
      id: 'fb2',
      eventId: 'event-2',
      eventTitle: 'Community Game Night',
      rating: 4,
      feedback: 'Great fun with neighbors. Could use more variety in board games.',
      feedbackType: 'voice',
      category: 'suggestion',
      submittedAt: new Date('2024-01-12')
    }
  ]);

  const { toast } = useToast();

  // Mock building facilities (in real app, this would come from building management system)
  const buildingFacilities = ['terrace', 'lounge', 'garden'];

  const handleVoiceCommand = (command: string, data?: any) => {
    // Dispatch custom event for components to listen to
    const event = new CustomEvent('voiceCommand', { detail: { command, data } });
    window.dispatchEvent(event);
    
    // Handle commands at the main level
    if (command === 'suggest_events') {
      toast({
        title: "Event Suggestions",
        description: "Check the Events tab for personalized recommendations!",
      });
    } else if (command === 'collect_feedback') {
      toast({
        title: "Feedback Collected",
        description: "Your feedback has been recorded. Thank you!",
      });
    }
  };

  const handleCreateTicket = (newTicket: Omit<Ticket, 'id' | 'createdAt'>) => {
    const ticket: Ticket = {
      ...newTicket,
      id: Date.now().toString().slice(-4),
      createdAt: new Date()
    };
    setTickets(prev => [ticket, ...prev]);
  };

  const handleUpdateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    ));
  };

  const handleSelectEvent = (event: CommunityEvent) => {
    setSelectedEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) return prev;
      return [...prev, event];
    });
  };

  const handleSubmitFeedback = (feedback: Omit<EventFeedback, 'id' | 'submittedAt'>) => {
    const newFeedback: EventFeedback = {
      ...feedback,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Community Hub</h1>
                <p className="text-muted-foreground">Virtual Community Manager</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                235 Residents
              </Badge>
              <Badge variant="success" className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                Voice Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="voice" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Voice Assistant
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <TicketIcon className="h-4 w-4" />
              Support Tickets
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          {/* Voice Interface Tab */}
          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <VoiceInterface 
                  onCommand={handleVoiceCommand}
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Tickets</span>
                      <Badge variant="warning">{tickets.filter(t => t.status !== 'Resolved').length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Recent Feedback</span>
                      <Badge variant="success">{feedbacks.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Upcoming Events</span>
                      <Badge variant="default">{selectedEvents.length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tickets Tab */}
          <TabsContent value="tickets">
            <TicketManagement
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onUpdateTicket={handleUpdateTicket}
            />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <EventRecommendations
              facilities={buildingFacilities}
              pastEvents={[]}
              onSelectEvent={handleSelectEvent}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <FeedbackAnalytics
              feedbacks={feedbacks}
              onSubmitFeedback={handleSubmitFeedback}
            />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Residents</p>
                      <p className="text-2xl font-bold">235</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Open Tickets</p>
                      <p className="text-2xl font-bold">{tickets.filter(t => t.status !== 'Resolved').length}</p>
                    </div>
                    <TicketIcon className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Events This Month</p>
                      <p className="text-2xl font-bold">4</p>
                    </div>
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfaction</p>
                      <p className="text-2xl font-bold">4.2★</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border-l-2 border-success">
                    <div className="text-sm">
                      <p className="font-medium">New event: Rooftop Yoga scheduled</p>
                      <p className="text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border-l-2 border-warning">
                    <div className="text-sm">
                      <p className="font-medium">Ticket #2035 updated to In Progress</p>
                      <p className="text-muted-foreground">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border-l-2 border-primary">
                    <div className="text-sm">
                      <p className="font-medium">5 new feedback responses received</p>
                      <p className="text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Voice Recognition</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Building Integration</span>
                    <Badge variant="success">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Omnidim.io Integration</span>
                    <Badge variant="warning">Pending Setup</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                    <p><strong>Note:</strong> For full Omnidim.io voice AI integration, backend setup is required. Current implementation uses Web Speech API as a fallback.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
