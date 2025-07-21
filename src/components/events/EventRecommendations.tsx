import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Users, MapPin, Lightbulb, Copy, Star, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  suggestedDate: Date;
  location: string;
  estimatedAttendees: number;
  category: 'Social' | 'Educational' | 'Wellness' | 'Entertainment' | 'Maintenance';
  facilities: string[];
  promotionScript?: string;
  whatsappMessage?: string;
  reason: string;
}

interface EventRecommendationsProps {
  facilities: string[];
  pastEvents: CommunityEvent[];
  onSelectEvent: (event: CommunityEvent) => void;
}

export const EventRecommendations: React.FC<EventRecommendationsProps> = ({
  facilities,
  pastEvents,
  onSelectEvent
}) => {
  const [recommendedEvents, setRecommendedEvents] = useState<CommunityEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);
  const { toast } = useToast();

  // Mock event suggestions based on facilities and calendar context
  const generateEventSuggestions = () => {
    const currentDate = new Date();
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const currentMonth = currentDate.getMonth();
    
    const baseEvents: Omit<CommunityEvent, 'id' | 'suggestedDate'>[] = [
      {
        title: "Rooftop Sunset Yoga",
        description: "A relaxing yoga session with city views during golden hour. Perfect for stress relief and community bonding.",
        location: facilities.includes('terrace') ? 'Rooftop Terrace' : 'Main Lobby',
        estimatedAttendees: 15,
        category: 'Wellness',
        facilities: ['terrace'],
        reason: "High success rate from past wellness events, utilizing our beautiful terrace space",
        promotionScript: "Join us for a peaceful yoga session as the sun sets over the city. All levels welcome - bring a mat and find your zen!",
        whatsappMessage: "🧘‍♀️ ROOFTOP YOGA TONIGHT! Join us at 6 PM on the terrace for sunset yoga. All levels welcome. Bring a mat! 🌅"
      },
      {
        title: "Community Game Night",
        description: "Board games, card games, and friendly competition in our comfortable lounge area.",
        location: facilities.includes('lounge') ? 'Community Lounge' : 'Lobby Area',
        estimatedAttendees: 20,
        category: 'Social',
        facilities: ['lounge'],
        reason: "Perfect for weekend community building, using available lounge facilities",
        promotionScript: "Dust off your competitive spirit! Join neighbors for an evening of board games, laughter, and friendly rivalry.",
        whatsappMessage: "🎲 GAME NIGHT SATURDAY! Board games, snacks, and fun from 7-10 PM in the lounge. Bring your favorites or play ours! 🃏"
      },
      {
        title: "Garden Herb Workshop",
        description: "Learn to grow herbs in small spaces. Take home starter plants and gardening tips.",
        location: facilities.includes('garden') ? 'Community Garden' : 'Terrace Area',
        estimatedAttendees: 12,
        category: 'Educational',
        facilities: ['garden', 'terrace'],
        reason: "Educational events show high engagement, perfect for spring/summer months",
        promotionScript: "Discover the joy of growing your own herbs! Expert tips, free plants, and green-thumb secrets shared.",
        whatsappMessage: "🌿 HERB WORKSHOP SUNDAY! Learn to grow basil, mint & more in your apartment. Free starter plants! 2 PM in the garden 🌱"
      },
      {
        title: "Movie Night Under Stars",
        description: "Outdoor movie screening with popcorn and cozy blankets. Community votes on the film selection.",
        location: facilities.includes('terrace') ? 'Rooftop Terrace' : 'Community Lounge',
        estimatedAttendees: 25,
        category: 'Entertainment',
        facilities: ['terrace'],
        reason: "Outdoor entertainment events are popular in good weather, high attendance expected",
        promotionScript: "Cinema meets community! Vote for the movie, bring blankets, and enjoy a night under the stars with neighbors.",
        whatsappMessage: "🎬 OUTDOOR MOVIE NIGHT! Vote for the film, we'll provide popcorn & blankets. Friday 8 PM on the terrace! 🍿"
      },
      {
        title: "Building Safety Presentation",
        description: "Fire safety, emergency procedures, and building security updates. Light refreshments provided.",
        location: 'Community Lounge',
        estimatedAttendees: 30,
        category: 'Maintenance',
        facilities: ['lounge'],
        reason: "Important community information session, good turnout expected for safety topics",
        promotionScript: "Stay informed and stay safe! Important updates on building procedures, plus time for your questions and concerns.",
        whatsappMessage: "🚨 SAFETY MEETING TUESDAY! Fire procedures, security updates & Q&A. 7 PM lounge. Refreshments provided! 🛡️"
      }
    ];

    // Filter events based on available facilities and add contextual recommendations
    let filteredEvents = baseEvents.filter(event => 
      event.facilities.every(facility => facilities.includes(facility)) ||
      event.facilities.length === 0
    );

    // Add seasonal/contextual suggestions
    if (currentMonth >= 2 && currentMonth <= 4) { // Spring
      filteredEvents.unshift({
        title: "Spring Cleaning Community Day",
        description: "Organize common areas and share decluttering tips. Community bonding through shared responsibility.",
        location: "Building-wide",
        estimatedAttendees: 18,
        category: 'Maintenance',
        facilities: [],
        reason: "Spring season perfect for community cleaning initiatives",
        promotionScript: "Spring into action! Join neighbors for a building-wide refresh. Many hands make light work!",
        whatsappMessage: "🌸 SPRING CLEANING DAY! Let's freshen up our shared spaces together. Saturday 10 AM. Coffee & donuts provided! 🧽"
      });
    }

    if (isWeekend) {
      filteredEvents = filteredEvents.map(event => ({
        ...event,
        estimatedAttendees: Math.round(event.estimatedAttendees * 1.3), // Higher weekend attendance
        reason: event.reason + " (Weekend timing increases expected attendance)"
      }));
    }

    // Generate with IDs and dates
    return filteredEvents.slice(0, 4).map((event, index) => ({
      ...event,
      id: `event-${Date.now()}-${index}`,
      suggestedDate: new Date(currentDate.getTime() + (index + 1) * 7 * 24 * 60 * 60 * 1000) // Next few weekends
    }));
  };

  useEffect(() => {
    setRecommendedEvents(generateEventSuggestions());
  }, [facilities]);

  const handleSelectEvent = (event: CommunityEvent) => {
    setSelectedEvent(event);
    onSelectEvent(event);
    toast({
      title: "Event Selected",
      description: `${event.title} is now ready for promotion!`,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard.`,
      });
    });
  };

  const getCategoryColor = (category: CommunityEvent['category']) => {
    const colors = {
      Social: 'default',
      Educational: 'secondary',
      Wellness: 'success',
      Entertainment: 'warning',
      Maintenance: 'destructive'
    };
    return colors[category] as any;
  };

  const getCategoryIcon = (category: CommunityEvent['category']) => {
    const icons = {
      Social: Users,
      Educational: Lightbulb,
      Wellness: Star,
      Entertainment: TrendingUp,
      Maintenance: Calendar
    };
    return icons[category];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Event Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Based on available facilities: {facilities.join(', ') || 'Basic common areas'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedEvents.map((event) => {
              const CategoryIcon = getCategoryIcon(event.category);
              
              return (
                <Card key={event.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant={getCategoryColor(event.category)}>
                          <CategoryIcon className="h-3 w-3 mr-1" />
                          {event.category}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSelectEvent(event)}
                        className="ml-2"
                      >
                        Select
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{event.suggestedDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>~{event.estimatedAttendees} expected</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        <strong>Why recommended:</strong> {event.reason}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Event Promotion Assistant */}
      {selectedEvent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Promotion Assistant: {selectedEvent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Announcement Script</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedEvent.promotionScript || '', 'Announcement script')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm">
                  {selectedEvent.promotionScript}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">WhatsApp Message</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedEvent.whatsappMessage || '', 'WhatsApp message')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-lg text-sm font-mono">
                  {selectedEvent.whatsappMessage}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-sm font-medium">Expected Attendance</div>
                  <div className="text-2xl font-bold text-success">{selectedEvent.estimatedAttendees}</div>
                </div>
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-sm font-medium">Category</div>
                  <div className="text-lg font-semibold text-primary">{selectedEvent.category}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};