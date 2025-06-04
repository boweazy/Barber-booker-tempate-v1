import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { Booking } from "@shared/schema";

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: any;
}

export function SuccessModal({ open, onClose, bookingDetails }: SuccessModalProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!bookingDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Booking Confirmed!</h3>
          <p className="text-slate-600 mb-6">Your appointment has been successfully booked. You'll receive a confirmation email shortly.</p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-semibold text-slate-900 mb-3">Appointment Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Customer:</span>
                <span className="font-medium">{bookingDetails.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Barber:</span>
                <span className="font-medium">{bookingDetails.barberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Service:</span>
                <span className="font-medium">{bookingDetails.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium">{formatDate(bookingDetails.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time:</span>
                <span className="font-medium">{formatTime(bookingDetails.time)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total:</span>
                <span className="font-medium">{formatPrice(bookingDetails.servicePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Booking ID:</span>
                <span className="font-medium font-mono">#BK-{bookingDetails.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
