# 🛒 Full-Stack E-Commerce Website

### React • Django REST Framework • PostgreSQL

A full-stack e-commerce web application designed to demonstrate modern frontend development, RESTful API integration, database management, and user authentication.

The project combines a responsive React storefront with a Python Django backend.

---

## 🛠 Technology Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router

**Backend**
- Python
- Django
- Django REST Framework
- JWT Authentication

**Database**
- PostgreSQL

**Product Data**
- DummyJSON API

## ✨ Features

- Product listing and detailed product views
- Product search and filtering
- Category and brand filtering
- Responsive user interface
- User registration and login
- JWT authentication
- Shopping cart management (under development)

## 📸 Screenshots

Add actual screenshots of the homepage, product listing, product details, and shopping cart.

## 📁 Project Structure

```text
Full-Ecommerce-Website/
├── Backend/
│   ├── account/
│   ├── product_app/
│   ├── cart/
│   └── manage.py
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/siddarthasubedi1/Full-Ecommerce-Website.git
cd Full-Ecommerce-Website
```

### 2. Backend setup

```bash
cd Backend
python -m venv env
```

Activate the virtual environment, install the project's Python dependencies, configure PostgreSQL and environment variables, and then run:

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend setup

Open a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

## 🔐 Security

Sensitive credentials and environment configuration should not be committed to GitHub. Use environment variables for database credentials and Django secrets.

## 📌 Project Status

Actively under development. Cart integration and checkout-related functionality are being developed and tested.

## 🔮 Planned Improvements

- Checkout and order management
- Order history
- Product reviews and ratings
- Automated backend and frontend testing
- Deployment and CI/CD

---

Developed as a full-stack software development project.
