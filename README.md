# Soclthry — IT Agency Website

A modern, full-stack IT agency website built with **Next.js, React, TypeScript, Tailwind CSS, Prisma, and MySQL**.

Soclthry combines a responsive public-facing website, admin dashboard, CMS, authentication, lead management, SEO-focused dynamic pages, media management, and enquiry verification into a single Next.js application.

---

## 🚀 Project Overview

**Soclthry** is a database-driven IT agency platform designed to showcase the company's services, portfolio, expertise, and business information while providing an admin system to manage website content and incoming enquiries.

The application includes:

- Modern responsive agency website
- Admin dashboard
- Database-driven CMS
- Dynamic services and portfolio
- Testimonials and FAQs
- Lead and enquiry management
- Email and phone OTP verification
- Transactional email notifications
- Site settings management
- Homepage content management
- JWT-based authentication
- MySQL database with Prisma ORM
- Cloudinary media management
- SEO-friendly dynamic pages
- Location and industry-based service pages

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- GSAP
- Lucide React
- HTML5
- CSS3

### Backend & Database

- Next.js App Router
- Next.js Route Handlers
- Prisma ORM
- MySQL
- JWT
- bcryptjs

### External Services

- Cloudinary — image and media management
- Resend — transactional emails
- Git & GitHub
- Postman

---

## ✨ Core Features

### 🌐 Public Website

The public website provides a modern agency experience with:

- Responsive navigation
- Hero section
- About section
- Services
- Portfolio
- Testimonials
- FAQs
- Contact / enquiry forms
- Footer
- Responsive layouts
- Smooth animations and transitions

---

## 💼 Services & CMS

Services are stored in the database and managed through the admin dashboard.

Each service can contain:

- Service name
- Slug
- Description
- Image
- Meta title
- Meta description
- Canonical URL
- Open Graph image

Services can also be associated with:

- Cities
- States
- Industries

This allows Soclthry to create targeted service pages for different locations and industries.

---

## 📍 Dynamic Service Pages

The website supports database-driven dynamic service and location pages.

Example routes:

```text
/services/[service]
/services/[service]/[city]