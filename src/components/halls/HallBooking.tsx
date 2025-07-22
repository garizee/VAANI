import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";

interface Hall {
  id: string;
  name: string;
  capacity: number;
  location: string;
  isAvailable: boolean;
  amenities: string[];
  nextAvailable?: string;
}

const mockHalls: Hall[] = [
  {
    id: "1",
    name: "Community Hall A",
    capacity: 100,
    location: "Block A, Ground Floor",
    isAvailable: true,
    amenities: ["Projector", "Sound System", "Air Conditioning"],
  },
  {
    id: "2",
    name: "Conference Room B",
    capacity: 50,
    location: "Block B, 2nd Floor",
    isAvailable: false,
    amenities: ["Smart Board", "Video Conferencing"],
    nextAvailable: "Tomorrow 2:00 PM",
  },
  {
    id: "3",
    name: "Event Hall C",
    capacity: 200,
    location: "Block C, Ground Floor",
    isAvailable: true,
    amenities: ["Stage", "Professional Lighting", "Sound System"],
  },
];

interface HallBookingProps {
  onBookHall?: (hallId: string) => void;
}

export function HallBooking({ onBookHall }: HallBookingProps) {
  const [selectedHall, setSelectedHall] = useState<string | null>(null);

  const handleBooking = (hallId: string) => {
    onBookHall?.(hallId);
    setSelectedHall(hallId);
  };

  return (
    <Card className="bg-gradient-yellow-green border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <MapPin className="h-5 w-5" />
          Vacant Hall Booking
        </CardTitle>
        <CardDescription className="text-card-foreground/70">
          Book available community halls for events and gatherings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockHalls.map((hall) => (
          <div
            key={hall.id}
            className="p-4 rounded-lg border bg-card/50 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground">{hall.name}</h3>
                <p className="text-sm text-card-foreground/70 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {hall.location}
                </p>
              </div>
              <Badge variant={hall.isAvailable ? "default" : "secondary"}>
                {hall.isAvailable ? "Available" : "Occupied"}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-card-foreground/70">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {hall.capacity} people
              </span>
              {!hall.isAvailable && hall.nextAvailable && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Next: {hall.nextAvailable}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {hall.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>

            <Button
              onClick={() => handleBooking(hall.id)}
              disabled={!hall.isAvailable}
              className="w-full"
              variant={hall.isAvailable ? "default" : "secondary"}
            >
              {hall.isAvailable ? "Book Now" : "Not Available"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}