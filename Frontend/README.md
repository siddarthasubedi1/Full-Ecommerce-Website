# 🛍️ E-Commerce Frontend

The frontend of the Full-Stack E-Commerce Website, built using React, Vite, and Tailwind CSS. It provides a responsive shopping interface connected to a Django REST Framework backend.

## 🚀 Technologies

- React 19
- Vite
- Tailwind CSS 4
- React Router
- Axios
- Lucide React
- React Slick

## ✨ Features

- Home page and product browsing
- Product search and filtering
- Product details
- User registration and login
- Shopping cart
- Wishlist
- Order history
- User profile
- Product reviews
- Admin dashboard
- Responsive navigation and page layouts

## 📁 Folder Structure

```text
src/
├── assets/          # Images and static assets
├── components/      # Reusable UI components
│   ├── home/
│   ├── orders/
│   ├── products/
│   └── Registrations/
├── hooks/           # Custom React hooks
├── pages/           # Application pages
│   ├── admin/
│   ├── product/
│   ├── profile/
│   ├── Registrations/
│   └── wishlist/
├── services/        # Backend API service functions
├── App.jsx          # Application routes
├── index.css        # Global styles
└── main.jsx         # React entry point
```

## ⚙️ Installation

### 1. Open the frontend directory

```bash
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal. By default, Vite uses:

```text
http://localhost:5173/
```

## 🔗 Backend Connection

The frontend communicates with the Django REST Framework backend using Axios.

The API base URL is configured in:

```text
src/services/apiConfig.js
```

Current local backend address:

```text
http://127.0.0.1:8000
```

Make sure the Django backend is running before using features that require API requests.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build production files |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 👨‍💻 Development

The frontend uses reusable components, custom hooks, and service modules to organize the application and communicate with backend APIs.

For backend installation and complete project information, see the main [README](../README.md).