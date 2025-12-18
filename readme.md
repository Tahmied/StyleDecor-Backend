# StyleDecor - Backend API

> **Live Application**: [https://style-decor.vercel.app/](https://style-decor.vercel.app/)
> 
> **Frontend Repo**: [FrontEnd Code](https://github.com/Tahmied/StyleDecor)

## 📖 About The Project

This is the robust backend API powering **StyleDecor**, handling business logic, data persistence, and secure transaction processing. It is built to be scalable and secure, serving the Next.js frontend with low-latency responses.

## ✨ System Features

*   **RESTful API Architecture**: Organized endpoints for Users, Services, Bookings, and Payments.
*   **Secure Authentication**: implementing JWT (Access + Refresh Tokens) and Bcrypt.
*   **Payment Processing**: Stripe Checkout Sessions with Webhook verification.
*   **Email Notifications**: Automated emails via Nodemailer (SMTP).
*   **Media Management**: Direct integration with Cloudinary for handling multipart form data (Multer).
*   **Role-Based Middleware**: \`ifAdmin\`, \`findUser\` middlewares to protect sensitive routes.
*   **Database Statistics**: Aggregation pipelines for Admin Dashboard analytics (Revenue aggregation, Service popularity).

---

## 🚀 Technology Stack

The backend implements a classic MVC (Model-View-Controller) pattern with the following layer separation:

1.  **Entry Point**: \`server.js\` initializes the Express app and connects to MongoDB.
2.  **Routes**: \`src/Routes/\` define API endpoints and map them to controllers.
3.  **Controllers**: \`src/Controllers/\` contain business logic and response handling.
4.  **Models**: \`src/Models/\` define Mongoose schemas and data validation.
5.  **Middlewares**: \`src/Middlewares/\` handle authentication (JWT) and file processing (Multer).

## 🗄️ Database Schemas (Data Models)

### User Model (\`User\`)
The central entity for all platform users (Customers, Decorators, Admins).
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`name\` | String | Yes | - | Full display name. |
| \`email\` | String | Yes | - | Unique identifier, lowercase, trimmed. |
| \`password\` | String | No | - | Hashed via Bcrypt (optional for Google Auth users). |
| \`role\` | String | No | \`'user'\` | Controls permissions: \`'user'\`, \`'admin'\`, \`'decorator'\`. |
| \`image\` | String | No | - | URL to Cloudinary hosted profile picture. |
| \`specialty\` | String | No | \`'All'\` | (Decorator) E.g., 'Wedding', 'Corporate'. |
| \`rating\` | Number | No | \`0\` | Average rating from user reviews. |
| \`earnings\` | Number | No | \`0\` | Total earnings for the decorator. |
| \`isVerified\` | Boolean | No | \`false\` | Verified badge status for decorators. |

### Service Model (\`Service\`)
Represents the decoration packages available for booking.
| Field | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| \`serviceName\` | String | Yes | - | Title of the service/package. |
| \`description\` | String | Yes | - | Brief overview for card view. |
| \`longDescription\`| String | Yes | - | Markdown/HTML support for details page. |
| \`cost\` | Number | Yes | - | Base price in Taka/USD. |
| \`serviceCategory\`| String | Yes | - | 'Wedding', 'Birthday', 'Corporate', 'Home', 'Seasonal'. |
| \`images\` | [String]| No | \`[]\` | Array of Cloudinary Image URLs. |
| \`features\` | [String]| No | \`[]\` | List of key selling points. |
| \`includes\` | [String]| No | \`[]\` | List of items included in the package. |

### Booking Model (\`Booking\`)
Records the transaction between a User and a Service/Decorator.
| Field | Type | Description |
| :--- | :--- | :--- |
| \`customer\` | ObjectId (Ref: User) | The user who made the booking. |
| \`decoratorId\` | ObjectId (Ref: User) | The assigned decorator. |
| \`serviceId\` | ObjectId (Ref: Service) | The service being booked. |
| \`eventDate\` | Date | When the event is scheduled. |
| \`eventTime\` | String | Time slot for the event. |
| \`status\` | String | Enum: \`'pending'\`, \`'confirmed'\`, \`'in-progress'\`, \`'completed'\`, \`'cancelled'\`. |
| \`paymentStatus\` | String | Enum: \`'unpaid'\`, \`'paid'\`. |
| \`transactionId\` | String | Stripe session ID or manual transaction reference. |

---

## ⚙️ Environment Variables (\`.env\`)

Create a file named \`.env\` in the \`styledecor backend/\` directory. Add the following keys:

```ini
# ----------------------------------
# Server Configuration
# ----------------------------------
PORT = 2000
NODE_ENV = development

# ----------------------------------
# Database Connection
# ----------------------------------
MONGODB_URI = mongodb+srv://<username>:<password>@cluster.mongodb.net

# ----------------------------------
# Authentication (JWT)
# ----------------------------------
# Key to sign short-lived access tokens
ACCESS_TOKEN_KEY = <random_secure_string>
ACCESS_TOKEN_EXPIRY = 1d

# Key to sign long-lived refresh tokens
REFRESH_TOKEN_KEY = <another_random_secure_string>
REFRESH_TOKEN_EXPIRY = 10d

# ----------------------------------
# Payment Gateway (Stripe)
# ----------------------------------
STRIPE_SECRET_KEY = <sk_test_...>

# ----------------------------------
# Image Storage (Cloudinary)
# ----------------------------------
CLOUDINARY_CLOUD_NAME = <your_cloud_name>
CLOUDINARY_API_KEY = <your_api_key>
CLOUDINARY_API_SECRET = <your_api_secret>

# ----------------------------------
# Email Service (SMTP / Nodemailer)
# ----------------------------------
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465
SMTP_SECURE = true
SMTP_USER = <your_email@gmail.com>
SMTP_PASS = <your_app_password>

# ----------------------------------
# Frontend URL (CORS & Redirects)
# ----------------------------------
FRONTEND_URI = http://localhost:3000
```

## 🔑 Authentication Flow

The system uses **JSON Web Tokens (JWT)** for stateless authentication.

1.  **Login/Register**: Server issues an \`accessToken\` (short-lived) and a \`refreshToken\` (long-lived).
2.  **Access**: The \`accessToken\` must be included in the \`Authorization\` header as \`Bearer <token>\`.
3.  **Cookies**: Tokens are also securely set in HTTP-only cookies for browser persistence.
4.  **Middleware**:
    *   \`findUser\`: Verifies token and attaches user to \`req.user\`.
    *   \`ifAdmin\`: Verifies token AND checks if \`req.user.role === 'admin'\`.

## 📡 API Reference & Payloads

### 1. User Management
**POST** \`/api/v1/users/register\` (Multipart/Form-Data)
*   **Body**:
    *   \`name\`: "John Doe"
    *   \`email\`: "john@example.com"
    *   \`password\`: "securePassword123"
    *   \`image\`: (File Object)

**POST** \`/api/v1/users/login\`
*   **Body**: \`{ "email": "...", "password": "..." }\`

### 2. Service Management (Admin Only)
**POST** \`/api/v1/services/add-service\` (Multipart/Form-Data)
*   **Body**:
    *   \`serviceName\`, \`description\`, \`cost\`, \`serviceCategory\`
    *   \`images\`: (Multiple File Objects)

### 3. Bookings
**POST** \`/api/v1/bookings/book-service\`
*   **Body**:
    *   \`serviceId\`: "65a..."
    *   \`decoratorId\`: "65b..."
    *   \`eventDate\`: "2024-12-25"
    *   \`eventTime\`: "18:00"

## 💳 Payment Integration

Integration with **Stripe** uses Checkout Sessions.
*   **Endpoint**: \`/api/v1/payment/create-checkout-session\`
*   **Flow**:
    1.  Frontend sends booking details.
    2.  Backend talks to Stripe -> returns \`url\`.
    3.  Frontend redirects user to Stripe \`url\`.
    4.  Success/Cancel redirects are handled via \`process.env.FRONTEND_URI\`.
