# Google OAuth2 Setup Guide for Barbershop Booking System

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name your project: "Barbershop Booking System"
4. Click "Create"

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click on it and press "Enable"

## Step 3: Create OAuth2 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in required fields:
     - App name: "Barbershop Booking System"
     - User support email: Your email
     - Developer contact email: Your email
   - Add scopes: `https://www.googleapis.com/auth/calendar` and `https://www.googleapis.com/auth/calendar.events`
   - Add test users (your email)

4. Create OAuth client ID:
   - Application type: "Web application"
   - Name: "Barbershop Calendar Integration"
   - Authorized redirect URIs:
     - `https://barber-booker-boweazy123.replit.app/auth/google/callback`
     - `http://localhost:5000/auth/google/callback` (for local testing)

## Step 4: Configure Replit Secrets

1. In your Replit project, go to "Secrets" tab (lock icon)
2. Add these environment variables:
   - Key: `GOOGLE_CLIENT_ID`, Value: [Your Client ID from step 3]
   - Key: `GOOGLE_CLIENT_SECRET`, Value: [Your Client Secret from step 3]

## Step 5: Test the Integration

1. Navigate to: `https://barber-booker-boweazy123.replit.app/auth/google`
2. You should be redirected to Google's consent screen
3. Grant calendar permissions
4. You'll be redirected back with a success message
5. Check the console logs for OAuth flow details

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Ensure the redirect URI in Google Console exactly matches your Replit URL
   - Check for trailing slashes

2. **"invalid_client" error**:
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correctly set
   - Ensure no extra spaces in the secrets

3. **"access_denied" error**:
   - User denied permissions
   - Check OAuth consent screen configuration

4. **"invalid_grant" error**:
   - Authorization code expired (only valid for 10 minutes)
   - Try the flow again

### Console Log Messages to Look For:

- `[OAuth] Initiating Google OAuth for user: admin`
- `[OAuth] Generated auth URL: https://accounts.google.com/...`
- `[OAuth] Callback received - Code: present, State: admin`
- `[OAuth] Token exchange successful`
- `[OAuth] Token successfully stored with ID: X`
- `[OAuth] Calendar access test: SUCCESS`

## Testing Endpoints

After setup, you can test these endpoints:

1. **Start OAuth Flow**: `/auth/google`
2. **Test Stored Token**: `/auth/google/test/admin`
3. **Manual Callback Test**: `/auth/google/callback?code=TEST&state=admin`

## Security Notes

- Client secrets are stored securely in Replit's secret management
- Tokens are encrypted and stored in your PostgreSQL database
- Refresh tokens allow long-term calendar access
- All OAuth flows use HTTPS in production