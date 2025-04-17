# Modern E-commerce Platform

A robust, feature-rich e-commerce platform built with Next.js, TypeScript, Drizzle ORM, and PostgreSQL. This application provides a complete solution with user authentication, product management, shopping cart functionality, checkout process, and administrative capabilities.

<div align="center">
  <a href="https://www.marwan-boudiab.com/projects/aspireon#demo">
    <img src="https://crrwymojtb.ufs.sh/f/0ge4q9E4PJeZYHLt9xWXG7vDzibQEhytf0l96KuOsZRcJ8CL" alt="E-commerce Platform Demo" width="600" style="border-radius: 12px;">
    <br>
    <p><strong>▶️ Click to watch project demo</strong></p>
  </a>
</div>

## 🚀 Features

### Authentication & User Management
- Multiple authentication methods (Google Sign-in, Email/Password)
- JWT Session Management
- Comprehensive Profile Management
- Theme Toggle (Light/Dark)
- Admin User Management Panel with role-based controls

### Shopping & Product Experience
- **For Guests**:
  - Product browsing with homepage display
  - Quick view product modal
  - Detailed product pages
  - Shopping cart management
  - Advanced search, filtering, and sorting
  - Shareable product URLs

- **For Authenticated Users**:
  - All guest features
  - Product review submission
  - Order history tracking
  - Complete checkout process

### Advanced Checkout Process
- Leaflet map address selection
- Multiple payment method integration (PayPal, Stripe, Cash on Delivery)
- Multi-step checkout flow with navigation
- Order review and completion

### Powerful Admin Dashboard
- Comprehensive analytics
  - Revenue metrics
  - Sales statistics
  - Customer data
  - Product performance visualization
- Complete order management
- Full product CRUD operations

### Technical Capabilities
- Fully responsive design
- Persistent navigation with authentication status
- Sophisticated state management (cart, auth)
- Permission-based access controls
- Theme preference persistence

## 🛠️ Technology Stack

- **Frontend**:
  - Next.js 14
  - React 18
  - TypeScript
  - Tailwind CSS with shadcn/ui components
  - zustand for state management

- **Backend**:
  - Next.js Server Actions
  - Drizzle ORM with PostgreSQL
  - NextAuth.js for authentication
  - Zod for validation

- **Integrations**:
  - Google Maps API
  - Stripe & PayPal for payments
  - UploadThing for file uploads
  - Resend for email notifications

## 📦 Getting Started

### Prerequisites
- Node.js 20.18.0 or higher
- pnpm 9.12.1 or higher
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd next-typescript-drizzle-postgress
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_NAME=
   NEXT_PUBLIC_APP_TITLE=
   NEXT_PUBLIC_APP_SUBTITLE=
   NEXT_PUBLIC_APP_DESCRIPTION=

   # Database (Vercel or Neon DB URL)
   POSTGRES_URL=

   # NextAuth
   AUTH_SECRET=
   AUTH_RESEND_KEY=
   AUTH_GOOGLE_ID=
   AUTH_GOOGLE_SECRET=

   # Google Map
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

   # PayPal
   PAYPAL_CLIENT_ID=
   PAYPAL_APP_SECRET=
   PAYPAL_API_URL=

   # Uploadthing
   UPLOADTHING_TOKEN=

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=

   # Resend
   RESEND_API_KEY=
   SENDER_EMAIL=

   # Settings
   PAGE_SIZE=
   PAYMENT_METHODS=
   DEFAULT_PAYMENT_METHOD=
   USER_ROLES="admin, user"
   ```

4. Set up the database schema
   ```bash
   pnpm drizzle-kit push
   ```

5. Start the development server
   ```bash
   pnpm dev
   ```
   The application will be available at http://localhost:3000

### Database Management
- Run Drizzle Studio to manage your database: `pnpm drizzle-kit studio`
- Generate migration files: `pnpm drizzle-kit generate`
- Apply migrations: `pnpm drizzle-kit migrate`
- Push schema changes: `pnpm drizzle-kit push`

## 🔧 Customization

### Themes
The application supports both light and dark themes out of the box, using next-themes for theme management.

### Payment Methods
Configure available payment methods and defaults in the .env file:
```
PAYMENT_METHODS="paypal,stripe,cod"
DEFAULT_PAYMENT_METHOD="stripe"
```

### User Roles
Define user roles in the .env file:
```
USER_ROLES="admin,user"
```

## 🧪 Development Workflow

### Git Workflow
```bash
# Clone repository
git clone [repository-url]

# Create a new branch for a feature
git branch feature/new-feature

# Switch to the branch
git switch feature/new-feature

# Make changes, then commit
git add .
git commit -m "Add new feature"

# Switch back to main branch
git switch master

# Merge changes
git merge feature/new-feature
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

This project uses various open-source libraries and tools:
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
- [Stripe](https://stripe.com/)
- [PayPal](https://developer.paypal.com/)
- [And many more...](#)