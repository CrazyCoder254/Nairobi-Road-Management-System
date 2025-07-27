import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { routesAPI } from "@/lib/api";

interface CreateRouteFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  terminuses: any[];
}

export const CreateRouteForm = ({ onSuccess, onCancel, terminuses }: CreateRouteFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    routeCode: "",
    startTerminus: "",
    endTerminus: "",
    distance: "",
    estimatedDuration: "",
    fareAmount: "",
    description: "",
    operatingHours: {
      start: "06:00",
      end: "22:00"
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await routesAPI.create({
        name: formData.name,
        routeCode: formData.routeCode,
        startTerminus: formData.startTerminus,
        endTerminus: formData.endTerminus,
        distance: parseFloat(formData.distance),
        estimatedDuration: parseInt(formData.estimatedDuration),
        fareAmount: parseFloat(formData.fareAmount),
        description: formData.description,
        operatingHours: formData.operatingHours
      });
      toast.success("Route created successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create route");
      console.error("Create route error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Route Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="routeCode">Route Code</Label>
          <Input
            id="routeCode"
            value={formData.routeCode}
            onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTerminus">Start Terminus</Label>
          <Select value={formData.startTerminus} onValueChange={(value) => setFormData({ ...formData, startTerminus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select start terminus" />
            </SelectTrigger>
            <SelectContent>
              {terminuses.map((terminus) => (
                <SelectItem key={terminus._id} value={terminus._id}>
                  {terminus.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="endTerminus">End Terminus</Label>
          <Select value={formData.endTerminus} onValueChange={(value) => setFormData({ ...formData, endTerminus: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select end terminus" />
            </SelectTrigger>
            <SelectContent>
              {terminuses.map((terminus) => (
                <SelectItem key={terminus._id} value={terminus._id}>
                  {terminus.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="distance">Distance (km)</Label>
          <Input
            id="distance"
            type="number"
            step="0.1"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="estimatedDuration">Duration (min)</Label>
          <Input
            id="estimatedDuration"
            type="number"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="fareAmount">Fare (KSh)</Label>
          <Input
            id="fareAmount"
            type="number"
            step="0.01"
            value={formData.fareAmount}
            onChange={(e) => setFormData({ ...formData, fareAmount: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.operatingHours.start}
            onChange={(e) => setFormData({ 
              ...formData, 
              operatingHours: { ...formData.operatingHours, start: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.operatingHours.end}
            onChange={(e) => setFormData({ 
              ...formData, 
              operatingHours: { ...formData.operatingHours, end: e.target.value }
            })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Route
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};