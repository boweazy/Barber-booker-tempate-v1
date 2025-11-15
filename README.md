# Barber Booker Template v1

**Professional Barbershop & Salon Booking System** by SmartFlow Systems

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A complete, production-ready booking management system for barbershops, salons, and service businesses with Google Calendar integration, Stripe payments, and email notifications.

---

## Overview

Barber Booker Template v1 is a full-stack booking management platform designed specifically for service-based businesses like barbershops, salons, spas, and personal services. It features real-time availability, automated email confirmations, Google Calendar synchronization, and integrated payment processing.

### Key Features

- **Online Booking System** - Customers book appointments 24/7
- **Google Calendar Integration** - Two-way sync with Google Calendar
- **Stripe Payment Processing** - Accept deposits and full payments
- **Email Notifications** - Automated booking confirmations via SendGrid
- **Staff Management** - Multiple service providers with individual schedules
- **Service Catalog** - Manage services, durations, and pricing
- **Customer Portal** - Client dashboard to manage bookings
- **Admin Dashboard** - Complete business overview and management
- **Drag-and-Drop Calendar** - Visual schedule management
- **Mobile Responsive** - Works perfectly on all devices
- **Role-Based Access** - Admin, staff, and customer roles
- **Waitlist Management** - Automatic notifications for cancellations

---

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** - Fast build tooling
- **TanStack Query** - Server state management
- **React Hook Form** - Form handling with validation
- **@dnd-kit** - Drag-and-drop functionality
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Modern utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Analytics and visualizations
- **Lucide React** - Beautiful icons
- **Wouter** - Lightweight routing

### Backend
- **Node.js** + Express
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - PostgreSQL database toolkit
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **Lusca** - CSRF protection
- **Express Rate Limit** - API throttling
- **WebSocket (ws)** - Real-time updates

### Integrations
- **Google OAuth2** - Google Calendar API integration
- **Stripe** - Payment processing (Checkout & Connect)
- **SendGrid** - Transactional emails
- **Nodemailer** - Email delivery with Gmail/Outlook support

### Database
- **PostgreSQL** (via Neon serverless)
- **Drizzle ORM** - Type-safe database access
- **Session Store** - PostgreSQL session management

---

## Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Google Cloud Platform account (for Calendar API)
- Stripe account
- SendGrid account (or Gmail/Outlook)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/smartflow-systems/Barber-booker-tempate-v1.git
cd Barber-booker-tempate-v1
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Environment Setup](#environment-setup) below)

4. **Initialize database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5000` 🎉

---

## Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/barbershop"

# Session Secret
SESSION_SECRET=your-random-session-secret-here-minimum-32-characters

# Google OAuth2 (for Calendar integration)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Google Calendar
# Option 1: OAuth2 (Recommended for production)
GOOGLE_OAUTH_ACCESS_TOKEN=your-access-token
GOOGLE_OAUTH_REFRESH_TOKEN=your-refresh-token

# Option 2: Service Account (For server-to-server)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration - Choose ONE option

# Option 1: Gmail (Easiest)
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-character-app-password

# Option 2: SendGrid (Best for production)
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Your Barbershop

# Option 3: Outlook/Hotmail
OUTLOOK_USER=your-email@outlook.com
OUTLOOK_PASS=your-app-password

# Business Configuration
BUSINESS_NAME=Your Barbershop Name
BUSINESS_EMAIL=contact@yourbusiness.com
BUSINESS_PHONE=+1234567890
BUSINESS_ADDRESS=123 Main St, City, State 12345
BUSINESS_TIMEZONE=America/New_York

# Feature Flags
ENABLE_PAYMENTS=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_GOOGLE_CALENDAR=true
ENABLE_SMS_NOTIFICATIONS=false

# Rate Limiting
API_RATE_LIMIT_WINDOW_MS=900000
API_RATE_LIMIT_MAX=100
```

---

## Setup Guides

### Google Calendar Integration

See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions on:
- Creating Google Cloud project
- Enabling Calendar API
- Configuring OAuth2 credentials
- Getting access and refresh tokens

**Quick Summary:**
1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google Calendar API
3. Create OAuth2 credentials
4. Configure OAuth consent screen
5. Add authorized redirect URIs
6. Copy Client ID and Client Secret to `.env`

### Email Setup

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions on:
- Gmail app passwords
- SendGrid API setup
- Outlook/Hotmail configuration
- Custom SMTP servers

**Quick Gmail Setup:**
1. Enable 2-factor authentication
2. Generate app password: Google Account → Security → App passwords
3. Copy 16-character password to `GMAIL_PASS` in `.env`

### Stripe Payment Setup

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Copy publishable and secret keys to `.env`
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
5. Add webhook events: `checkout.session.completed`, `payment_intent.succeeded`
6. Copy webhook signing secret to `.env`

---

## Features Deep Dive

### 1. Booking System

**Customer Features:**
- View available time slots in real-time
- Select service and staff member
- Choose date and time
- Add special requests/notes
- Receive instant confirmation email
- Reschedule or cancel bookings
- View booking history

**Admin Features:**
- Manual booking creation
- Block-off time slots
- Set staff availability
- Override double-bookings (if needed)
- View daily/weekly/monthly calendar
- Export booking reports

**API Endpoints:**
```http
POST   /api/bookings              # Create booking
GET    /api/bookings              # List bookings
GET    /api/bookings/:id          # Get booking details
PATCH  /api/bookings/:id          # Update booking
DELETE /api/bookings/:id          # Cancel booking
GET    /api/availability          # Check available slots
```

### 2. Google Calendar Sync

**Two-Way Synchronization:**
- Bookings created in app → Added to Google Calendar
- Events created in Google Calendar → Block time slots in app
- Booking canceled → Removed from Google Calendar
- Real-time conflict detection

**Features:**
- Per-staff calendar mapping
- Color-coded calendar events
- Automatic reminder emails
- Time zone handling
- Recurring availability blocks

### 3. Payment Processing

**Stripe Integration:**
- Deposit payments (e.g., 20% upfront)
- Full payment at booking
- Secure checkout flow
- Refund processing
- Payment history
- Receipt generation

**Payment Flows:**
```typescript
// Book with deposit
POST /api/bookings
{
  "serviceId": "uuid",
  "staffId": "uuid",
  "datetime": "2024-11-20T10:00:00Z",
  "paymentType": "deposit", // or "full"
  "amount": 10.00
}
```

### 4. Email Notifications

**Automated Emails:**
- **Booking Confirmation** - Sent immediately upon booking
- **Reminder Email** - Sent 24 hours before appointment
- **Cancellation Notice** - Sent when booking is canceled
- **Rescheduling Confirmation** - Sent when appointment is moved
- **Payment Receipt** - Sent after successful payment

**Email Templates:**
- Customizable HTML templates
- Dynamic content (customer name, service, time, etc.)
- Business branding (logo, colors)
- Mobile-responsive design

### 5. Admin Dashboard

**Key Metrics:**
- Today's appointments
- This week's revenue
- Upcoming bookings count
- Customer satisfaction (if reviews enabled)
- Most popular services
- Staff performance

**Management Tools:**
- Calendar view (day/week/month)
- Customer database
- Service catalog management
- Staff scheduling
- Reports and analytics
- Settings and configuration

---

## Database Schema

### Key Tables

```sql
-- Users (customers, staff, admins)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'customer', -- admin, staff, customer
  created_at TIMESTAMP DEFAULT NOW()
);

-- Services (haircuts, shaves, etc.)
CREATE TABLE services (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  deposit_required BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Staff members
CREATE TABLE staff (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  display_name VARCHAR(255) NOT NULL,
  bio TEXT,
  photo_url TEXT,
  google_calendar_id VARCHAR(255),
  is_accepting_bookings BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Staff availability
CREATE TABLE staff_availability (
  id UUID PRIMARY KEY,
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES users(id),
  service_id UUID REFERENCES services(id),
  staff_id UUID REFERENCES staff(id),
  booking_datetime TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed', -- pending, confirmed, completed, cancelled, no_show
  notes TEXT,
  google_calendar_event_id VARCHAR(255),
  payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, deposit_paid, paid, refunded
  payment_amount DECIMAL(10,2),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_type VARCHAR(20) NOT NULL, -- deposit, full_payment, refund
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, succeeded, failed, refunded
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API Reference

### Authentication

```http
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Login
POST   /api/auth/logout            # Logout
GET    /api/auth/me                # Get current user
POST   /api/auth/forgot-password   # Password reset request
POST   /api/auth/reset-password    # Reset password
```

### Bookings

```http
GET    /api/bookings                      # List all bookings
POST   /api/bookings                      # Create booking
GET    /api/bookings/:id                  # Get booking
PATCH  /api/bookings/:id                  # Update booking
DELETE /api/bookings/:id                  # Cancel booking
GET    /api/bookings/upcoming             # Upcoming bookings
GET    /api/bookings/history              # Past bookings
POST   /api/bookings/:id/reschedule       # Reschedule booking
POST   /api/bookings/:id/confirm          # Confirm booking
POST   /api/bookings/:id/complete         # Mark completed
```

### Services

```http
GET    /api/services                      # List services
POST   /api/services                      # Create service (admin)
GET    /api/services/:id                  # Get service
PATCH  /api/services/:id                  # Update service (admin)
DELETE /api/services/:id                  # Delete service (admin)
```

### Staff

```http
GET    /api/staff                         # List staff
POST   /api/staff                         # Add staff (admin)
GET    /api/staff/:id                     # Get staff
PATCH  /api/staff/:id                     # Update staff
GET    /api/staff/:id/availability        # Get availability
POST   /api/staff/:id/availability        # Set availability
GET    /api/staff/:id/schedule            # Get schedule
```

### Availability

```http
GET    /api/availability                  # Check available slots
POST   /api/availability/check            # Check specific slot
GET    /api/availability/:staffId         # Staff availability
```

### Payments

```http
POST   /api/payments/create-intent        # Create payment intent
POST   /api/payments/confirm              # Confirm payment
POST   /api/payments/:id/refund           # Process refund
GET    /api/payments/:bookingId           # Get payment details
```

### Admin

```http
GET    /api/admin/dashboard               # Dashboard stats
GET    /api/admin/customers               # Customer list
GET    /api/admin/reports/revenue         # Revenue report
GET    /api/admin/reports/bookings        # Bookings report
GET    /api/admin/settings                # Business settings
PATCH  /api/admin/settings                # Update settings
```

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (frontend + backend) |
| `npm start` | Run production server |
| `npm run check` | Type-check TypeScript |
| `npm run db:push` | Push database schema changes |
| `npm run sync` | Auto-sync with git repository |

### Project Structure

```
Barber-booker-tempate-v1/
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/            # UI components
│   │   │   ├── booking/           # Booking-related components
│   │   │   ├── calendar/          # Calendar views
│   │   │   ├── dashboard/         # Dashboard widgets
│   │   │   └── ui/                # Reusable UI components
│   │   ├── pages/                 # Route pages
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utilities and helpers
│   │   └── App.tsx                # Main app component
│   └── index.html
├── server/                        # Express backend
│   ├── index.ts                   # Server entry point
│   ├── routes.ts                  # API route definitions
│   ├── db.ts                      # Database connection
│   ├── auth/                      # Authentication logic
│   │   ├── passport.ts            # Passport configuration
│   │   └── middleware.ts          # Auth middleware
│   ├── services/                  # Business logic
│   │   ├── booking.ts             # Booking service
│   │   ├── calendar.ts            # Google Calendar integration
│   │   ├── email.ts               # Email service
│   │   ├── payment.ts             # Stripe integration
│   │   └── availability.ts        # Availability calculator
│   └── middleware/                # Express middleware
│       └── security.ts            # Security configurations
├── shared/                        # Shared types and schemas
│   ├── schema.ts                  # Zod validation schemas
│   └── types.ts                   # TypeScript types
├── scripts/                       # Utility scripts
│   └── auto-sync.sh               # Git auto-sync script
├── docs/                          # Documentation
│   ├── EMAIL_SETUP.md             # Email configuration guide
│   ├── GOOGLE_OAUTH_SETUP.md      # Google Calendar setup
│   └── SECURITY.md                # Security best practices
├── .env.example                   # Environment template
├── package.json
└── README.md
```

---

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use production database URL
- [ ] Generate secure `SESSION_SECRET` (32+ characters)
- [ ] Configure production Google OAuth redirect URI
- [ ] Use Stripe production API keys
- [ ] Set up SendGrid production API key
- [ ] Configure HTTPS (required for Stripe)
- [ ] Set up domain and SSL certificate
- [ ] Configure CORS for your domain
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Test all payment flows
- [ ] Test email delivery

### Docker Deployment

*Coming soon - Dockerfile will be added in the next update*

### Recommended Hosting

- **Backend**: Heroku, Railway, Render, DigitalOcean App Platform
- **Database**: Neon, Supabase, Railway Postgres
- **Frontend CDN**: Vercel, Netlify (if separated)

---

## Security

### Implemented Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **Session Management** - Secure session storage
- ✅ **CSRF Protection** - Lusca middleware
- ✅ **Rate Limiting** - API throttling (100 req/15min)
- ✅ **Helmet** - HTTP security headers
- ✅ **Input Validation** - Zod schema validation
- ✅ **SQL Injection Prevention** - Parameterized queries via Drizzle ORM
- ✅ **XSS Protection** - React auto-escaping
- ✅ **HTTPS Enforcement** - Required for production
- ✅ **Secure Payment Processing** - PCI-compliant via Stripe

### Security Best Practices

See [SECURITY.md](./SECURITY.md) for detailed security guidelines including:
- Password requirements
- Session configuration
- API key management
- Data encryption
- Compliance considerations (GDPR, CCPA)

---

## Customization Guide

### Branding

Update business information in `.env`:
```env
BUSINESS_NAME=Your Business Name
BUSINESS_EMAIL=contact@yourbusiness.com
BUSINESS_PHONE=+1234567890
```

### Styling

- Colors: Edit `tailwind.config.js` theme colors
- Logo: Replace logo files in `client/public/`
- Fonts: Update font imports in `client/src/index.css`

### Email Templates

Email templates are located in `server/services/email/templates/`

Customize:
- `booking-confirmation.html`
- `booking-reminder.html`
- `booking-cancelled.html`

### Services & Pricing

Add/modify services via Admin Dashboard or directly in database:
```sql
INSERT INTO services (name, description, duration_minutes, price, deposit_amount)
VALUES ('Premium Haircut', 'Includes wash, cut, and style', 45, 50.00, 10.00);
```

---

## Troubleshooting

### Google Calendar not syncing

1. Check Google OAuth credentials in `.env`
2. Ensure Calendar API is enabled in Google Cloud Console
3. Verify redirect URI matches exactly
4. Check staff member has `google_calendar_id` set

### Emails not sending

1. Verify email credentials in `.env`
2. Check spam folder
3. For Gmail: Ensure app password is used (not account password)
4. For SendGrid: Check API key permissions

### Stripe payments failing

1. Verify Stripe keys (test vs production)
2. Check webhook endpoint is publicly accessible
3. Ensure HTTPS is enabled in production
4. Verify webhook signing secret

### Database connection errors

1. Check `DATABASE_URL` format
2. Ensure database is running
3. Run `npm run db:push` to sync schema
4. Check network access to database

---

## Roadmap

### Current Version: 1.0.0

### Planned Features

- [ ] **SMS Notifications** - Twilio integration
- [ ] **Multi-Location Support** - Multiple shop locations
- [ ] **Loyalty Program** - Points and rewards system
- [ ] **Gift Cards** - Digital gift card sales
- [ ] **Reviews & Ratings** - Customer feedback system
- [ ] **Instagram Integration** - Portfolio showcase
- [ ] **Mobile App** - React Native apps
- [ ] **Advanced Analytics** - Business intelligence dashboard
- [ ] **Waitlist Management** - Automated waitlist notifications
- [ ] **Membership Subscriptions** - Monthly/yearly memberships
- [ ] **Team Chat** - Internal staff messaging
- [ ] **Inventory Management** - Product stock tracking

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow TypeScript and React best practices
4. Add tests for new features
5. Commit with conventional commits
6. Push and open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details

---

## Support

- **Documentation**: [GitHub Wiki](https://github.com/smartflow-systems/Barber-booker-tempate-v1/wiki)
- **Issues**: [GitHub Issues](https://github.com/smartflow-systems/Barber-booker-tempate-v1/issues)
- **Email**: support@smartflowsystems.com
- **Community**: [Discord Server](https://discord.gg/smartflowsystems) *(coming soon)*

---

## Acknowledgments

- **Stripe** - Payment processing
- **Google Calendar API** - Calendar integration
- **SendGrid** - Email delivery
- **Radix UI** - Accessible components
- **Tailwind CSS** - Styling framework
- **React** - Frontend framework
- **Drizzle ORM** - Database toolkit

---

**Made with ❤️ by SmartFlow Systems**

Part of the SmartFlow Systems ecosystem - Professional booking solutions for modern businesses.
