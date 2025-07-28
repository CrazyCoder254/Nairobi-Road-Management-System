import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { vehiclesAPI, saccosAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const vehicleSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1990).max(new Date().getFullYear()),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  saccoId: z.string().min(1, "SACCO is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  color: z.string().optional(),
  fuelType: z.string().optional(),
  chassisNumber: z.string().optional(),
  engineNumber: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface CreateVehicleFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateVehicleForm = ({ open, onClose, onSuccess }: CreateVehicleFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saccos, setSaccos] = useState<any[]>([]);
  const { toast } = useToast();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      plateNumber: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      capacity: 14,
      saccoId: "",
      vehicleType: "Matatu",
      color: "",
      fuelType: "Diesel",
      chassisNumber: "",
      engineNumber: "",
    },
  });

  useEffect(() => {
    if (open) {
      loadSaccos();
    }
  }, [open]);

  const loadSaccos = async () => {
    try {
      const response = await saccosAPI.getAll({ limit: 100 });
      setSaccos(response.saccos || []);
    } catch (error) {
      console.error("Failed to load SACCOs:", error);
    }
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setIsLoading(true);
      await vehiclesAPI.create({
        plateNumber: data.plateNumber,
        make: data.make,
        model: data.model,
        year: data.year,
        capacity: data.capacity,
        saccoId: data.saccoId,
        vehicleType: data.vehicleType,
        color: data.color,
        fuelType: data.fuelType,
        chassisNumber: data.chassisNumber,
        engineNumber: data.engineNumber,
      });
      
      toast({
        title: "Success",
        description: "Vehicle registered successfully",
      });
      
      form.reset();
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register vehicle",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Vehicle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plateNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plate Number *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., KCA 123D" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="saccoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SACCO *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SACCO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {saccos.map((sacco) => (
                          <SelectItem key={sacco._id} value={sacco._id}>
                            {sacco.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Toyota" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Hiace" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        min={1990}
                        max={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        min={1}
                        placeholder="Number of passengers"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Matatu">Matatu</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                        <SelectItem value="Minibus">Minibus</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Vehicle color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chassisNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chassis Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Vehicle chassis number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engineNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Vehicle engine number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register Vehicle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};