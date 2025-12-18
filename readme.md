# StyleDecor Backend API

> **Backend project for styleDecor, StyleDecor is a modern appointment management system for a local decoration company that offers both in-studio consultations and on-site decoration services for homes and ceremonies**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload System](#file-upload-system)
- [Payment Integration](#payment-integration)
- [Email Notifications](#email-notifications)
- [Frontend Repository](#frontend-repository)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

StyleDecor Backend is a robust Node.js API that powers a modern appointment management system for decoration companies. The system handles everything from service bookings and decorator assignments to payment processing and project status tracking. It supports multiple user roles (Admin, Decorator, User) with role-based access control and provides comprehensive features for managing decoration services, consultations, and on-site project workflows.

### 🌟 Why StyleDecor?

Local decoration businesses face challenges like:
- Walk-in crowds and long waiting times
- No online booking system
- Difficulty managing multiple decorators
- Lack of coordination for on-site services

StyleDecor solves these problems with smart scheduling, real-time updates, and automated workflows.

## ✨ Features

### Core Functionality
- 🔐 **Secure Authentication**: JWT-based authentication with access tokens
- 👥 **Role-Based Access Control**: Admin, Decorator, and User roles with specific permissions
- 📅 **Smart Booking System**: Schedule consultations and on-site decoration services
- 💳 **Payment Integration**: Stripe Checkout for secure transactions
- 📧 **Email Notifications**: Automated email alerts for bookings and status updates
- 🖼️ **Cloud Storage**: Cloudinary integration for image uploads
- 🎨 **Service Management**: CRUD operations for decoration packages and services
- 📊 **Analytics Dashboard**: Revenue monitoring and service demand tracking
- 🚀 **Project Status Tracking**: Real-time updates on decoration project progress

### Advanced Features
- Search and filter services by name, type, and budget range
- Decorator availability management with unavailable dates tracking
- Featured decorator system
- Decorator earnings tracking and history
- Service category-based decorator specialization
- Booking cancellation and rescheduling
- Payment history and transaction records
- Multi-step project status workflow

## 🛠️ Tech Stack

### Core Technologies
- **Runtime**: Node.js (v18.x)
- **Framework**: Express.js (v4.x)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Stripe Checkout Sessions
- **Cloud Storage**: Cloudinary
- **Email**: Nodemailer with Gmail SMTP

### Key NPM Packages

```json
"dependencies": {
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.8.0",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.0.1",
    "multer": "^2.0.2",
    "nodemailer": "^7.0.11",
    "stripe": "^20.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.11",
    "prettier": "^3.7.4"
  }
```

## 📁 Project Structure

```
STYLEDECOR-BACKEND/
│
├── src/
│   ├── Controllers/
│   │   ├── booking.controller.js
│   │   ├── package.controller.js
│   │   ├── payment.controller.js
│   │   ├── service.controller.js
│   │   └── user.controller.js
│   │
│   ├── Middlewares/
│   │   ├── auth.middleware.js
│   │   └── multer.middleware.js
│   │
│   ├── Models/
│   │   ├── booking.model.js
│   │   ├── package.model.js
│   │   ├── payment.model.js
│   │   ├── service.model.js
│   │   └── user.model.js
│   │
│   ├── Routes/
│   │   ├── admin.routes.js
│   │   ├── booking.routes.js
│   │   ├── package.routes.js
│   │   ├── payment.routes.js
│   │   └── user.routes.js
│   │
│   ├── Utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── AsyncHandler.js
│   │   ├── Cloudinary.js
│   │   ├── ConnectDb.js
│   │   └── Email.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── .prettierignore
├── package.json
└── README.md
```

### Key Directories

- **Controllers**: Business logic for handling API requests
- **Middlewares**: Authentication, file upload, and request validation
- **Models**: Mongoose schemas for MongoDB collections
- **Routes**: API endpoint definitions with role-based protection
- **Utils**: Reusable utility functions and helper modules

## 🚀 Installation

### Prerequisites

- Node.js (v18.x or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager
- Cloudinary account
- Stripe account
- Gmail account (for SMTP)

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Tahmied/StyleDecor-Backend.git
cd styledecor-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server**
```bash
npm run dev
```

5. **For production**
```bash
npm start
```

The server will start on `http://localhost:2000` (or your specified PORT)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
PORT = 2000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/styledecor

# Frontend URL
FRONTEND_URI=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# JWT Tokens
ACCESS_TOKEN_KEY=your_secure_access_token_secret_key_here
ACCESS_TOKEN_EXPIRY=15m

# Stripe Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development
```

### Security Notes

⚠️ **Never commit your `.env` file to version control**
- Add `.env` to `.gitignore`
- Use strong, randomly generated secrets for JWT tokens
- Enable 2FA on Gmail and use App-Specific Passwords
- Keep Stripe keys secure and use test keys in development

## 📚 API Documentation

### Base URL
```
Development: http://localhost:2000/api/v1
Production: https://your-domain.com/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Private |
| GET | `/auth/profile` | Get user profile | Private |

### Service Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/services` | Get all services (with filters) | Public |
| GET | `/services/:id` | Get service details | Public |
| POST | `/services` | Create new service | Admin |
| PUT | `/services/:id` | Update service | Admin |
| DELETE | `/services/:id` | Delete service | Admin |

### Booking Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/bookings` | Create booking | User |
| GET | `/bookings/my-bookings` | Get user bookings | User |
| GET | `/bookings/:id` | Get booking details | User/Admin |
| PUT | `/bookings/:id` | Update booking | User |
| DELETE | `/bookings/:id` | Cancel booking | User |
| GET | `/bookings` | Get all bookings | Admin |
| PUT | `/bookings/:id/assign` | Assign decorator | Admin |
| PUT | `/bookings/:id/status` | Update project status | Decorator |

### Payment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/payments/create-checkout-session` | Create Stripe checkout session | User |
| POST | `/payments/verify` | Verify payment and create booking | User |
| GET | `/payments/history` | Get payment history | User |
| GET | `/payments` | Get all payments | Admin |

### User Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user details | Admin |
| PUT | `/users/:id/role` | Update user role | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

### Query Parameters for Services

```
GET /api/v1/services?search=wedding&category=Wedding&minPrice=10000&maxPrice=50000&sort=price&page=1&limit=10
```

- `search`: Search by service name
- `category`: Filter by service category (Wedding, Birthday, Corporate, Home, Seasonal)
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sort`: Sort by price, name, date (add `-` for descending)
- `page`: Page number for pagination
- `limit`: Items per page

## 🗄️ Database Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String,
  image: String,
  role: String (enum: ['user', 'decorator', 'admin'], default: 'user'),
  specialty: String (enum: ['Wedding', 'Birthday', 'Corporate', 'Home', 'Seasonal', 'All'], default: 'All'),
  rating: Number (default: 0),
  totalRatings: Number (default: 0),
  isVerified: Boolean (default: false),
  earnings: Number (default: 0),
  createdByEmail: String,
  phoneNumber: String,
  unavailableDates: [String],
  totalEarnings: Number (default: 0),
  earningsHistory: [
    {
      amount: Number,
      date: Date,
      bookingId: ObjectId (ref: Booking)
    }
  ],
  isFeaturedDecorator: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Service Model
```javascript
{
  serviceName: String (required, indexed),
  description: String (required),
  longDescription: String (required),
  duration: String (required),
  serviceType: String (default: "On-site"),
  features: [String],
  includes: [String],
  cost: Number (required, min: 0),
  unit: String (default: "per service"),
  serviceCategory: String (required, enum: ['Wedding', 'Birthday', 'Corporate', 'Home', 'Seasonal']),
  images: [String],
  rating: Number (default: 5.00),
  reviews: Number (default: 213),
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  customer: ObjectId (ref: User, required),
  customerName: String,
  customerImage: String,
  customerPhoneNumber: String,
  decoratorId: ObjectId (ref: User, required),
  decoratorName: String,
  decoratorNum: String,
  decoratorImage: String,
  serviceId: ObjectId (ref: Service, required),
  serviceName: String (required),
  servicePrice: Number (required),
  serviceCategory: String,
  eventDate: Date (required),
  eventTime: String (required),
  eventLocation: String,
  bookingNotes: String,
  status: String (enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'Assigned', 'Planning Phase', 'Materials Prepared', 'On the Way to Venue', 'Setup in Progress', 'Completed'], default: 'pending'),
  paymentStatus: String (enum: ['unpaid', 'paid'], default: 'unpaid'),
  transactionId: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  transactionId: String (required, unique, indexed),
  amount: Number (required),
  currency: String (default: "bdt"),
  serviceName: String (required),
  customerId: ObjectId (ref: User, required),
  customerPhone: String,
  bookingId: ObjectId (ref: Booking, required),
  status: String (default: "paid"),
  paymentDate: Date (default: Date.now),
  decoratorId: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Authentication & Authorization

### JWT Token Strategy

This API uses a **JWT-based authentication system**:

- **Access Token**: Stored in cookies or Authorization header, used for API requests
- Token expiry: 15 minutes (configurable via ACCESS_TOKEN_EXPIRY)

### Token Flow

```
1. User logs in → Server generates access token
2. Access token stored in HTTP-only cookie or Authorization header
3. Token validated on each protected route request
4. Token expires → User must log in again
```

### Role-Based Access Control (RBAC)

Three user roles with specific permissions:

**User Role**:
- Browse services
- Create bookings
- Make payments
- View own bookings
- Cancel bookings

**Decorator Role**:
- View assigned projects
- Update project status
- View earnings and earnings history
- Manage unavailable dates
- View booking details

**Admin Role**:
- All user and decorator permissions
- CRUD operations on services
- Manage all bookings
- Assign decorators to bookings
- User management
- View analytics
- Feature/unfeature decorators

### Middleware Implementation

The API uses two authentication middlewares:

**findUser Middleware** - For routes requiring any authenticated user:
```javascript
import { findUser } from './Middlewares/auth.middleware.js';

// Usage in routes
router.post('/bookings', findUser, bookingController.createBooking);
```

**ifAdmin Middleware** - For routes requiring admin access only:
```javascript
import { ifAdmin } from './Middlewares/auth.middleware.js';

// Usage in routes
router.post('/services', ifAdmin, serviceController.createService);
```

Both middlewares:
- Extract JWT from cookies (`accessToken`) or Authorization header (`Bearer <token>`)
- Verify token using `ACCESS_TOKEN_KEY`
- Fetch user from database (excluding password)
- Attach user to `req.user` (findUser) or `req.admin` (ifAdmin)
- ifAdmin additionally checks if user role is 'admin'

### Protected Route Example

```javascript
// User-accessible route
router.get('/bookings/my-bookings', 
  findUser, // Verify any authenticated user
  bookingController.getUserBookings
);

// Admin-only route
router.delete('/users/:id', 
  ifAdmin, // Verify admin role
  userController.deleteUser
);
```

## 📤 File Upload System

### Cloudinary Integration

The project uses **Cloudinary** for cloud-based image storage with the following features:

#### Configuration (Cloudinary.js Utility)

```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: './.env' });

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

#### Upload Function

```javascript
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Upload file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto'
    });
    
    // Delete local file after successful upload
    fs.unlinkSync(localFilePath);
    
    return uploadResponse;
  } catch (err) {
    // Clean up local file on error
    fs.unlinkSync(localFilePath);
    console.log(`Error uploading file: ${err}`);
    return null;
  }
}
```

#### Delete Function

```javascript
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.log("Cloudinary Delete Error:", error);
    return null;
  }
};
```

### Upload Workflow

1. **Multer** receives file and saves temporarily to disk
2. **Cloudinary utility** uploads file to cloud
3. Local file is deleted after successful upload
4. Cloudinary URL is stored in database
5. On deletion, file is removed from Cloudinary

### Supported File Types

- Images: JPG, PNG, GIF, WebP
- Resource type: Auto-detected
- Maximum file size: Configured in Multer middleware

## 💳 Payment Integration

### Stripe Checkout Configuration

The project integrates **Stripe Checkout Sessions** for secure payment processing:

#### Payment Flow

```
1. User selects service, decorator, and completes booking form
2. Frontend requests checkout session from backend
3. Backend creates Stripe checkout session with booking metadata
4. User is redirected to Stripe-hosted checkout page
5. User enters payment details on Stripe's secure form
6. Payment processed by Stripe
7. User redirected to success/cancel URL
8. Frontend calls verify endpoint with session ID
9. Backend verifies payment and creates booking + payment records
10. Decorator's unavailable dates updated
11. Email confirmations sent
```

#### Create Checkout Session

```javascript
export const CreateCheckoutSession = asyncHandler(async (req, res) => {
  const {
    serviceId,
    decoratorId,
    eventDate,
    eventTime,
    eventLocation,
    bookingNotes
  } = req.body;

  // Validate required fields
  if (!serviceId || !decoratorId || !eventDate || !eventTime) {
    throw new ApiError(400, "Missing required booking details");
  }

  // Fetch service details
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new ApiError(500, 'Unable to find the service to book');
  }

  const userId = req.user._id;

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "bdt",
          product_data: {
            name: service.serviceName
          },
          unit_amount: Math.round(service.cost * 100) // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URI}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URI}/service/${serviceId}`,
    metadata: {
      userId: userId.toString(),
      decoratorId,
      serviceId,
      eventDate,
      eventTime,
      eventLocation: eventLocation || '',
      serviceCategory: service.serviceCategory,
      bookingNotes: bookingNotes || "",
      price: service.cost
    }
  });

  return res.status(200).json({ url: session.url, id: session.id });
});
```

#### Verify Payment and Create Booking

```javascript
export const VerifyPaymentAndBook = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) throw new ApiError(400, "Session ID is required");

  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  // Verify payment status
  if (session.payment_status !== "paid") {
    throw new ApiError(400, "Payment not verified");
  }

  // Check for duplicate booking
  const existingBooking = await Booking.findOne({ 
    transactionId: session.payment_intent 
  });
  if (existingBooking) {
    return res.status(200).json(
      new ApiResponse(200, existingBooking, "Booking already exists")
    );
  }

  // Extract metadata
  const {
    userId,
    decoratorId,
    serviceId,
    eventDate,
    eventTime,
    eventLocation,
    bookingNotes,
    serviceCategory
  } = session.metadata;

  // Fetch related data
  const customer = await User.findById(userId);
  const decorator = await User.findById(decoratorId);
  const service = await Service.findById(serviceId);

  if (!customer || !decorator || !service) {
    throw new ApiError(404, "Data missing for paid booking.");
  }

  // Create booking
  const newBooking = await Booking.create({
    customer: customer._id,
    customerName: customer.name,
    customerImage: customer.image || "",
    customerPhoneNumber: customer.phoneNumber || "",
    decoratorId: decorator._id,
    decoratorName: decorator.name,
    decoratorNum: decorator.phoneNumber || "",
    decoratorImage: decorator.image || "",
    serviceId: service._id,
    serviceName: service.serviceName,
    servicePrice: session.amount_total / 100,
    serviceCategory: serviceCategory,
    eventDate: new Date(eventDate),
    eventTime: eventTime,
    eventLocation: eventLocation,
    bookingNotes: bookingNotes,
    status: "pending",
    paymentStatus: "paid",
    transactionId: session.payment_intent
  });

  // Create payment record
  const newPayment = await Payment.create({
    transactionId: session.payment_intent,
    amount: session.amount_total / 100,
    serviceName: service.serviceName,
    customerId: customer._id,
    customerPhone: customer.phoneNumber || "N/A",
    bookingId: newBooking._id,
    status: 'paid',
    decoratorId: decorator._id
  });

  // Update decorator's unavailable dates
  await User.findByIdAndUpdate(
    decorator._id,
    { $push: { unavailableDates: new Date(eventDate) } },
    { new: true }
  );

  const response = {
    newBooking: newBooking,
    newPayment: newPayment
  };

  return res.status(200).json(
    new ApiResponse(200, response, "Payment verified and booking created")
  );
});
```

#### Key Features

- **Stripe Checkout**: Hosted payment page for PCI compliance
- **Metadata Storage**: Booking details stored in session metadata
- **Transaction Tracking**: Stripe payment_intent used as transaction ID
- **Idempotency**: Duplicate booking prevention using transaction ID
- **Decorator Availability**: Automatic unavailable date management
- **BDT Currency**: Configured for Bangladesh Taka
- **Success/Cancel URLs**: Redirect users based on payment outcome

## 📧 Email Notifications

### Nodemailer Configuration

Automated email notifications using **Gmail SMTP**:

#### Email Utility (Email.js)

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

#### Email Templates

**Booking Confirmation**:
- Sent when booking is created
- Includes service details, date, location
- Payment confirmation

**Decorator Assignment**:
- Sent to user when decorator is assigned
- Decorator details and contact info

**Status Updates**:
- Sent when project status changes
- Real-time progress notifications

**Payment Receipt**:
- Sent after successful payment
- Transaction details and invoice

### Email Features

- HTML email templates
- Responsive design
- Personalized content
- Attachment support (receipts, invoices)

## 🌐 Frontend Repository

The frontend application is built with **Next.js** and **React**.

**Frontend Repository**: [StyleDecor Frontend](https://github.com/Tahmied/StyleDecor)

### Frontend Features
- Modern UI with DaisyUI and Tailwind CSS
- Framer Motion animations
- React Leaflet for service coverage maps
- Real-time booking updates
- Stripe Checkout integration
- Responsive design for mobile and desktop

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint configuration
- Use meaningful commit messages
- Write clean, documented code
- Test before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Tahmied Hossain**
- Email: tahmiedhossain4671@gmail.com
- GitHub: [@Tahmied](https://github.com/Tahmied)

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- Stripe API documentation
- Cloudinary SDK
- All open-source contributors

---

**Note**: The project demonstrates full-stack development skills including backend API design, database management, authentication, payment integration and cloud services.

For questions or support, please open an issue in the repository.