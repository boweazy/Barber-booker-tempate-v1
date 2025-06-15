import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, Users, Clock, TrendingUp, Star, Package, AlertTriangle, CheckCircle, Award, Target, Zap, Heart, Trophy, Gift } from "lucide-react";
import { api } from "@/lib/api";
import type { Booking, Barber, Service, Client } from "@shared/schema";

// Widget Types
export interface Widget {
  id: string;
  type: 'stats' | 'chart' | 'list' | 'calendar';
  title: string;
  component: string;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
}

// Enhanced Statistics Widget with animations
export function StatsWidget({ title, value, icon: Icon, trend, color = "blue" }: {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  color?: "blue" | "green" | "orange" | "purple";
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500 to-blue-600 text-blue-600 shadow-blue-500/25",
    green: "from-green-500 to-green-600 text-green-600 shadow-green-500/25",
    orange: "from-orange-500 to-orange-600 text-orange-600 shadow-orange-500/25",
    purple: "from-purple-500 to-purple-600 text-purple-600 shadow-purple-500/25"
  };

  return (
    <Card className="h-36 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50/50 border-slate-200/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between h-full">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
            {trend && (
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className="text-white w-7 h-7" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Today's Bookings Widget
export function TodayBookingsWidget() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ["/api/barbers"],
    queryFn: api.getBarbers,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    queryFn: api.getServices,
  });

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(booking => booking.date === today);

  const getBarberName = (barberId: number) => {
    const barber = barbers.find(b => b.id === barberId);
    return barber?.name || "Unknown";
  };

  const getServiceName = (serviceId: number) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-4 h-4 text-blue-600" />
        <h3 className="font-medium text-sm">Today's Schedule</h3>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {todayBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-sm">No bookings today</p>
        ) : (
          todayBookings.map((booking) => (
            <div key={booking.id} className="p-2 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">{booking.customerName}</div>
                  <div className="text-xs text-gray-600 truncate">
                    {getServiceName(booking.serviceId)}
                  </div>
                  <div className="text-xs text-gray-500">{booking.time}</div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Revenue Widget
export function RevenueWidget() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    queryFn: api.getServices,
  });

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const todayRevenue = completedBookings
    .filter(b => b.date === today)
    .reduce((sum, booking) => {
      const service = services.find(s => s.id === booking.serviceId);
      return sum + (service?.price || 0);
    }, 0) / 100;

  const monthlyRevenue = completedBookings
    .filter(b => b.date.startsWith(thisMonth))
    .reduce((sum, booking) => {
      const service = services.find(s => s.id === booking.serviceId);
      return sum + (service?.price || 0);
    }, 0) / 100;

  return (
    <Card className="h-40">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Revenue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Today</p>
            <p className="text-xl font-bold text-green-600">${todayRevenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">This Month</p>
            <p className="text-xl font-bold text-blue-600">${monthlyRevenue.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Actions Widget
export function QuickActionsWidget() {
  return (
    <Card className="h-60">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          New Booking
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <DollarSign className="w-4 h-4 mr-2" />
          Process Payment
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Package className="w-4 h-4 mr-2" />
          Inventory Check
        </Button>
      </CardContent>
    </Card>
  );
}

// Daily Earnings Tracker Widget
export function DailyEarningsWidget() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === today && b.status === 'completed');
  const todayEarnings = todayBookings.reduce((sum, b) => sum + (b.depositAmount || 0), 0);
  const goalAmount = 500; // Daily goal
  const progressPercentage = Math.min((todayEarnings / goalAmount) * 100, 100);

  return (
    <Card className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center text-green-800">
          <DollarSign className="w-5 h-5 mr-2" />
          Today's Earnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-green-700">${todayEarnings}</span>
            <span className="text-sm text-green-600">/ ${goalAmount}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Progress to Goal</span>
              <span className="text-green-600">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-green-600">
            <span>{todayBookings.length} completed appointments</span>
            <span>{goalAmount - todayEarnings > 0 ? `$${goalAmount - todayEarnings} to go` : 'Goal achieved! 🎉'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Achievements Widget
export function AchievementsWidget() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const thisWeekBookings = completedBookings.filter(b => {
    const bookingDate = new Date(b.date);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return bookingDate >= weekStart;
  });

  const achievements = [
    {
      title: "Perfect Week",
      description: "5+ appointments completed",
      achieved: thisWeekBookings.length >= 5,
      icon: Trophy,
      color: "text-yellow-600"
    },
    {
      title: "Customer Favorite",
      description: "High satisfaction rate",
      achieved: completedBookings.length > 10,
      icon: Heart,
      color: "text-red-500"
    },
    {
      title: "Rising Star",
      description: "Growing clientele",
      achieved: completedBookings.length > 25,
      icon: Star,
      color: "text-blue-500"
    }
  ];

  return (
    <Card className="h-64 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center text-purple-800">
          <Award className="w-5 h-5 mr-2" />
          Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {achievements.map((achievement, index) => (
          <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
            achievement.achieved 
              ? 'bg-white shadow-sm border border-purple-200' 
              : 'bg-purple-100/50 opacity-60'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              achievement.achieved 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                : 'bg-gray-300'
            }`}>
              <achievement.icon className={`w-4 h-4 ${achievement.achieved ? 'text-white' : 'text-gray-500'}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${achievement.achieved ? 'text-purple-900' : 'text-gray-500'}`}>
                {achievement.title}
              </p>
              <p className={`text-xs ${achievement.achieved ? 'text-purple-600' : 'text-gray-400'}`}>
                {achievement.description}
              </p>
            </div>
            {achievement.achieved && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Quick Actions Widget with enhanced styling
export function EnhancedQuickActionsWidget() {
  const actions = [
    { label: "New Booking", icon: Calendar, color: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" },
    { label: "Add Customer", icon: Users, color: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" },
    { label: "Process Payment", icon: DollarSign, color: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" },
    { label: "Quick Check-in", icon: Zap, color: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" }
  ];

  return (
    <Card className="h-72 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center text-slate-800">
          <Target className="w-5 h-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button 
            key={index}
            className={`w-full justify-start h-12 bg-gradient-to-r ${action.color} text-white shadow-md transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
          >
            <action.icon className="w-5 h-5 mr-3" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

// Recent Activity Widget
export function RecentActivityWidget() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, 5);

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="h-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-64 overflow-y-auto">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
            {getActivityIcon(booking.status)}
            <div className="flex-1">
              <p className="text-sm font-medium">{booking.customerName}</p>
              <p className="text-xs text-slate-500">
                {booking.status} • {booking.date}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Performance Widget
export function PerformanceWidget() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0;
  const cancellationRate = totalBookings > 0 ? (cancelledBookings / totalBookings * 100).toFixed(1) : 0;

  return (
    <Card className="h-48">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span className="font-medium">{completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Cancellation Rate</span>
              <span className="font-medium">{cancellationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${cancellationRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget Registry with proper typing
export const AVAILABLE_WIDGETS: Record<string, {
  id: string;
  title: string;
  component: React.ComponentType;
  size: 'small' | 'medium' | 'large';
  category: string;
}> = {
  'daily-earnings': {
    id: 'daily-earnings',
    title: "Daily Earnings Tracker",
    component: DailyEarningsWidget,
    size: 'medium',
    category: 'finance'
  },
  'achievements': {
    id: 'achievements',
    title: 'Performance Achievements',
    component: AchievementsWidget,
    size: 'medium',
    category: 'motivation'
  },
  'enhanced-actions': {
    id: 'enhanced-actions',
    title: 'Quick Actions Pro',
    component: EnhancedQuickActionsWidget,
    size: 'medium',
    category: 'actions'
  },
  'today-bookings': {
    id: 'today-bookings',
    title: "Today's Bookings",
    component: TodayBookingsWidget,
    size: 'medium',
    category: 'schedule'
  },
  'revenue': {
    id: 'revenue',
    title: 'Revenue Overview',
    component: RevenueWidget,
    size: 'medium',
    category: 'finance'
  },
  'recent-activity': {
    id: 'recent-activity',
    title: 'Recent Activity',
    component: RecentActivityWidget,
    size: 'medium',
    category: 'activity'
  },
  'performance': {
    id: 'performance',
    title: 'Performance Metrics',
    component: PerformanceWidget,
    size: 'medium',
    category: 'analytics'
  }
};