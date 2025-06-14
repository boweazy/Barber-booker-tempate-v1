import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function EmailSetup() {
  const [testEmail, setTestEmail] = useState("");
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const { toast } = useToast();

  const testEmailService = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to test",
        variant: "destructive"
      });
      return;
    }

    setIsTestingEmail(true);
    setEmailStatus("idle");

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: testEmail,
          message: "This is a test email from Smart Flow Systems booking system."
        })
      });

      if (response.ok) {
        setEmailStatus("success");
        toast({
          title: "Email Test Successful",
          description: "Check your email inbox for the test message",
        });
      } else {
        setEmailStatus("error");
        toast({
          title: "Email Test Failed",
          description: "Check your email configuration",
          variant: "destructive"
        });
      }
    } catch (error) {
      setEmailStatus("error");
      toast({
        title: "Email Test Failed",
        description: "Unable to send test email",
        variant: "destructive"
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/95 via-slate-50/90 to-white/95 backdrop-blur-sm transition-all duration-500 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-slate-50 via-slate-100/50 to-slate-50 border-b border-slate-200/50 rounded-t-lg transition-all duration-300">
        <CardTitle className="flex items-center text-slate-900">
          <Mail className="mr-2 h-5 w-5 text-slate-600" />
          Email Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            To send booking confirmations, configure one of the email services below using environment variables.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="gmail" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gmail">Gmail</TabsTrigger>
            <TabsTrigger value="outlook">Outlook</TabsTrigger>
            <TabsTrigger value="sendgrid">SendGrid</TabsTrigger>
          </TabsList>

          <TabsContent value="gmail" className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 via-blue-25 to-blue-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-slate-900 mb-2">Gmail Setup (Recommended)</h3>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>Enable 2-factor authentication on your Gmail account</li>
                <li>Go to Google Account → Security → App passwords</li>
                <li>Generate a 16-character app password for "Mail"</li>
                <li>Add these environment variables in Replit Secrets:</li>
              </ol>
              <div className="mt-3 bg-slate-100 p-3 rounded font-mono text-sm">
                <div>GMAIL_USER=your-email@gmail.com</div>
                <div>GMAIL_PASS=your-16-char-app-password</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="outlook" className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 via-blue-25 to-blue-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-slate-900 mb-2">Outlook/Hotmail Setup</h3>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>Enable 2-factor authentication on your Outlook account</li>
                <li>Go to Security settings and create an app password</li>
                <li>Add these environment variables in Replit Secrets:</li>
              </ol>
              <div className="mt-3 bg-slate-100 p-3 rounded font-mono text-sm">
                <div>OUTLOOK_USER=your-email@outlook.com</div>
                <div>OUTLOOK_PASS=your-app-password</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sendgrid" className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 via-green-25 to-green-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-slate-900 mb-2">SendGrid Setup (Professional)</h3>
              <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                <li>Sign up for a free SendGrid account</li>
                <li>Create an API key in your dashboard</li>
                <li>Verify your sender email address</li>
                <li>Add these environment variables in Replit Secrets:</li>
              </ol>
              <div className="mt-3 bg-slate-100 p-3 rounded font-mono text-sm">
                <div>SENDGRID_API_KEY=your-api-key</div>
                <div>FROM_EMAIL=your-verified-email@domain.com</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-slate-900 mb-3">Test Email Configuration</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="testEmail" className="text-sm font-medium text-slate-700">
                Your Email Address
              </Label>
              <Input
                id="testEmail"
                type="email"
                placeholder="your-email@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={testEmailService}
                disabled={isTestingEmail}
                className="bg-gradient-to-r from-slate-600 via-slate-500 to-slate-600 hover:from-slate-700 hover:via-slate-600 hover:to-slate-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isTestingEmail ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Test Email
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {emailStatus === "success" && (
            <Alert className="mt-3 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Email sent successfully! Check your inbox.
              </AlertDescription>
            </Alert>
          )}
          
          {emailStatus === "error" && (
            <Alert className="mt-3 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Email failed to send. Please check your configuration.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}