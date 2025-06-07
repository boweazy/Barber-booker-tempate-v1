import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ isVisible, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tourPosition, setTourPosition] = useState({ x: 0, y: 0 });

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to Premium Barbershop",
      content: "Let's take a quick tour to show you how easy it is to book your perfect haircut. This will only take 30 seconds!"
    },
    {
      id: "barber-selection",
      title: "Choose Your Barber",
      content: "Browse our skilled barbers, view their profiles, specialties, and ratings. Each barber has their own unique style and expertise.",
      target: ".barber-profiles"
    },
    {
      id: "service-selection", 
      title: "Select Your Service",
      content: "Pick from our range of services including classic cuts, beard trims, and premium packages. Prices and duration are clearly shown.",
      target: ".service-selection"
    },
    {
      id: "calendar-booking",
      title: "Quick Calendar Booking",
      content: "Use our interactive calendar to see available times. You can book directly by clicking 'Book [time]' buttons for instant scheduling.",
      target: ".calendar-view"
    },
    {
      id: "notifications",
      title: "Stay Informed",
      content: "We'll send you confirmation and reminder notifications to ensure you never miss your appointment. You can customize these preferences.",
      target: ".notification-settings"
    },
    {
      id: "loyalty-program",
      title: "Earn Rewards",
      content: "Join our loyalty program to earn points, unlock free services, and enjoy member-exclusive benefits with every visit.",
      target: ".loyalty-program"
    }
  ];

  const currentTourStep = tourSteps[currentStep];

  useEffect(() => {
    if (!isVisible) return;

    const updatePosition = () => {
      if (currentTourStep.target) {
        const element = document.querySelector(currentTourStep.target);
        if (element) {
          const rect = element.getBoundingClientRect();
          const position = currentTourStep.position || "bottom";
          
          let x = rect.left + rect.width / 2;
          let y = rect.bottom + 20;
          
          switch (position) {
            case "top":
              y = rect.top - 20;
              break;
            case "left":
              x = rect.left - 20;
              y = rect.top + rect.height / 2;
              break;
            case "right":
              x = rect.right + 20;
              y = rect.top + rect.height / 2;
              break;
          }
          
          setTourPosition({ x, y });
        }
      } else {
        // Center of screen for welcome step
        setTourPosition({ 
          x: window.innerWidth / 2, 
          y: window.innerHeight / 2 
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep, isVisible, currentTourStep]);

  if (!isVisible) return null;

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Spotlight effect */}
      {currentTourStep.target && (
        <div
          className="fixed z-45 pointer-events-none"
          style={{
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
          }}
        />
      )}
      
      {/* Tour Card */}
      <Card 
        className="fixed z-50 w-80 shadow-2xl border-0 bg-slate-800/95 backdrop-blur-sm transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${tourPosition.x}px`,
          top: `${tourPosition.y}px`,
        }}
      >
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-slate-400">
                Step {currentStep + 1} of {tourSteps.length}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-2">
              {currentTourStep.title}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentTourStep.content}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <div className="flex space-x-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index <= currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <Button
              size="sm"
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Tour Link */}
          <div className="text-center mt-4">
            <button
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Skip tour
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}