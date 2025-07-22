import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CCTVRequest {
  id: string;
  area: string;
  dateTime: string;
  reason: string;
  status: "pending" | "approved" | "processing" | "ready";
  requestedAt: string;
}

const mockRequests: CCTVRequest[] = [
  {
    id: "1",
    area: "Block A Entrance",
    dateTime: "2024-01-20 14:30",
    reason: "Security incident investigation",
    status: "ready",
    requestedAt: "2024-01-21 09:00",
  },
  {
    id: "2",
    area: "Parking Area B",
    dateTime: "2024-01-19 18:00",
    reason: "Vehicle damage claim",
    status: "processing",
    requestedAt: "2024-01-20 16:30",
  },
];

const areas = [
  "Block A Entrance",
  "Block B Entrance", 
  "Block C Entrance",
  "Parking Area A",
  "Parking Area B",
  "Community Hall",
  "Playground",
  "Swimming Pool Area",
];

interface CCTVRequestProps {
  onSubmitRequest?: (request: Omit<CCTVRequest, "id" | "status" | "requestedAt">) => void;
}

export function CCTVRequest({ onSubmitRequest }: CCTVRequestProps) {
  const [selectedArea, setSelectedArea] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea || !dateTime || !reason) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    onSubmitRequest?.({
      area: selectedArea,
      dateTime,
      reason,
    });

    toast({
      title: "CCTV footage request submitted",
      description: "Guard office will process your request within 24 hours",
    });

    // Reset form
    setSelectedArea("");
    setDateTime("");
    setReason("");
  };

  const getStatusColor = (status: CCTVRequest["status"]) => {
    switch (status) {
      case "pending": return "secondary";
      case "approved": return "default";
      case "processing": return "warning";
      case "ready": return "success";
      default: return "secondary";
    }
  };

  return (
    <Card className="bg-gradient-yellow-green border-accent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Video className="h-5 w-5" />
          CCTV Footage Request
        </CardTitle>
        <CardDescription className="text-card-foreground/70">
          Request CCTV footage from guard office for specific areas and times
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="area">Area/Block</Label>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="datetime">Date & Time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              max={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Request</Label>
            <Textarea
              id="reason"
              placeholder="Describe why you need this footage..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>

        <div className="space-y-3">
          <h4 className="font-semibold text-card-foreground">Recent Requests</h4>
          {mockRequests.map((request) => (
            <div key={request.id} className="p-3 rounded-lg border bg-card/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-card-foreground">{request.area}</p>
                  <p className="text-sm text-card-foreground/70 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {request.dateTime}
                  </p>
                </div>
                <Badge variant={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </div>
              <p className="text-sm text-card-foreground/70 mb-2">{request.reason}</p>
              <p className="text-xs text-card-foreground/50 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Requested: {request.requestedAt}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}