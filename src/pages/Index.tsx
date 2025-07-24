import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VoiceInterface } from "@/components/voice/VoiceInterface";
import { TicketManagement } from "@/components/tickets/TicketManagement";
import { EventRecommendations } from "@/components/events/EventRecommendations";
import { FeedbackAnalytics } from "@/components/analytics/FeedbackAnalytics";
import { HallBooking } from "@/components/halls/HallBooking";
import { CCTVRequest } from "@/components/security/CCTVRequest";
import { CommunityReminders } from "@/components/reminders/CommunityReminders";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  LogOut, 
  Mic, 
  Ticket, 
  Calendar, 
  BarChart3, 
  Eye,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  MapPin,
  Video,
  Bell,
  X
} from "lucide-react";

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const [tickets, setTickets] = useState([
    {
      id: '2035',
      title: 'Air conditioning not working in apartment 5B',
      description: 'The AC has been making strange noises and not cooling properly for the past two days.',
      priority: 'P2' as const,
      status: 'In Progress' as const,
      category: 'Maintenance',
      location: 'Apartment 5B',
      createdAt: new Date('2024-01-15'),
      assignedTo: 'Mike Johnson'
    },
    {
      id: '2034',
      title: 'Leaky faucet in the community gym',
      description: 'The faucet in the men\'s restroom of the community gym has been leaking constantly.',
      priority: 'P3' as const,
      status: 'Open' as const,
      category: 'Maintenance',
      location: 'Community Gym',
      createdAt: new Date('2024-01-14'),
      assignedTo: null
    },
    {
      id: '2033',
      title: 'Noise complaint from apartment 12A',
      description: 'Received a noise complaint from apartment 12A regarding loud music after 10 PM.',
      priority: 'P3' as const,
      status: 'Resolved' as const,
      category: 'Security',
      location: 'Apartment 12A',
      createdAt: new Date('2024-01-13'),
      assignedTo: 'Officer Davis',
      resolvedAt: new Date('2024-01-14')
    },
    {
      id: '2032',
      title: 'Broken glass in the playground area',
      description: 'There is broken glass near the swings in the playground area, posing a safety hazard.',
      priority: 'P1' as const,
      status: 'In Progress' as const,
      category: 'Maintenance',
      location: 'Playground Area',
      createdAt: new Date('2024-01-12'),
      assignedTo: 'Janitor Smith'
    },
    {
      id: '2031',
      title: 'Request for additional lighting in the parking lot',
      description: 'Residents have requested additional lighting in the parking lot due to safety concerns.',
      priority: 'P2' as const,
      status: 'Open' as const,
      category: 'Security',
      location: 'Parking Lot',
      createdAt: new Date('2024-01-11'),
      assignedTo: null
    }
  ]);

  const [selectedEvents, setSelectedEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 'fb1',
      eventId: 'event-1',
      eventTitle: 'Rooftop Sunset Yoga',
      rating: 5 as const,
      feedback: 'Amazing experience! The sunset views were breathtaking and the instructor was wonderful.',
      feedbackType: 'text' as const,
      category: 'positive' as const,
      submittedAt: new Date('2024-01-10')
    },
    {
      id: 'fb2',
      eventId: 'event-2',
      eventTitle: 'Community Movie Night',
      rating: 4 as const,
      feedback: 'The movie selection was great, but the sound system could use an upgrade.',
      feedbackType: 'text' as const,
      category: 'neutral' as const,
      submittedAt: new Date('2024-01-09')
    },
    {
      id: 'fb3',
      eventId: 'event-3',
      eventTitle: 'Kids Art Workshop',
      rating: 5 as const,
      feedback: 'My kids had a blast! The art supplies were high quality and the staff was very friendly.',
      feedbackType: 'text' as const,
      category: 'positive' as const,
      submittedAt: new Date('2024-01-08')
    },
    {
      id: 'fb4',
      eventId: 'event-1',
      eventTitle: 'Rooftop Sunset Yoga',
      rating: 3 as const,
      feedback: 'It was too crowded and difficult to find a good spot. Maybe limit the number of participants next time?',
      feedbackType: 'text' as const,
      category: 'negative' as const,
      submittedAt: new Date('2024-01-07')
    },
    {
      id: 'fb5',
      eventId: 'event-2',
      eventTitle: 'Community Movie Night',
      rating: 4 as const,
      feedback: 'Enjoyed the movie and the snacks, but the seating arrangement was a bit uncomfortable.',
      feedbackType: 'text' as const,
      category: 'neutral' as const,
      submittedAt: new Date('2024-01-06')
    }
  ]);

  // Mock building facilities
  const buildingFacilities = [
    { name: 'Swimming Pool', icon: '🏊', status: 'available' },
    { name: 'Gym', icon: '💪', status: 'available' }, 
    { name: 'Community Hall', icon: '🏛️', status: 'occupied' },
    { name: 'Rooftop Garden', icon: '🌱', status: 'available' },
    { name: 'Kids Play Area', icon: '🎮', status: 'available' },
    { name: 'Parking', icon: '🚗', status: 'available' }
  ];

  const handleVoiceCommand = (command, data) => {
    const event = new CustomEvent('voiceCommand', { detail: { command, data } });
    window.dispatchEvent(event);
    
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

  const handleCreateTicket = (newTicket) => {
    const ticket = {
      ...newTicket,
      id: Date.now().toString().slice(-4),
      createdAt: new Date()
    };
    setTickets(prev => [ticket, ...prev]);
  };

  const handleUpdateTicket = (id, updates) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    ));
  };

  const handleSelectEvent = (event) => {
    setSelectedEvents(prev => {
      const exists = prev.find(e => e.id === event.id);
      if (exists) return prev;
      return [...prev, event];
    });
  };

  const handleSubmitFeedback = (feedback) => {
    const newFeedback = {
      ...feedback,
      id: Date.now().toString(),
      submittedAt: new Date()
    };
    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-purple flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-primary rounded-full animate-pulse"></div>
          <p className="text-primary-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-purple">
      {/* Header */}
      <header className="bg-accent/20 backdrop-blur-sm border-b border-accent/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-yellow-green rounded-full flex items-center justify-center">
                <div className="text-2xl">🏢</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">Welcome to Vaani Community Hub</h1>
                <p className="text-sm text-primary-foreground/80">Speak it up, Fix it Smart</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="bg-voice-active/20 border-voice-active text-primary-foreground">
                <Mic className="h-4 w-4 mr-2" />
                Voice Ready
              </Button>
              <Badge variant="secondary" className="bg-accent/30 text-primary-foreground">
                <Users className="h-3 w-3 mr-1" />
                235 residents
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="bg-secondary/20 border-secondary text-primary-foreground hover:bg-secondary/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        <h2 className="text-4xl font-bold text-accent-foreground mb-4">
          Speak it up, Fix it Smart
        </h2>
        <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
          Experience the seamless fulfillment of complex tasks through simple commands
        </p>
      </div>

      {/* Main Content - Feature Cards Grid */}
      <main className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {/* Voice Assistant Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('voice')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Mic className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Voice Assistant</h3>
            </CardContent>
          </Card>

          {/* Support Tickets Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('tickets')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Ticket className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Support Tickets</h3>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('events')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Events</h3>
            </CardContent>
          </Card>

          {/* Analytics Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('analytics')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Analytics</h3>
            </CardContent>
          </Card>

          {/* Overview Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('overview')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Overview</h3>
            </CardContent>
          </Card>

          {/* Vacant Hall Booking Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('halls')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Vacant Hall Booking</h3>
            </CardContent>
          </Card>

          {/* CCTV Footage Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('cctv')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Video className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">CCTV Footage</h3>
            </CardContent>
          </Card>

          {/* Reminders Card */}
          <Card className="bg-gradient-yellow-green border-accent hover:shadow-xl transition-all cursor-pointer group" onClick={() => setActivePanel('reminders')}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent-foreground/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Bell className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Reminders</h3>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button className="h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl">
            Share with us if our help reached you
          </Button>
          <Button className="h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl">
            Helpline Contacts
          </Button>
          <Button className="h-16 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl">
            Your Eco Well Being
          </Button>
        </div>

        {/* Modal Panels */}
        <Dialog open={!!activePanel} onOpenChange={() => setActivePanel(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gradient-yellow-green border-accent">
            <DialogHeader>
              <DialogTitle className="text-accent-foreground flex items-center gap-2">
                {activePanel === 'voice' && <><Mic className="h-5 w-5" /> Voice Assistant</>}
                {activePanel === 'tickets' && <><Ticket className="h-5 w-5" /> Support Tickets</>}
                {activePanel === 'events' && <><Calendar className="h-5 w-5" /> Events</>}
                {activePanel === 'analytics' && <><BarChart3 className="h-5 w-5" /> Analytics</>}
                {activePanel === 'overview' && <><Eye className="h-5 w-5" /> Overview</>}
                {activePanel === 'halls' && <><MapPin className="h-5 w-5" /> Hall Booking</>}
                {activePanel === 'cctv' && <><Video className="h-5 w-5" /> CCTV Footage</>}
                {activePanel === 'reminders' && <><Bell className="h-5 w-5" /> Reminders</>}
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-4 top-4 text-accent-foreground hover:bg-accent-foreground/20"
                onClick={() => setActivePanel(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            
            <div className="mt-6">
              {activePanel === 'voice' && (
                <VoiceInterface onCommand={handleVoiceCommand} />
              )}
              
              {activePanel === 'tickets' && (
                <TicketManagement 
                  tickets={tickets} 
                  onCreateTicket={handleCreateTicket}
                  onUpdateTicket={handleUpdateTicket}
                />
              )}
              
              {activePanel === 'events' && (
                <EventRecommendations 
                  facilities={buildingFacilities.map(f => f.name)}
                  pastEvents={[]}
                  onSelectEvent={handleSelectEvent}
                />
              )}
              
              {activePanel === 'analytics' && (
                <FeedbackAnalytics 
                  feedbacks={feedbacks}
                  onSubmitFeedback={handleSubmitFeedback}
                />
              )}
              
              {activePanel === 'halls' && (
                <HallBooking onBookHall={(hallId) => {
                  toast({
                    title: "Hall booking request submitted",
                    description: "You will receive confirmation within 2 hours",
                  });
                }} />
              )}
              
              {activePanel === 'cctv' && (
                <CCTVRequest onSubmitRequest={(request) => {
                  toast({
                    title: "CCTV request submitted",
                    description: "Request ID: " + Date.now().toString().slice(-6),
                  });
                }} />
              )}
              
              {activePanel === 'reminders' && (
                <CommunityReminders />
              )}
              
              {activePanel === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-accent-foreground/10 border-accent-foreground/20">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-accent-foreground">Active Tickets</CardTitle>
                        <Ticket className="h-4 w-4 text-accent-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent-foreground">{tickets.filter(t => t.status !== 'Resolved').length}</div>
                        <p className="text-xs text-accent-foreground/70">
                          {tickets.filter(t => t.priority === 'P1').length} high priority
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-accent-foreground/10 border-accent-foreground/20">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-accent-foreground">Upcoming Events</CardTitle>
                        <Calendar className="h-4 w-4 text-accent-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent-foreground">8</div>
                        <p className="text-xs text-accent-foreground/70">
                          3 this week
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent-foreground/10 border-accent-foreground/20">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-accent-foreground">Community Activity</CardTitle>
                        <TrendingUp className="h-4 w-4 text-accent-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent-foreground">92%</div>
                        <p className="text-xs text-accent-foreground/70">
                          +2.1% from last week
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-accent-foreground/10 border-accent-foreground/20">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-accent-foreground">Satisfaction</CardTitle>
                        <CheckCircle className="h-4 w-4 text-accent-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent-foreground">4.8</div>
                        <p className="text-xs text-accent-foreground/70">
                          Average rating
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card className="bg-accent-foreground/10 border-accent-foreground/20">
                    <CardHeader>
                      <CardTitle className="text-accent-foreground">Recent Activity</CardTitle>
                      <CardDescription className="text-accent-foreground/70">Latest updates in your community</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-voice-active rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-accent-foreground">New ticket #2035 created - AC maintenance</p>
                          <p className="text-xs text-accent-foreground/70">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-accent-foreground">Ticket #2033 resolved - Noise complaint</p>
                          <p className="text-xs text-accent-foreground/70">1 day ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm text-accent-foreground">Community yoga event scheduled</p>
                          <p className="text-xs text-accent-foreground/70">2 days ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Building Facilities */}
                  <Card className="bg-accent-foreground/10 border-accent-foreground/20">
                    <CardHeader>
                      <CardTitle className="text-accent-foreground">Building Facilities</CardTitle>
                      <CardDescription className="text-accent-foreground/70">Current status of community amenities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {buildingFacilities.map((facility, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-accent-foreground/5 rounded-lg">
                            <span className="text-2xl">{facility.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-accent-foreground">{facility.name}</p>
                              <Badge 
                                variant={facility.status === 'available' ? 'secondary' : 'outline'}
                                className="text-xs"
                              >
                                {facility.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;
