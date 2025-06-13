import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowRight } from "lucide-react";

export default function Connected() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate the success message
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className={`w-full max-w-md mx-auto transition-all duration-500 ${
        isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
      }`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-green-500 animate-pulse" />
              <Calendar className="w-6 h-6 text-green-600 absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400">
            Calendar Connected!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Your Google Calendar is now linked to the booking system. 
            All new appointments will automatically sync to your calendar.
          </p>
          
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ Bookings will appear in your Google Calendar
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ Updates sync automatically
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✓ No more double booking conflicts
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Continue to Booking System
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can disconnect your calendar anytime in settings
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}