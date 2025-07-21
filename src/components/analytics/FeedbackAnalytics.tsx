import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Star, TrendingUp, MessageCircle, Users, ThumbsUp, ThumbsDown, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface EventFeedback {
  id: string;
  eventId: string;
  eventTitle: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback: string;
  feedbackType: 'voice' | 'text' | 'rating';
  submittedAt: Date;
  category: 'positive' | 'negative' | 'neutral' | 'suggestion';
}

interface FeedbackAnalyticsProps {
  feedbacks: EventFeedback[];
  onSubmitFeedback: (feedback: Omit<EventFeedback, 'id' | 'submittedAt'>) => void;
}

export const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({
  feedbacks,
  onSubmitFeedback
}) => {
  const [newFeedback, setNewFeedback] = useState({
    eventId: '',
    eventTitle: '',
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    feedback: '',
    feedbackType: 'text' as 'voice' | 'text' | 'rating',
    category: 'positive' as 'positive' | 'negative' | 'neutral' | 'suggestion'
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const { toast } = useToast();

  // Analytics calculations
  const averageRating = feedbacks.length > 0 
    ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
    : 0;

  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: feedbacks.filter(f => f.rating === rating).length,
    percentage: feedbacks.length > 0 ? (feedbacks.filter(f => f.rating === rating).length / feedbacks.length) * 100 : 0
  }));

  const categoryDistribution = [
    { name: 'Positive', value: feedbacks.filter(f => f.category === 'positive').length, color: '#10B981' },
    { name: 'Negative', value: feedbacks.filter(f => f.category === 'negative').length, color: '#EF4444' },
    { name: 'Neutral', value: feedbacks.filter(f => f.category === 'neutral').length, color: '#6B7280' },
    { name: 'Suggestions', value: feedbacks.filter(f => f.category === 'suggestion').length, color: '#3B82F6' }
  ];

  const eventPopularity = feedbacks.reduce((acc, feedback) => {
    const existingEvent = acc.find(e => e.eventId === feedback.eventId);
    if (existingEvent) {
      existingEvent.feedbackCount += 1;
      existingEvent.totalRating += feedback.rating;
      existingEvent.averageRating = existingEvent.totalRating / existingEvent.feedbackCount;
    } else {
      acc.push({
        eventId: feedback.eventId,
        eventTitle: feedback.eventTitle,
        feedbackCount: 1,
        totalRating: feedback.rating,
        averageRating: feedback.rating
      });
    }
    return acc;
  }, [] as Array<{eventId: string, eventTitle: string, feedbackCount: number, totalRating: number, averageRating: number}>)
  .sort((a, b) => b.averageRating - a.averageRating);

  const recentEvents = [
    'Rooftop Sunset Yoga',
    'Community Game Night', 
    'Garden Herb Workshop',
    'Movie Night Under Stars',
    'Building Safety Presentation'
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFeedback.eventTitle || !newFeedback.feedback) {
      toast({
        title: "Missing Information",
        description: "Please select an event and provide feedback.",
        variant: "destructive",
      });
      return;
    }

    // Auto-categorize feedback based on content
    const feedbackText = newFeedback.feedback.toLowerCase();
    let category: 'positive' | 'negative' | 'neutral' | 'suggestion' = newFeedback.category;
    
    if (feedbackText.includes('great') || feedbackText.includes('excellent') || feedbackText.includes('love')) {
      category = 'positive';
    } else if (feedbackText.includes('bad') || feedbackText.includes('poor') || feedbackText.includes('disappointing')) {
      category = 'negative';
    } else if (feedbackText.includes('suggest') || feedbackText.includes('idea') || feedbackText.includes('could')) {
      category = 'suggestion';
    }

    onSubmitFeedback({
      ...newFeedback,
      eventId: `event-${Date.now()}`,
      category
    });

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your feedback! It helps us improve our community events.",
    });

    setNewFeedback({
      eventId: '',
      eventTitle: '',
      rating: 5,
      feedback: '',
      feedbackType: 'text',
      category: 'positive'
    });
    setShowFeedbackForm(false);
  };

  const handleVoiceFeedback = () => {
    setIsRecordingVoice(!isRecordingVoice);
    
    if (!isRecordingVoice) {
      // Start voice recording (mock implementation)
      toast({
        title: "Voice Recording Started",
        description: "Speak your feedback now. Click again to stop.",
      });
      
      // In a real implementation, this would use speech recognition
      setTimeout(() => {
        setNewFeedback({
          ...newFeedback,
          feedback: "The yoga session was amazing! Great instructor and beautiful views from the terrace.",
          feedbackType: 'voice' as 'voice' | 'text' | 'rating'
        });
        setIsRecordingVoice(false);
        toast({
          title: "Voice Feedback Captured",
          description: "Your voice feedback has been transcribed.",
        });
      }, 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Feedback</p>
                <p className="text-2xl font-bold">{feedbacks.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Positive Feedback</p>
                <p className="text-2xl font-bold text-success">
                  {Math.round((categoryDistribution[0].value / (feedbacks.length || 1)) * 100)}%
                </p>
              </div>
              <ThumbsUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Events Rated</p>
                <p className="text-2xl font-bold">{eventPopularity.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Submit Event Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button onClick={() => setShowFeedbackForm(!showFeedbackForm)}>
              Write Feedback
            </Button>
            <Button variant="voice" onClick={handleVoiceFeedback} disabled={isRecordingVoice}>
              <Mic className={`h-4 w-4 mr-2 ${isRecordingVoice ? 'animate-pulse' : ''}`} />
              {isRecordingVoice ? 'Recording...' : 'Voice Feedback'}
            </Button>
          </div>

          {showFeedbackForm && (
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Event</label>
                  <Select 
                    value={newFeedback.eventTitle} 
                    onValueChange={(value) => setNewFeedback({ ...newFeedback, eventTitle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {recentEvents.map((event) => (
                        <SelectItem key={event} value={event}>{event}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewFeedback({ ...newFeedback, rating: rating as any })}
                        className={`p-1 ${rating <= newFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Your Feedback</label>
                <Textarea
                  value={newFeedback.feedback}
                  onChange={(e) => setNewFeedback({ ...newFeedback, feedback: e.target.value })}
                  placeholder="Share your thoughts about the event..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Submit Feedback</Button>
                <Button type="button" variant="outline" onClick={() => setShowFeedbackForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.rating} Star</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={item.percentage} className="w-20" />
                    <span className="text-sm">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Popularity Ranking */}
      <Card>
        <CardHeader>
          <CardTitle>Event Popularity Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {eventPopularity.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No event feedback available yet. Submit feedback to see analytics!
              </p>
            ) : (
              eventPopularity.map((event, index) => (
                <div key={event.eventId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.eventTitle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.feedbackCount} feedback{event.feedbackCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{event.averageRating.toFixed(1)}</span>
                    </div>
                    <Badge variant={event.averageRating >= 4 ? 'success' : event.averageRating >= 3 ? 'warning' : 'destructive'}>
                      {event.averageRating >= 4 ? 'Excellent' : event.averageRating >= 3 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};