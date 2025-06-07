import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Circle, ExternalLink, Copy, Settings, Calendar, Key, TestTube } from "lucide-react";

interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  details: string[];
  links?: { text: string; url: string }[];
}

export function GoogleOAuthSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectUri = window.location.origin + "/auth/google/callback";
  const authTestUrl = window.location.origin + "/auth/google";

  const [steps, setSteps] = useState<SetupStep[]>([
    {
      id: "project",
      title: "Create Google Cloud Project",
      description: "Set up a new project in Google Cloud Console",
      completed: false,
      details: [
        "Go to Google Cloud Console",
        "Click 'Select a project' → 'New Project'",
        "Name: 'Barbershop Booking System'",
        "Click 'Create'"
      ],
      links: [{ text: "Google Cloud Console", url: "https://console.cloud.google.com/" }]
    },
    {
      id: "api",
      title: "Enable Calendar API",
      description: "Enable Google Calendar API for your project",
      completed: false,
      details: [
        "Go to 'APIs & Services' → 'Library'",
        "Search for 'Google Calendar API'",
        "Click on it and press 'Enable'"
      ]
    },
    {
      id: "consent",
      title: "Configure OAuth Consent Screen",
      description: "Set up the consent screen users will see",
      completed: false,
      details: [
        "Go to 'APIs & Services' → 'OAuth consent screen'",
        "Choose 'External' user type",
        "App name: 'Barbershop Booking System'",
        "Add your email for support and developer contact",
        "Add scopes: calendar and calendar.events",
        "Add test users (your email)"
      ]
    },
    {
      id: "credentials",
      title: "Create OAuth Credentials",
      description: "Generate client ID and secret",
      completed: false,
      details: [
        "Go to 'APIs & Services' → 'Credentials'",
        "Click 'Create Credentials' → 'OAuth client ID'",
        "Application type: 'Web application'",
        "Name: 'Barbershop Calendar Integration'",
        `Add redirect URI: ${redirectUri}`
      ]
    },
    {
      id: "secrets",
      title: "Configure Replit Secrets",
      description: "Add credentials to your application",
      completed: false,
      details: [
        "In Replit, go to 'Secrets' tab (lock icon)",
        "Add GOOGLE_CLIENT_ID with your client ID",
        "Add GOOGLE_CLIENT_SECRET with your client secret"
      ]
    },
    {
      id: "test",
      title: "Test Integration",
      description: "Verify the OAuth flow works",
      completed: false,
      details: [
        "Test the OAuth flow",
        "Grant calendar permissions",
        "Verify successful token storage"
      ]
    }
  ]);

  const markStepComplete = (stepIndex: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, completed: true } : step
    ));
    if (stepIndex < steps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const testOAuthFlow = async () => {
    setIsLoading(true);
    setTestResult(null);
    
    try {
      // Test if we can initiate OAuth
      const response = await fetch('/auth/google/test/admin');
      const data = await response.json();
      
      if (response.ok) {
        setTestResult("✅ OAuth integration working! Calendar access: " + (data.calendarAccess ? "✅" : "❌"));
        markStepComplete(5);
      } else {
        setTestResult("❌ " + data.error);
      }
    } catch (error) {
      setTestResult("❌ Failed to test OAuth: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const initiateOAuthFlow = () => {
    window.open(authTestUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-xl border-0 bg-slate-800/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-600 border-b border-slate-600/50 rounded-t-lg">
          <CardTitle className="text-2xl text-white flex items-center">
            <Calendar className="text-blue-400 mr-3" />
            Google Calendar Integration Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Steps List */}
            <div className="lg:col-span-2 space-y-4">
              {steps.map((step, index) => (
                <Card 
                  key={step.id}
                  className={`border transition-all duration-200 cursor-pointer ${
                    currentStep === index 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : step.completed 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          currentStep === index ? 'text-blue-700 dark:text-blue-300' : 
                          step.completed ? 'text-green-700 dark:text-green-300' : 
                          'text-slate-700 dark:text-slate-300'
                        }`}>
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {step.description}
                        </p>
                        
                        {currentStep === index && (
                          <div className="mt-3 space-y-2">
                            {step.details.map((detail, idx) => (
                              <div key={idx} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                                <span className="text-sm text-slate-700 dark:text-slate-300">{detail}</span>
                              </div>
                            ))}
                            
                            {step.links && (
                              <div className="mt-3 space-y-2">
                                {step.links.map((link, idx) => (
                                  <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    {link.text}
                                  </a>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex space-x-2 mt-3">
                              <Button
                                size="sm"
                                onClick={() => markStepComplete(index)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Mark Complete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Configuration Panel */}
            <div className="space-y-4">
              <Card className="border border-slate-300 dark:border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-300">
                    <Key className="w-5 h-5 mr-2" />
                    Quick Copy Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Redirect URI</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        value={redirectUri}
                        readOnly
                        className="text-xs bg-slate-50 dark:bg-slate-800"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(redirectUri)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Scopes Needed</Label>
                    <div className="mt-1 space-y-1">
                      <Badge variant="outline" className="text-xs">
                        https://www.googleapis.com/auth/calendar
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        https://www.googleapis.com/auth/calendar.events
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-300 dark:border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center text-slate-700 dark:text-slate-300">
                    <TestTube className="w-5 h-5 mr-2" />
                    Test Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={initiateOAuthFlow}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!steps[4].completed}
                  >
                    Start OAuth Flow
                  </Button>
                  
                  <Button
                    onClick={testOAuthFlow}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Testing..." : "Test Stored Token"}
                  </Button>
                  
                  {testResult && (
                    <Alert>
                      <AlertDescription className="text-sm">
                        {testResult}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}