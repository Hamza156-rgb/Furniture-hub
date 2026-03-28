# 🪵 FurniHub — Pakistan's Furniture Marketplace

A full-stack MERN application where furniture shop owners can list their shops, categories, and products — and customers can browse shops by city and explore complete product collections.

---

## 📁 Project Structure

```
furnihub/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── models/       ← Mongoose schemas (User, Shop, Category, Product)
│   ├── routes/       ← API routes (auth, shops, categories, products, users)
│   ├── middleware/   ← JWT auth + file upload
│   ├── uploads/      ← Uploaded images (local storage)
│   └── server.js     ← Entry point
│
└── frontend/         ← React app
    └── src/
        ├── pages/    ← HomePage, ShopPage, LoginPage, RegisterPage, DashboardPage, ProfilePage
        ├── components/
        │   ├── layout/   ← Navbar
        │   └── shop/     ← ShopCard, ProductCard
        ├── context/  ← AuthContext (JWT + user state)
        └── utils/    ← api.js (all Axios calls)
```

---

## ⚙️ Prerequisites

- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

---

## 🚀 Setup & Run

### 1. Clone / extract the project

```bash
cd furnihub
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/furnihub   # or your Atlas URI
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

Backend runs on: **http://localhost:5000**

---

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `.env` (optional — defaults to localhost):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

Frontend runs on: **http://localhost:3000**

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user or shop owner |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Get current user |

### Shops
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/shops` | All shops (filter: city, search) |
| GET  | `/api/shops/cities` | List of cities with shops |
| GET  | `/api/shops/my` | Owner's own shop |
| GET  | `/api/shops/:id` | Single shop with products |
| PUT  | `/api/shops/my` | Update shop profile + logo |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/categories/shop/:shopId` | Shop's categories |
| POST | `/api/categories` | Add category (owner) |
| PUT  | `/api/categories/:id` | Update category (owner) |
| DELETE | `/api/categories/:id` | Delete category (owner) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/products` | All products (filter: city, categoryName) |
| GET  | `/api/products/shop/:shopId` | Shop's products |
| POST | `/api/products` | Add product + images (owner) |
| PUT  | `/api/products/:id` | Update product (owner) |
| DELETE | `/api/products/:id` | Delete product (owner) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/users/profile` | Get profile |
| PUT  | `/api/users/profile` | Update profile |
| PUT  | `/api/users/change-password` | Change password |

---

## 👤 User Types

### Regular User
- Register with: First Name, Last Name, Email, Phone, City, Address
- Browse shops filtered by city
- View complete shop profiles with categories & products

### Shop Owner
- Register with all user fields plus:
  - Shop Name, Shop Phone Number
  - Shop City, Shop Location/Area, Shop Address
  - Shop Timings, Tagline
- **Dashboard features:**
  - Overview (stats + recent products)
  - Category Manager (add, edit, delete with emoji icons)
  - Product Manager (add, edit, delete with image uploads)
  - Shop Profile Editor (all fields + logo upload)

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File Upload | Multer (local) — swap with Cloudinary for production |
| Validation | express-validator |

---

## 🌐 Production Deployment

1. **Backend** → Deploy to Railway, Render, or any VPS
2. **Frontend** → `npm run build` → Deploy to Vercel or Netlify
3. **Database** → Use MongoDB Atlas
4. **Images** → Replace local Multer with Cloudinary (config ready in `.env.example`)
5. Set `CLIENT_URL` in backend `.env` to your frontend domain
6. Set `REACT_APP_API_URL` in frontend `.env` to your backend URL

---

## 📞 Support

Built with ❤️ for Pakistan's furniture industry.
