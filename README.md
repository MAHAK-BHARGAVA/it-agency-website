# IT Agency Website

A modern, full-stack IT agency website built with **Next.js, React, TypeScript, Tailwind CSS, Prisma, and MySQL**.

The project combines the frontend website, admin dashboard, API routes, database layer, authentication, and CMS functionality within a single Next.js application.

---

## 🚀 Project Overview

This project is a database-driven IT agency website designed to manage and showcase an agency's services, portfolio, testimonials, FAQs, contact information, and other business content.

The application includes:

* Modern responsive agency website
* Admin dashboard
* Dynamic services
* Portfolio/projects
* Testimonials
* FAQs
* Contact and lead management
* Site settings
* Homepage content management
* Authentication for admin functionality
* MySQL database integration
* Prisma ORM
* Cloudinary image management
* SEO-friendly dynamic pages
* Location-based service pages

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* GSAP
* Lucide React
* HTML5
* CSS3

### Backend / Server-side

* Next.js API Routes
* Prisma ORM
* MySQL
* JWT
* bcryptjs

### Tools & Services

* Cloudinary
* Git & GitHub
* Postman

---

## ✨ Features

### 🌐 Public Website

* Responsive agency website
* Navigation bar
* Hero section
* About section
* Services section
* Portfolio section
* Testimonials
* FAQ section
* Contact section
* Footer
* Responsive layouts
* Smooth animations and transitions

---

## 💼 Services Management

Services are stored dynamically in the database and managed through the admin dashboard.

Each service can contain:

* Service name
* Slug
* Description
* Image
* Meta title
* Meta description
* Canonical URL
* Open Graph image

Services can also be associated with:

* Cities
* States
* Industries

This allows the website to support location and industry-specific service pages.

---

## 📍 Dynamic Service Pages

The application supports dynamic service and location-based pages.

Examples:

```text
/services/[service]
/services/[service]/[city]
```

These pages are generated using database content and are designed to support SEO-focused service targeting.

---

## 🔎 SEO

The website includes several SEO-related features:

* Dynamic metadata
* Meta titles
* Meta descriptions
* Canonical URLs
* Open Graph images
* SEO-friendly slugs
* Dynamic service pages
* Breadcrumb structured data
* Organization structured data
* FAQ structured data

---

## 🖥️ Admin Dashboard

The admin dashboard provides content management functionality for the website.

Administrators can manage:

* Site settings
* Homepage content
* Services
* Portfolio
* Testimonials
* FAQs
* Leads

Protected API routes are used for administrative operations.

---

## 🔐 Authentication

The application uses authentication for protected admin functionality.

Authentication includes:

* JWT access tokens
* Refresh tokens
* Password hashing using bcrypt
* Protected API routes
* Authentication checks before admin operations

---

## 🗄️ Database

The application uses **MySQL** with **Prisma ORM**.

Database-driven content includes:

* Services
* Cities
* States
* Industries
* Portfolio
* FAQs
* Testimonials
* Leads
* Site settings
* Homepage content
* Admin/user authentication data

Prisma provides type-safe database access and simplifies database queries and relationships.

---

## 🖼️ Cloudinary

Cloudinary is used for managing website images and media.

It can be used for assets such as:

* Service images
* Portfolio images
* Hero images
* Logos
* Other website media

---

## 📂 Project Structure

The project was originally developed as a single Next.js application.

```text
it-agency-website/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── assets/
│
├── src/
│   ├── app/
│   │   ├── (website)/
│   │   ├── admin/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   │
│   ├── lib/
│   ├── repositories/
│   └── ...
│
├── .env
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🔄 Application Architecture

Before the backend separation, the application followed a full-stack Next.js architecture:

```text
Frontend Components
        ↓
Next.js App Router
        ↓
Next.js API Routes
        ↓
Repositories / Server Logic
        ↓
Prisma ORM
        ↓
MySQL Database
```

The API routes were located inside:

```text
src/app/api/
```

and handled server-side requests, authentication, validation, and database operations.

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd it-agency-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

JWT_ACCESS_SECRET="your_access_secret"
JWT_REFRESH_SECRET="your_refresh_secret"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> Never commit real credentials, database passwords, JWT secrets, or Cloudinary secrets to GitHub.

---

## 🗃️ Database Setup

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

---

## ▶️ Running the Project

Start the development server:

```bash
npm run dev
```

The application will run at:

```text
http://localhost:3000
```

---

## 🧪 Type Checking

Run TypeScript type checking with:

```bash
npx tsc --noEmit
```

---

## 📡 API Routes

The application uses Next.js API routes for server-side functionality.

The API routes are located under:

```text
src/app/api/
```

Examples include APIs for:

```text
/api/services
/api/portfolio
/api/testimonials
/api/faqs
/api/leads
/api/site-settings
```

The API layer communicates with Prisma and the MySQL database.

---

## 🎯 Project Goals

The main goals of this project are:

1. Build a modern IT agency website.
2. Create a database-driven content management system.
3. Provide an admin dashboard for managing website content.
4. Build reusable and responsive React components.
5. Implement secure API routes.
6. Integrate Prisma with MySQL.
7. Create SEO-friendly dynamic pages.
8. Support scalable service, location, and industry-based content.
9. Provide a clean and maintainable full-stack Next.js architecture.

---

## 📌 Development Status

The project is actively developed and includes:

* Public website
* Admin dashboard
* Database integration
* Prisma ORM
* API routes
* Authentication
* CMS functionality
* Dynamic service pages
* SEO implementation
* Cloudinary integration

---

## 👩‍💻 Author

**Mahak Bhargava**

B.Tech — Electronics & Communication Engineering
UIET CHANDIGARH

---

## 📄 License

This project is developed for educational, portfolio, and professional demonstration purposes.
