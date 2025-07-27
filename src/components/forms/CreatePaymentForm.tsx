import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { paymentsAPI, vehiclesAPI, driversAPI } from "@/lib/api";

interface CreatePaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const paymentTypes = [
  { value: "permit_fee", label: "Permit Fee" },
  { value: "registration_fee", label: "Registration Fee" },
  { value: "insurance_premium", label: "Insurance Premium" },
  { value: "license_renewal", label: "License Renewal" },
  { value: "inspection_fee", label: "Inspection Fee" },
  { value: "route_fee", label: "Route Fee" },
  { value: "terminus_fee", label: "Terminus Fee" },
  { value: "fine", label: "Fine" },
  { value: "other", label: "Other" }
];

export const CreatePaymentForm = ({ onSuccess, onCancel }: CreatePaymentFormProps) => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    paymentType: "",
    description: "",
    dueDate: "",
    entityType: "vehicle",
    entityId: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, driversRes] = await Promise.all([
          vehiclesAPI.getAll(),
          driversAPI.getAll()
        ]);
        setVehicles(vehiclesRes.data || []);
        setDrivers(driversRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await paymentsAPI.create({
        amount: parseFloat(formData.amount),
        paymentType: formData.paymentType,
        description: formData.description,
        dueDate: formData.dueDate,
        entityType: formData.entityType,
        entityId: formData.entityId
      });
      toast.success("Payment record created successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to create payment record");
      console.error("Create payment error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="amount">Amount (KSh)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="paymentType">Payment Type</Label>
          <Select value={formData.paymentType} onValueChange={(value) => setFormData({ ...formData, paymentType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment type" />
            </SelectTrigger>
            <SelectContent>
              {paymentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Input
          id="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="entityType">Entity Type</Label>
          <Select value={formData.entityType} onValueChange={(value) => setFormData({ ...formData, entityType: value, entityId: "" })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vehicle">Vehicle</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="entityId">
            {formData.entityType === "vehicle" ? "Vehicle" : "Driver"}
          </Label>
          <Select value={formData.entityId} onValueChange={(value) => setFormData({ ...formData, entityId: value })}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${formData.entityType}`} />
            </SelectTrigger>
            <SelectContent>
              {formData.entityType === "vehicle" 
                ? vehicles.map((vehicle: any) => (
                    <SelectItem key={vehicle._id} value={vehicle._id}>
                      {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))
                : drivers.map((driver: any) => (
                    <SelectItem key={driver._id} value={driver._id}>
                      {driver.userId?.firstName} {driver.userId?.lastName} - {driver.licenseNumber}
                    </SelectItem>
                  ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex-1">
          Create Payment Record
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};