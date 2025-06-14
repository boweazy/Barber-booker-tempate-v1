# Email Setup Guide for Smart Flow Systems

Your booking system supports multiple email providers. Choose the easiest option for you:

## Option 1: Gmail (Recommended - Easy Setup)

1. **Go to your Gmail account settings**
2. **Enable 2-factor authentication** (required for app passwords)
3. **Create an app password:**
   - Go to Google Account settings → Security
   - Click "App passwords" 
   - Generate a password for "Mail"
   - Copy the 16-character password

4. **Add these environment variables:**
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-16-character-app-password
   ```

## Option 2: Outlook/Hotmail

1. **Go to Outlook.com account settings**
2. **Enable 2-factor authentication**
3. **Create an app password:**
   - Go to Security settings
   - Generate app password for email

4. **Add these environment variables:**
   ```
   OUTLOOK_USER=your-email@outlook.com
   OUTLOOK_PASS=your-app-password
   ```

## Option 3: SendGrid (Professional)

1. **Sign up at sendgrid.com** (free tier available)
2. **Create API key** in dashboard
3. **Add environment variable:**
   ```
   SENDGRID_API_KEY=your-api-key
   FROM_EMAIL=your-verified-sender@domain.com
   ```

## How to Test

After setting up any option above:
1. Make a test booking with your email address
2. Check the server logs for confirmation
3. Check your email inbox

The system will automatically use whichever service you've configured.