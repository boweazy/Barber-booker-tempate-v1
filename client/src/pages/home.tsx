
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Star, ArrowRight } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-yellow-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            SmartFlow Booking
          </h1>
          <p className="text-gray-700 text-lg">
            Book your next barber appointment in seconds.
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/barbers">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-green-400 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  View Our Barbers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Browse our skilled barbers, view their profiles, and see their specialties.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Choose Your Barber
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-2 border-green-400 bg-green-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Quick Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Fast and easy appointment scheduling with instant confirmation.
              </p>
              <Link href="/barbers">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Book Now
                  <Clock className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center bg-white shadow-lg">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold mb-1">Expert Barbers</h3>
              <p className="text-sm text-gray-700">Skilled professionals with years of experience</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white shadow-lg">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
              <p className="text-sm text-gray-700">Book appointments that fit your schedule</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white shadow-lg">
            <CardContent className="pt-6">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Easy Booking</h3>
              <p className="text-sm text-gray-700">Simple online booking system</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Access */}
        <div className="text-center">
          <Link href="/admin-login">
            <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
              Admin Access
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
