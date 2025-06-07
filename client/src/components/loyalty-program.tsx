import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Star, Trophy, Users, Percent } from "lucide-react";
import type { Client } from "@shared/schema";

interface LoyaltyProgramProps {
  client?: Client;
  totalVisits: number;
  loyaltyPoints: number;
}

export function LoyaltyProgram({ client, totalVisits = 0, loyaltyPoints = 0 }: LoyaltyProgramProps) {
  const visitsToNextReward = 10 - (totalVisits % 10);
  const progressToNextReward = ((totalVisits % 10) / 10) * 100;
  
  const getLoyaltyTier = (visits: number) => {
    if (visits >= 50) return { name: "Platinum", color: "from-purple-600 to-violet-600", perks: "20% off all services + priority booking" };
    if (visits >= 25) return { name: "Gold", color: "from-yellow-500 to-amber-600", perks: "15% off all services + exclusive offers" };
    if (visits >= 10) return { name: "Silver", color: "from-slate-400 to-slate-600", perks: "10% off services + birthday specials" };
    return { name: "Bronze", color: "from-orange-500 to-amber-600", perks: "5% off future bookings" };
  };

  const currentTier = getLoyaltyTier(totalVisits);
  const nextTierVisits = totalVisits >= 50 ? 50 : totalVisits >= 25 ? 50 : totalVisits >= 10 ? 25 : 10;
  const visitsToNextTier = Math.max(0, nextTierVisits - totalVisits);

  const rewards = [
    { visits: 10, reward: "Free Basic Haircut", claimed: totalVisits >= 10 },
    { visits: 20, reward: "15% Off Any Service", claimed: totalVisits >= 20 },
    { visits: 30, reward: "Free Beard Trim", claimed: totalVisits >= 30 },
    { visits: 40, reward: "Premium Package Discount", claimed: totalVisits >= 40 },
    { visits: 50, reward: "VIP Membership", claimed: totalVisits >= 50 },
  ];

  const availableRewards = rewards.filter(r => r.claimed && !r.claimed);
  const nextReward = rewards.find(r => !r.claimed);

  return (
    <div className="space-y-6">
      {/* Loyalty Status Card */}
      <Card className="shadow-xl border-0 bg-slate-800/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600/50 rounded-t-lg">
          <CardTitle className="text-xl text-white flex items-center">
            <Trophy className="text-yellow-400 mr-2" />
            Loyalty Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Tier */}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${currentTier.color} flex items-center justify-center`}>
                <Star className="text-white w-8 h-8" />
              </div>
              <h3 className="text-white font-bold text-lg">{currentTier.name} Member</h3>
              <p className="text-slate-300 text-sm mt-1">{currentTier.perks}</p>
            </div>

            {/* Visit Counter */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{totalVisits}</div>
              <p className="text-slate-300">Total Visits</p>
              {visitsToNextTier > 0 && (
                <p className="text-blue-400 text-sm mt-1">
                  {visitsToNextTier} visits to {totalVisits >= 50 ? "maintain" : "next tier"}
                </p>
              )}
            </div>

            {/* Loyalty Points */}
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                {loyaltyPoints}
              </div>
              <p className="text-slate-300">Loyalty Points</p>
              <p className="text-green-400 text-sm mt-1">= ${(loyaltyPoints / 100).toFixed(2)} credit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Reward Progress */}
      <Card className="shadow-xl border-0 bg-slate-800/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center">
              <Gift className="text-green-400 mr-2" />
              Next Free Reward
            </h3>
            <Badge className="bg-green-100 text-green-800">
              {visitsToNextReward} visits away
            </Badge>
          </div>
          
          <Progress value={progressToNextReward} className="mb-3" />
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">{totalVisits % 10}/10 visits</span>
            <span className="text-green-400">Free Haircut</span>
          </div>
        </CardContent>
      </Card>

      {/* Available Rewards */}
      {nextReward && (
        <Card className="shadow-xl border-0 bg-slate-800/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Star className="text-yellow-400 mr-2" />
              Milestone Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    reward.claimed
                      ? 'bg-green-900/20 border border-green-800/30'
                      : totalVisits >= reward.visits
                      ? 'bg-yellow-900/20 border border-yellow-800/30'
                      : 'bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reward.claimed
                        ? 'bg-green-600'
                        : totalVisits >= reward.visits
                        ? 'bg-yellow-600'
                        : 'bg-slate-600'
                    }`}>
                      {reward.claimed ? (
                        <Gift className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-white text-xs font-bold">{reward.visits}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{reward.reward}</p>
                      <p className="text-slate-400 text-sm">{reward.visits} visits milestone</p>
                    </div>
                  </div>
                  
                  {reward.claimed ? (
                    <Badge className="bg-green-100 text-green-800">Claimed</Badge>
                  ) : totalVisits >= reward.visits ? (
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      Claim Reward
                    </Button>
                  ) : (
                    <Badge variant="outline" className="border-slate-600 text-slate-400">
                      Locked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referral Program */}
      <Card className="shadow-xl border-0 bg-slate-800/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center">
              <Users className="text-blue-400 mr-2" />
              Refer Friends & Save
            </h3>
            <Badge className="bg-blue-100 text-blue-800">$5 Each</Badge>
          </div>
          
          <p className="text-slate-300 text-sm mb-4">
            Refer a friend and you both get $5 off your next service. No limit on referrals!
          </p>
          
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            Share Referral Code
          </Button>
        </CardContent>
      </Card>

      {/* Seasonal Promotions */}
      <Card className="shadow-xl border-0 bg-slate-800/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center">
              <Percent className="text-purple-400 mr-2" />
              Current Promotions
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">New Year Special</p>
                  <p className="text-purple-300 text-sm">20% off Premium Package</p>
                </div>
                <Badge className="bg-purple-100 text-purple-800">Limited Time</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-orange-900/20 border border-orange-800/30 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">Birthday Month</p>
                  <p className="text-orange-300 text-sm">Free beard trim with any service</p>
                </div>
                <Badge className="bg-orange-100 text-orange-800">Members Only</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}