import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, X, Star, Calendar, Clock, User } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to BarberShop Pro!",
    content: "Let's take a quick tour to show you how easy it is to book your perfect haircut. This will only take 2 minutes.",
  },
  {
    id: "barber-selection",
    title: "Step 1: Choose Your Barber",
    content: "Browse our skilled barbers and their ratings. Each has different specialties and experience levels. Click on any barber to select them.",
    target: "[data-tour='barber-selection']",
    position: "bottom",
  },
  {
    id: "date-time",
    title: "Step 2: Pick Your Date & Time",
    content: "Select your preferred date, then choose from available time slots. We show only open slots to prevent double bookings.",
    target: "[data-tour='date-selection']",
    position: "bottom",
  },
  {
    id: "service-selection",
    title: "Step 3: Select Your Service",
    content: "Choose from our range of services - from quick trims to premium packages. Prices and duration are clearly shown.",
    target: "[data-tour='service-selection']",
    position: "top",
  },
  {
    id: "customer-info",
    title: "Step 4: Enter Your Details",
    content: "Provide your name and phone number for the booking. We'll use this to confirm your appointment.",
    target: "[data-tour='customer-info']",
    position: "top",
  },
  {
    id: "booking-summary",
    title: "Step 5: Review & Book",
    content: "Check your booking summary on the right side, then click 'Book Appointment' to confirm. You'll get instant confirmation!",
    target: "[data-tour='booking-summary']",
    position: "left",
  },
  {
    id: "admin-panel",
    title: "Bonus: Admin Features",
    content: "Staff can access the Admin Panel to view all bookings, manage appointments, and track daily revenue. Perfect for business management!",
    target: "[data-tour='admin-button']",
    position: "bottom",
  },
  {
    id: "complete",
    title: "You're All Set!",
    content: "That's it! You're ready to book appointments. If you need help anytime, use the WhatsApp button or contact us directly.",
  },
];

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ isVisible, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [isVisible]);

  const currentTourStep = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsOpen(false);
    onComplete();
  };

  const handleSkip = () => {
    setIsOpen(false);
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      
      {/* Tour Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md z-50">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-slate-900">
                {currentTourStep.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
            
            {/* Step Counter */}
            <div className="text-center text-sm text-slate-600">
              Step {currentStep + 1} of {tourSteps.length}
            </div>
            
            {/* Content */}
            <div className="py-4">
              <p className="text-slate-700 leading-relaxed">{currentTourStep.content}</p>
            </div>
            
            {/* Special content for certain steps */}
            {currentStep === 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Why Choose Us?</h4>
                      <p className="text-sm text-slate-600">Professional barbers, easy booking, great reviews!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {currentStep === tourSteps.length - 1 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Ready to Book?</h4>
                    <p className="text-sm text-slate-600">Start by selecting your favorite barber!</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-700"
              >
                Skip Tour
              </Button>
              
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Highlight Overlay for targeted elements */}
      {currentTourStep.target && (
        <div className="fixed inset-0 pointer-events-none z-45">
          <style>{`
            ${currentTourStep.target} {
              position: relative;
              z-index: 51;
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5);
              border-radius: 8px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}