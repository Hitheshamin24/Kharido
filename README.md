# 🛍️ Kharido — Modern Full-Stack E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-ekharido.vercel.app-blue?style=for-the-badge&logo=vercel)](https://ekharido.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> **Kharido** is a modern, high-performance, full-stack e-commerce web application built on the MERN stack. Designed with a clean aesthetic and intuitive user experience, it features customer shopping workflows, persistent cart management, role-based access control, and a comprehensive seller dashboard for managing product catalogs.

🔗 **Live Deployment:** [https://ekharido.vercel.app/](https://ekharido.vercel.app/)

---

## 📑 Table of Contents

- [Features](#-features)
  - [Customer Experience](#customer-experience)
  - [Cart & Checkout Flow](#cart--checkout-flow)
  - [Seller Management](#seller-management)
  - [Security & Authentication](#security--authentication)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#installation--setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Customer Experience
- **Product Catalog & Search:** Explore products with real-time search queries, category filters, and paginated browsing.
- **Product Details & Sizing:** Rich product pages featuring multi-image galleries, stock indicators, description, and intuitive size selector.
- **Cart-Aware Product View:** Opening a product's details automatically highlights and selects sizes that are already inside your cart.
- **Rupee (₹) Pricing Localization:** Fully localized pricing format tailored for Indian e-commerce standards.
- **Responsive Layout:** Optimized for mobile phones, tablets, and wide-screen desktops.

### Cart & Checkout Flow
- **Persistent Cart:** Fully synchronized cart state across client (Redux Toolkit) and database (MongoDB).
- **Slide-Over Cart Drawer:** Quick access cart drawer allows checking item counts, subtotal, and updating quantities without navigating away.
- **Unauthenticated Protection:** Prompt notifications and smooth redirects to login whenever an unauthenticated visitor adds an item to cart.
- **Auto-Sync on Login/Logout:** Instant cart loading upon login and complete cart cleanup upon logout to avoid state contamination between sessions.

### Seller Management
- **Role-Based Seller Portal:** Dedicated dashboard accessible only by users with the `seller` role (`/seller/products`).
- **Product Inventory Management:** Full CRUD operations for products (create, edit, delete).
- **Multi-Image Uploads:** Upload up to 5 product images per item handled through Multer and hosted via ImageKit.
- **Size & Stock Variations:** Specify available sizes (`S`, `M`, `L`, `XL`, `XXL`) and inventory quantities per product.

### Security & Authentication
- **Dual-Token JWT Architecture:** Short-lived access tokens stored safely in client state memory, coupled with secure `httpOnly` refresh tokens for silent token renewal.
- **Protected & Public Route Guards:** Route-level protection for sensitive pages (`ProtectedRoute` and `PublicRoute`).
- **Robust Validation:** Request payload validation using `express-validator` on the server and `react-hook-form` on the client.
- **Password Hashing:** Passwords encrypted using `bcryptjs`.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & React Redux
- **Routing:** [React Router v8](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Form Handling:** [React Hook Form](https://react-hook-form.com/)
- **HTTP Client:** [Axios](https://axios-http.com/) (with interceptors for automatic token refresh)
- **Notifications:** [React Toastify](https://fkhadra.github.io/react-toastify/)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/)
- **Server Framework:** [Express.js 5](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose ODM](https://mongoosejs.com/)
- **Authentication:** [JSON Web Token (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **File Upload & Storage:** [Multer](https://github.com/expressjs/multer) & [@imagekit/nodejs](https://imagekit.io/)
- **Validation & Parsing:** `express-validator`, `cookie-parser`, `cors`, `dotenv`

### Deployment & Hosting
- **Frontend & Backend:** Hosted on [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```text
Kharido/
├── client/                     # Frontend React (Vite) Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Shared UI components (ProtectedRoute, PublicRoute)
│   │   ├── features/           # Feature-based modular architecture
│   │   │   ├── auth/           # Auth UI, hooks, API, and Redux state slice
│   │   │   ├── cart/           # Cart drawer, cart UI, hooks, and Redux slice
│   │   │   └── products/       # Product list, details, seller dashboard, add/edit forms
│   │   ├── hooks/              # Global custom React hooks
│   │   ├── shared/             # Axios instance, interceptors, and base configurations
│   │   ├── App.jsx             # Main route definitions & application entry
│   │   ├── main.jsx            # React root mount & Redux Provider setup
│   │   └── index.css           # Global Tailwind CSS imports
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── server/                     # Backend Node.js / Express Application
│   ├── src/
│   │   ├── app/                # Express application configuration & middlewares
│   │   ├── config/             # Environment & configuration bindings
│   │   ├── controller/         # Request handlers (auth, products, cart)
│   │   ├── middleware/         # Auth, seller, and image upload middlewares
│   │   ├── models/             # Mongoose schemas (User, Product, Cart)
│   │   ├── routes/             # API routes definitions
│   │   ├── services/           # External service integrations (ImageKit)
│   │   ├── validator/          # Express-validator validation schemas
│   │   └── server.js           # Server bootstrap entry point
│   ├── package.json
│   └── vercel.json
│
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

Follow these steps to set up and run Kharido locally on your development machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) instance (local or MongoDB Atlas connection URI)
- [ImageKit](https://imagekit.io/) account (for product image uploads)

---

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Hitheshamin24/Kharido.git
cd Kharido
```

#### 2. Backend Setup
1. Navigate into the `server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` with the required environment variables (see below).
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server should now be running on `http://localhost:8000` (or your configured `PORT`).*

#### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `client/` pointing to your backend:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Environment Variables

### Server (`server/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for the Express server to listen on | `8000` |
| `MONGO_URI` | MongoDB connection connection string | `mongodb+srv://...` |
| `ACCESS_SECRET` | Secret key for signing JWT access tokens | `your_access_secret` |
| `ACCESS_SECRET_EXPIRE`| Expiry duration for access tokens | `15m` |
| `REFRESH_SECRET` | Secret key for signing JWT refresh tokens | `your_refresh_secret` |
| `REFRESH_SECRET_EXPIRE`| Expiry duration for refresh tokens | `7d` |
| `IMAGEKIT_PRIVATE_KEY`| ImageKit private API key | `private_...` |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | `public_...` |
| `IMAGEKIT_URL_ENDPOINT`| ImageKit endpoint URL | `https://ik.imagekit.io/...` |
| `VITE_FRONTEND_URL` | Allowed origin for CORS | `http://localhost:5173` |

### Client (`client/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | Base URL of the backend API | `http://localhost:8000` |

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user (`user` or `seller`) | No |
| `POST` | `/login` | Authenticate user & receive access token | No |
| `GET` | `/me` | Retrieve profile of the currently logged-in user | Yes |
| `POST` | `/refresh-token` | Renew expired access token using refresh cookie | Yes (Cookie) |
| `POST` | `/logout` | Invalidate session & clear refresh cookie | Yes |

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get all products (with pagination, search, category filter) | No |
| `GET` | `/:id` | Get single product details by ID | No |
| `GET` | `/seller` | Get all products created by the authenticated seller | Yes (Seller) |
| `POST` | `/` | Create a new product with image uploads | Yes (Seller) |
| `PUT` | `/:id` | Update product details or images | Yes (Seller) |
| `DELETE` | `/:id` | Delete product by ID | Yes (Seller) |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Fetch the current user's cart | Yes |
| `POST` | `/` | Add an item (product ID, size, quantity) to cart | Yes |
| `PUT` | `/` | Update quantity of a cart item | Yes |
| `POST` | `/remove` | Remove an item variation from cart | Yes |
| `DELETE` | `/` | Clear all items from cart | Yes |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
