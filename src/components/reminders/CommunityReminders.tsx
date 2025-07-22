import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertCircle, CheckCircle, Calendar } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  message: string;
  type: "maintenance" | "event" | "notice" | "urgent";
  dateTime: string;
  isRead: boolean;
  priority: "low" | "medium" | "high";
}

const mockReminders: Reminder[] = [
  {
    id: "1",
    title: "Water Supply Maintenance",
    message: "Water supply will be interrupted tomorrow from 10 AM to 2 PM for maintenance work in Block A and B.",
    type: "maintenance",
    dateTime: "2024-01-22 10:00",
    isRead: false,
    priority: "high",
  },
  {
    id: "2",
    title: "Community Meeting",
    message: "Monthly community meeting scheduled for this Saturday at 7 PM in Community Hall A.",
    type: "event",
    dateTime: "2024-01-27 19:00",
    isRead: false,
    priority: "medium",
  },
  {
    id: "3",
    title: "Security Alert",
    message: "Please ensure all vehicles are locked. There have been reports of attempted break-ins in the parking area.",
    type: "urgent",
    dateTime: "2024-01-21 08:00",
    isRead: true,
    priority: "high",
  },
  {
    id: "4",
    title: "Gym Timing Update",
    message: "Gym timings have been extended. New hours: 5 AM to 11 PM, Monday to Sunday.",
    type: "notice",
    dateTime: "2024-01-20 14:30",
    isRead: true,
    priority: "low",
  },
];

interface CommunityRemindersProps {
  onMarkAsRead?: (reminderId: string) => void;
}

export function CommunityReminders({ onMarkAsRead }: CommunityRemindersProps) {
  const [reminders, setReminders] = useState(mockReminders);

  const handleMarkAsRead = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id ? { ...reminder, isRead: true } : reminder
      )
    );
    onMarkAsRead?.(id);
  };

  const getTypeIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "maintenance": return <AlertCircle className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "notice": return <Bell className="h-4 w-4" />;
      case "urgent": return <AlertCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Reminder["type"]) => {
    switch (type) {
      case "maintenance": return "warning";
      case "event": return "default";
      case "notice": return "secondary";
      case "urgent": return "destructive";
      default: return "secondary";
    }
  };

  const getPriorityColor = (priority: Reminder["priority"]) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "warning";
      case "low": return "secondary";
      default: return "secondary";
    }
  };

  const unreadCount = reminders.filter(r => !r.isRead).length;

  return (
    <Card className="bg-gradient-yellow-green border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Bell className="h-5 w-5" />
          Community Reminders
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <CardDescription className="text-card-foreground/70">
          Important reminders and updates about daily activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {reminders.map((reminder) => (
          <div
            key={reminder.id}
            className={`p-4 rounded-lg border transition-all ${
              reminder.isRead 
                ? "bg-card/30 opacity-70" 
                : "bg-card/50 border-accent"
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(reminder.type)}
                <h3 className={`font-semibold ${reminder.isRead ? "text-card-foreground/70" : "text-card-foreground"}`}>
                  {reminder.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getPriorityColor(reminder.priority)} className="text-xs">
                  {reminder.priority}
                </Badge>
                <Badge variant={getTypeColor(reminder.type)} className="text-xs">
                  {reminder.type}
                </Badge>
                {reminder.isRead && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </div>
            </div>

            <p className={`text-sm mb-3 ${reminder.isRead ? "text-card-foreground/60" : "text-card-foreground/80"}`}>
              {reminder.message}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-card-foreground/50 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(reminder.dateTime).toLocaleString()}
              </span>
              {!reminder.isRead && (
                <Button
                  onClick={() => handleMarkAsRead(reminder.id)}
                  variant="outline"
                  size="sm"
                >
                  Mark as Read
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}