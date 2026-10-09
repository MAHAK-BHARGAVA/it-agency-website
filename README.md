# Soclthry — Full-Stack IT Agency Website & CMS

**Completed Freelance Client Project | Full-Stack Web Development**

A modern, database-driven IT agency website built with **Next.js, React, TypeScript, Tailwind CSS, Prisma ORM, and MySQL**.

Soclthry is a completed freelance web development project built for a client in the IT services industry. It combines a responsive public-facing website with a content management system (CMS), administrative dashboard, portfolio management, lead management, email OTP verification, and SEO-focused dynamic pages.

The application integrates frontend development, backend API development, relational database management, authentication, media management, and transactional email workflows within a unified Next.js application.

**Project Type:** Freelance Client Project
**Project Status:** Completed
**Role:** Full-Stack Developer

**Repository:** [GitHub — it-agency-website](https://github.com/MAHAK-BHARGAVA/it-agency-website)

---

## Table of Contents

* [Project Overview](#project-overview)
* [Project Objectives](#project-objectives)
* [My Role and Responsibilities](#my-role-and-responsibilities)
* [Technology Stack](#technology-stack)
* [Key Features](#key-features)
* [Application Architecture](#application-architecture)
* [Public Website](#public-website)
* [Content Management System](#content-management-system)
* [Dynamic Service and Location Pages](#dynamic-service-and-location-pages)
* [Portfolio Management](#portfolio-management)
* [Enquiry and Lead Management](#enquiry-and-lead-management)
* [Authentication and Security](#authentication-and-security)
* [SEO and Metadata](#seo-and-metadata)
* [Media Management](#media-management)
* [Database Design and Data Flow](#database-design-and-data-flow)
* [Project Structure](#project-structure)
* [Environment Variables](#environment-variables)
* [Installation and Setup](#installation-and-setup)
* [Running the Application](#running-the-application)
* [Production Build](#production-build)
* [Future Enhancements](#future-enhancements)
* [Author](#author)

---

## Project Overview

Soclthry is a full-stack web application developed to support the online presence and website management needs of an IT agency.

The platform allows prospective clients to explore services, review project work, learn about the agency, and submit enquiries. On the administrative side, it provides tools for managing website content and incoming leads through a centralized interface.

The application is built around three main layers:

1. **Presentation Layer:** Responsive website pages and reusable React components.
2. **Application Layer:** Server-side logic, API endpoints, authentication, and enquiry workflows.
3. **Data and Integration Layer:** MySQL database access through Prisma ORM, transactional email delivery through Resend, and media management through Cloudinary.

The database-driven architecture makes it possible to manage supported website content without hardcoding every service or portfolio page.

## Project Objectives

The primary objectives of the project were to:

* Develop a professional and responsive website for an IT agency.
* Present services, project work, and business information effectively.
* Enable centralized website content management through an admin dashboard.
* Implement database-driven service and portfolio pages.
* Capture and persist prospective client enquiries.
* Introduce email verification into the enquiry submission workflow.
* Automate enquiry notifications and customer confirmation emails.
* Support SEO-oriented dynamic pages and metadata.
* Build a maintainable foundation for future business requirements.

---

## My Role and Responsibilities

**Role: Full-Stack Developer | Freelance Client Project**

The project involved development and integration across the frontend, backend, database, and external services.

Key responsibilities included:

* Developing responsive user interfaces using React, Next.js, TypeScript, and Tailwind CSS.
* Building reusable components and page layouts.
* Implementing backend API endpoints using Next.js Route Handlers.
* Integrating MySQL with Prisma ORM for persistent data operations.
* Developing database-driven service and portfolio pages.
* Implementing administrative workflows for supported CMS modules.
* Building email OTP verification for enquiry submissions.
* Integrating transactional email delivery through Resend.
* Integrating Cloudinary for media management.
* Implementing SEO-oriented metadata for relevant dynamic pages.
* Testing application workflows and resolving build and integration issues.

---

## Technology Stack

### Frontend

| Technology     | Purpose                                       |
| -------------- | --------------------------------------------- |
| Next.js        | Application framework, routing, and rendering |
| React          | Component-based UI development                |
| TypeScript     | Type safety and maintainable code             |
| Tailwind CSS   | Responsive styling and layouts                |
| Framer Motion  | UI animations and transitions                 |
| GSAP           | Animation effects where used                  |
| Lucide React   | UI icons                                      |
| HTML5 and CSS3 | Web structure and styling                     |

### Backend and Database

| Technology             | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| Next.js App Router     | Application routing and server-side capabilities |
| Next.js Route Handlers | Backend API endpoints                            |
| Prisma ORM             | Typed database queries and data operations       |
| MySQL                  | Relational database                              |
| JWT                    | Token-based authentication                       |
| bcryptjs               | Password hashing                                 |

### External Services and Tools

| Service or Tool | Purpose                      |
| --------------- | ---------------------------- |
| Resend          | Transactional email delivery |
| Cloudinary      | Image and media management   |
| Git             | Version control              |
| GitHub          | Source code hosting          |
| Postman         | API testing                  |

---

## Key Features

### Public Website

* Responsive layouts for mobile, tablet, and desktop.
* Homepage with agency introduction and content sections.
* Service listing and detail pages.
* Portfolio listing and individual project pages.
* Testimonials and FAQs.
* Contact and enquiry forms.
* Reusable UI components.
* Interactive elements and animations.

### Admin Dashboard and CMS

* Administrative dashboard with protected areas.
* Service and portfolio content management.
* FAQ and testimonial management.
* Lead and enquiry management.
* Homepage content and site settings management where implemented.
* Database-backed content operations.
* Cloudinary integration for supported media workflows.

### Backend and Integrations

* API endpoints implemented with Next.js Route Handlers.
* Prisma-based MySQL operations.
* Email OTP verification.
* Persistent lead storage.
* Company and customer email notifications.
* JWT-based authentication infrastructure.
* Input validation and error handling in application workflows.

---

## Application Architecture

The application follows a full-stack architecture within a single Next.js project.

```text
                 Public Website
                       |
                 Next.js / React
                       |
          +------------+-------------+
          |                          |
    Server Components          API Route Handlers
          |                          |
          |                  Validation and Logic
          |                          |
          +----------- Prisma ORM ---+
                       |
                     MySQL
                       |
          +------------+-------------+
          |                          |
     Website Content            Leads and Users


External Integrations
    |
    +---- Resend ------> Transactional Emails
    |
    +---- Cloudinary --> Hosted Media
```

### Architectural Approach

* **Presentation:** React components and Next.js pages render the user interface.
* **Application Logic:** Server components and route handlers process requests and apply business rules.
* **Persistence:** Prisma ORM provides typed access to MySQL.
* **External Services:** Resend handles email delivery, while Cloudinary supports media management.

This structure keeps the application within a unified codebase while separating presentation, business logic, and data access responsibilities.

---

## Public Website

The public-facing website acts as the primary interface between the agency and prospective clients.

### Main Sections

* **Home:** Introduces the agency and its services.
* **About:** Presents the agency's background and capabilities.
* **Services:** Displays available IT and digital services.
* **Portfolio:** Showcases projects and their details.
* **Testimonials:** Presents client feedback where available.
* **FAQs:** Answers common questions.
* **Contact:** Enables visitors to submit project enquiries.

The interface uses reusable React components, responsive Tailwind CSS layouts, and animation libraries to provide a consistent experience across screen sizes.

---

## Content Management System

The CMS enables administrators to manage supported website content through the dashboard rather than editing individual pages directly in source code.

### Service Management

Service records can include:

* Service name and slug.
* Description and image.
* SEO title and meta description.
* Canonical URL.
* Open Graph image.
* Associations with cities, states, and industries where configured.

### Portfolio Management

Portfolio records can include:

* Project name and slug.
* Thumbnail or project image.
* Client name and project URL.
* Project challenge, solution, and process.
* Project summary or results.
* Related services and industries.
* Client testimonial where available.

### Additional Content Management

The application also includes administrative modules for supported content such as FAQs, testimonials, leads, and site settings.

Public pages retrieve relevant records from the database, helping keep the website content aligned with the CMS.

---

## Dynamic Service and Location Pages

The application supports database-driven service pages and location-specific service pages.

### Example Routes

```text
/services/[service]
/services/[service]/[city]
```

The service slug identifies the requested service, while a city-specific route allows content to be tailored to a location.

### Request Flow

1. Receive the requested service and optional city slug.
2. Retrieve the corresponding database records.
3. Render the page using available service and location information.
4. Generate metadata for supported routes.
5. Return a not-found response when the requested content does not exist.

This reusable routing approach provides a foundation for expanding service and location coverage without creating a separate hardcoded page for every combination.

---

## Portfolio Management

The portfolio module connects the administrative workflow with the public project showcase.

### Example Routes

```text
/portfolio
/portfolio/[project]
```

The portfolio listing retrieves project records, while the individual project route uses a slug to locate and display the corresponding project.

Depending on the available database record, a project page can present its thumbnail, client information, description, challenge, solution, process, related services, and testimonial.

This structure makes portfolio content easier to maintain as new projects are added.

---

## Enquiry and Lead Management

The enquiry system connects the public contact form to the backend, database, and transactional email service.

### Enquiry Workflow

```text
Visitor completes enquiry form
              |
              v
       Email OTP is sent
              |
              v
       Email OTP is verified
              |
              v
       Enquiry is submitted
              |
              v
       Lead saved in MySQL
              |
              v
   Company notification is sent
              |
              v
 Customer confirmation email is sent
```

### Email OTP Verification

The email verification workflow is designed to verify the visitor's email address before accepting an enquiry.

* A six-digit OTP is generated.
* The verification code is delivered to the visitor's email address.
* The OTP is stored as a hash rather than plaintext.
* The verification code has a limited validity period.
* Verification attempts and resend requests are restricted by the implemented checks.
* The backend checks email verification status before accepting the enquiry.

**The current workflow uses email OTP verification only.** The phone number is collected as contact information; phone/SMS OTP verification is not part of this flow.

### Lead Storage

After successful verification, the enquiry is stored in MySQL. Depending on the form submission, the record can include:

* Name.
* Email address.
* Phone number.
* Requested service.
* City.
* Message.
* Preferred project start time.
* Enquiry source.

### Transactional Email Notifications

Resend is integrated for transactional email delivery.

The workflow sends:

1. A new-enquiry notification to the company's configured email address.
2. A confirmation or thank-you email to the visitor.

This helps streamline enquiry handling and provides confirmation to prospective clients.

---

## Authentication and Security

The application includes JWT-based authentication for administrative functionality.

Security-related implementation includes:

* Password hashing using bcryptjs.
* JWT-based authentication.
* HTTP-only cookies where configured.
* Server-side checks for protected operations.
* Hashed OTP storage.
* OTP expiry and verification-attempt limits.
* Environment variables for sensitive credentials.

### Production Security Considerations

Production deployments should enforce server-side authentication and authorization for every protected administrative operation. Additional safeguards include suitable rate limiting, strong secrets, HTTPS, secure cookie settings, database backups, and validation of incoming requests.

---

## SEO and Metadata

The application supports SEO-oriented implementation for service pages and dynamic routes.

Capabilities include, where configured:

* Dynamic page titles and meta descriptions.
* Canonical URL support.
* Open Graph metadata.
* Structured data for supported page types.
* Metadata generation for dynamic routes.
* Database-driven service and location content.
* Not-found handling for invalid routes.

These features provide a foundation for improving search engine discoverability and the presentation of pages in search results and social previews.

---

## Media Management

Cloudinary is integrated for hosted image and media management.

Supported media workflows can include:

* Service images.
* Portfolio thumbnails.
* Project imagery.
* Other CMS-managed visual assets.

Media URLs can be associated with content records and rendered by the public website, separating media hosting from the application deployment environment.

---

## Database Design and Data Flow

MySQL serves as the persistent data layer, while Prisma ORM provides structured and typed database access.

The database supports core application entities such as services, portfolio projects, leads, and other configured CMS records.

### General Data Flow

1. A visitor or administrator interacts with the application.
2. A server component or API route handler processes the request.
3. The application validates input and applies relevant business rules.
4. Prisma retrieves or updates the corresponding MySQL records.
5. The application returns a response or renders updated content.

This approach separates presentation, application logic, and persistence while keeping them within a unified Next.js codebase.

---

## Project Structure

The following is an illustrative high-level structure. Refer to the repository for the exact current filenames and directories.

```text
it-agency-website/
├── prisma/
│   └── schema.prisma
├── public/
│   └── assets/
├── src/
│   ├── app/
│   │   ├── (website)/
│   │   │   ├── services/
│   │   │   ├── portfolio/
│   │   │   └── contact/
│   │   ├── admin/
│   │   └── api/
│   │       ├── admin/
│   │       ├── contact/
│   │       ├── leads/
│   │       └── otp/
│   ├── components/
│   ├── emails/
│   └── lib/
├── .env.example
├── package.json
└── README.md
```

### Directory Responsibilities

| Directory            | Responsibility                                 |
| -------------------- | ---------------------------------------------- |
| `src/app/(website)/` | Public-facing pages                            |
| `src/app/admin/`     | Administrative dashboard                       |
| `src/app/api/`       | Backend API route handlers                     |
| `src/components/`    | Reusable UI components                         |
| `src/emails/`        | Transactional email templates, where organized |
| `src/lib/`           | Shared utilities and database client           |
| `prisma/`            | Database schema and migrations, where present  |
| `public/`            | Static assets                                  |

---

## Environment Variables

Create a `.env` file in the project root and configure the variables required by the application.

### Example Configuration

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"

RESEND_API_KEY="your-resend-api-key"
RESEND_FROM_EMAIL="noreply@soclthry.com"
COMPANY_EMAIL="contact@soclthry.com"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

Configure only the variables required by the current codebase. Use valid credentials for each external service and point `DATABASE_URL` to the intended MySQL database.

**Never commit `.env` files, API keys, database credentials, or authentication secrets to GitHub.**

---

## Installation and Setup

### Prerequisites

* Node.js compatible with the project's Next.js version.
* npm.
* A MySQL database.
* Credentials for the external services used by the application.

### 1. Clone the Repository

```bash
git clone https://github.com/MAHAK-BHARGAVA/it-agency-website.git
cd it-agency-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and configure the required database, authentication, email, and media credentials.

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

Ensure the database schema is synchronized with the intended database. Follow the repository's existing migration workflow where available.

### 5. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Running a Production Build

Validate the project with a production build:

```bash
npm run build
```

To start the production server in a suitable Node.js environment:

```bash
npm run start
```

The production environment must have the required environment variables, database connectivity, and valid external-service credentials configured.

### Deployment Checklist

* Configure the production database and environment variables.
* Apply schema changes using the appropriate migration workflow.
* Verify authentication and administrative authorization.
* Test email OTP verification and enquiry submission end to end.
* Confirm company and customer email delivery.
* Test media uploads and image URLs.
* Validate important public pages on mobile and desktop.
* Configure HTTPS, backups, and production monitoring.

---

## Future Enhancements

Potential areas for continued improvement include:

* Comprehensive automated tests for API endpoints and enquiry workflows.
* Enhanced API rate limiting and abuse prevention.
* Further accessibility and reduced-motion refinements.
* Image optimization and performance monitoring.
* Improved mobile usability for administrative screens.
* More detailed lead analytics and reporting.
* Expanded SEO and structured-data validation.
* Additional operational monitoring and error reporting.

---

## Author

**Mahak Bhargava**
B.Tech — Electronics and Communication Engineering
UIET Jalandhar

**Project:** Soclthry — Full-Stack IT Agency Website & CMS
**Engagement:** Completed Freelance Client Project
**Role:** Full-Stack Developer

[GitHub Repository](https://github.com/MAHAK-BHARGAVA/it-agency-website)
