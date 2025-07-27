import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { terminusesAPI } from "@/lib/api";

interface CreateTerminusFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const facilityOptions = [
  { value: "restrooms", label: "Restrooms" },
  { value: "waiting_area", label: "Waiting Area" },
  { value: "food_court", label: "Food Court" },
  { value: "atm", label: "ATM" },
  { value: "security", label: "Security" },
  { value: "cctv", label: "CCTV" },
  { value: "wifi", label: "WiFi" }
];

export const CreateTerminusForm = ({ onSuccess, onCancel }: CreateTerminusFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "Nairobi",
    region: "Nairobi",
    capacity: "",
    contactPersonName: "",
    contactPersonPhone: "",
    description: "",
    facilities: [] as string[],
    operatingHours: {
      start: "05:00",
      end: "23:00"
    }
  });

  const handleFacilityChange = (facility: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, facilities: [...formData.facilities, facility] });
    } else {
      setFormData({ ...formData, facilities: formData.facilities.filter(f => f !== facility) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await terminusesAPI.create({
        name: formData.name,
        location: {
          address: formData.address,
          city: formData.city,
          region: formData.region
        },
        capacity: parseInt(formData.capacity),
        facilities: formData.facilities,
        operatingHours: formData.operatingHours,
        contactPerson: {
          name: formData.contactPersonName,
          phone: formData.contactPersonPhone
        },
        description: formData.description
      });
      toast.success("Terminus created successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create terminus");
      console.error("Create terminus error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Terminus Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactPersonName">Contact Person</Label>
          <Input
            id="contactPersonName"
            value={formData.contactPersonName}
            onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="contactPersonPhone">Contact Phone</Label>
          <Input
            id="contactPersonPhone"
            value={formData.contactPersonPhone}
            onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
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
        <Label>Facilities</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {facilityOptions.map((facility) => (
            <div key={facility.value} className="flex items-center space-x-2">
              <Checkbox
                id={facility.value}
                checked={formData.facilities.includes(facility.value)}
                onCheckedChange={(checked) => handleFacilityChange(facility.value, checked as boolean)}
              />
              <Label htmlFor={facility.value} className="text-sm">
                {facility.label}
              </Label>
            </div>
          ))}
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
          Create Terminus
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};