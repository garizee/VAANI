import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Settings,
  Home,
  PieChart,
  Phone,
  Wifi
} from "lucide-react";

const Index = () => {
  const { user, signOut, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('overview');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

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
    
    setIsVoiceActive(true);
    
    if (command === 'suggest_events') {
      toast({
        title: "Event Suggestions",
        description: "Check the Events tab for personalized recommendations!",
      });
      setCurrentView('events');
    } else if (command === 'collect_feedback') {
      toast({
        title: "Feedback Collected",
        description: "Your feedback has been recorded. Thank you!",
      });
      setCurrentView('analytics');
    } else if (command === 'create_complaint') {
      toast({
        title: "Creating Support Ticket",
        description: "Opening ticket management for you...",
      });
      setCurrentView('tickets');
    } else if (command === 'check_ticket_status') {
      toast({
        title: "Checking Ticket Status",
        description: `Looking up ticket #${data?.ticketId || 'Unknown'}`,
      });
      setCurrentView('tickets');
    }
    
    // Auto-disable voice after command
    setTimeout(() => setIsVoiceActive(false), 3000);
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
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-purple border-r border-accent/30 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-accent/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-yellow-green rounded-lg flex items-center justify-center">
              <div className="text-xl">🏢</div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">Welcome!</h1>
              <p className="text-sm text-primary-foreground/60">Vaani</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={currentView === 'overview' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('overview')}
          >
            <Home className="h-4 w-4 mr-3" />
            Overview
          </Button>
          <Button
            variant={currentView === 'voice' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('voice')}
          >
            <Mic className="h-4 w-4 mr-3" />
            Voice Assistant
          </Button>
          <Button
            variant={currentView === 'tickets' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('tickets')}
          >
            <Ticket className="h-4 w-4 mr-3" />
            Support Tickets
          </Button>
          <Button
            variant={currentView === 'events' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('events')}
          >
            <Calendar className="h-4 w-4 mr-3" />
            Events
          </Button>
          <Button
            variant={currentView === 'analytics' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('analytics')}
          >
            <BarChart3 className="h-4 w-4 mr-3" />
            Analytics
          </Button>
          <Button
            variant={currentView === 'halls' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('halls')}
          >
            <MapPin className="h-4 w-4 mr-3" />
            Hall Booking
          </Button>
          <Button
            variant={currentView === 'cctv' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('cctv')}
          >
            <Video className="h-4 w-4 mr-3" />
            CCTV Footage
          </Button>
          <Button
            variant={currentView === 'reminders' ? 'secondary' : 'ghost'}
            className="w-full justify-start text-primary-foreground hover:bg-accent/20"
            onClick={() => setCurrentView('reminders')}
          >
            <Bell className="h-4 w-4 mr-3" />
            Reminders
          </Button>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary-foreground">User</p>
                <p className="text-xs text-primary-foreground/60">Resident</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleSignOut}
              className="text-primary-foreground hover:bg-accent/20"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-accent/10 border-b border-accent/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {currentView === 'overview' && 'Overview'}
                {currentView === 'voice' && 'Voice Assistant'}
                {currentView === 'tickets' && 'Support Tickets'}
                {currentView === 'events' && 'Events'}
                {currentView === 'analytics' && 'Analytics'}
                {currentView === 'halls' && 'Hall Booking'}
                {currentView === 'cctv' && 'CCTV Footage'}
                {currentView === 'reminders' && 'Reminders'}
              </h1>
              <p className="text-muted-foreground">Speak it up, Fix it Smart</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-accent/30 text-accent-foreground">
                <Users className="h-3 w-3 mr-1" />
                235 residents
              </Badge>
              <Button 
                variant={isVoiceActive ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  setIsVoiceActive(!isVoiceActive);
                  if (!isVoiceActive) {
                    setCurrentView('voice');
                  }
                }}
                className={`${isVoiceActive 
                  ? 'bg-voice-active text-voice-active-foreground shadow-voice animate-pulse' 
                  : 'bg-voice-inactive/20 border-voice-inactive text-voice-inactive hover:bg-voice-active/30'
                } transition-all duration-300`}
              >
                <Mic className="h-3 w-3 mr-1" />
                {isVoiceActive ? 'Voice Active' : 'Voice Ready'}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 bg-gradient-yellow-green">{renderCurrentView()}</main>
      </div>
    </div>
  );

  function renderCurrentView() {
    switch (currentView) {
      case 'overview':
        return <OverviewView />;
      case 'voice':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <VoiceInterface 
              onCommand={handleVoiceCommand}
              onTranscript={(transcript) => {
                console.log('Voice transcript:', transcript);
              }}
            />
          </div>
        );
      case 'tickets':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <TicketManagement 
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onUpdateTicket={handleUpdateTicket}
            />
          </div>
        );
      case 'events':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <EventRecommendations 
              onSelectEvent={handleSelectEvent}
              pastEvents={[]}
              facilities={buildingFacilities?.map(f => f?.name).filter(Boolean) || []}
            />
          </div>
        );
      case 'analytics':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <FeedbackAnalytics 
              feedbacks={feedbacks}
              onSubmitFeedback={handleSubmitFeedback}
            />
          </div>
        );
      case 'halls':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <HallBooking />
          </div>
        );
      case 'cctv':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <CCTVRequest />
          </div>
        );
      case 'reminders':
        return (
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <CommunityReminders />
          </div>
        );
      default:
        return <OverviewView />;
    }
  }

  function OverviewView() {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Residents</p>
                  <p className="text-2xl font-bold text-foreground">235</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Tickets</p>
                  <p className="text-2xl font-bold text-foreground">{tickets.filter(t => t.status !== 'Resolved').length}</p>
                </div>
                <Ticket className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Events This Month</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <Calendar className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Satisfaction</p>
                  <p className="text-2xl font-bold text-foreground">4.8★</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Building Facilities */}
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Building Facilities</CardTitle>
            <CardDescription>Current status of community amenities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {buildingFacilities.map((facility, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-card border">
                  <div className="text-3xl mb-2">{facility.icon}</div>
                  <p className="text-sm font-medium text-foreground">{facility.name}</p>
                  <Badge 
                    variant={facility.status === 'available' ? 'success' : 'warning'}
                    className="mt-2"
                  >
                    {facility.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tickets.slice(0, 3).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg bg-card border">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">{ticket.location}</p>
                    </div>
                  </div>
                  <Badge variant={
                    ticket.status === 'Resolved' ? 'success' : 
                    ticket.status === 'In Progress' ? 'warning' : 'secondary'
                  }>
                    {ticket.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default Index;
