# Soclthry — Full-Stack IT Agency Website & CMS

**A Freelance Client Project | Full-Stack Web Development | Next.js · React · TypeScript · Prisma · MySQL**

Soclthry is a modern, full-stack IT agency website developed as a freelance project for a client. The platform combines a responsive public-facing website with a database-driven content management system (CMS), administrative dashboard, portfolio management, lead management, email verification, and SEO-focused dynamic pages.

Built using Next.js, React, TypeScript, Tailwind CSS, Prisma ORM, and MySQL, the application is designed to help the client establish a professional digital presence, showcase services and project work, manage website content, and streamline prospective client enquiries.

The project goes beyond a static marketing website by integrating frontend development, backend API routes, relational database operations, authentication, media management, and transactional email workflows within a unified application.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Project Details](#project-details)
* [My Role and Responsibilities](#my-role-and-responsibilities)
* [Business Objectives](#business-objectives)
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
* [Database and Data Flow](#database-and-data-flow)
* [Project Structure](#project-structure)
* [Environment Configuration](#environment-configuration)
* [Getting Started](#getting-started)
* [Production Build](#production-build)
* [Future Improvements](#future-improvements)
* [Author](#author)

---

## Project Overview

Soclthry is a full-stack web application developed to support the digital presence and day-to-day website management needs of an IT agency.

The platform consists of three major components:

1. **Public Website:** Presents the agency's services, portfolio, expertise, testimonials, FAQs, and contact information.
2. **Admin Dashboard and CMS:** Provides administrative workflows for managing website content and incoming enquiries.
3. **Backend and Integrations:** Handles API requests, database operations, authentication, email OTP verification, media management, and transactional email notifications.

The application uses a database-driven approach so that supported website content can be managed through the administrative interface rather than hardcoded into individual pages.

## Project Details

| Attribute         | Description                                                              |
| ----------------- | ------------------------------------------------------------------------ |
| Project Name      | Soclthry                                                                 |
| Project Type      | Freelance Client Project                                                 |
| Domain            | IT Services and Digital Solutions                                        |
| Application Type  | Full-Stack Web Application                                               |
| Frontend          | Next.js, React, TypeScript                                               |
| Styling           | Tailwind CSS                                                             |
| Backend           | Next.js App Router and Route Handlers                                    |
| Database          | MySQL                                                                    |
| ORM               | Prisma ORM                                                               |
| Email Integration | Resend                                                                   |
| Media Integration | Cloudinary                                                               |
| Repository        | [GitHub Repository](https://github.com/MAHAK-BHARGAVA/it-agency-website) |

## My Role and Responsibilities

Working on this freelance project involves full-stack development and integration across the application's frontend, backend, and database layers.

Responsibilities include, according to the modules implemented:

* Developing responsive user interfaces for the public-facing website.
* Building reusable React components using Next.js and TypeScript.
* Integrating application functionality with MySQL using Prisma ORM.
* Implementing database-driven service, portfolio, and location-specific pages.
* Developing administrative interfaces for website content and enquiry management.
* Implementing email OTP verification for enquiry submissions.
* Integrating transactional email notifications using Resend.
* Integrating Cloudinary for hosted images and media.
* Implementing dynamic metadata and SEO-oriented page structures.
* Testing application workflows, resolving build errors, and improving responsiveness.

---

## Business Objectives

The platform is designed to address common operational needs of an IT agency.

* Establish a professional and responsive online presence.
* Showcase services, capabilities, and project work.
* Centralize supported website content in an administrative dashboard.
* Capture and store prospective client enquiries.
* Streamline enquiry verification and email communication.
* Create reusable service pages for different locations.
* Improve page discoverability through SEO-oriented implementation.
* Provide a maintainable foundation for future business requirements.

---

## Technology Stack

### Frontend

| Technology     | Purpose                                       |
| -------------- | --------------------------------------------- |
| Next.js        | Application framework, routing, and rendering |
| React          | Component-based user interface                |
| TypeScript     | Type safety and maintainable application code |
| Tailwind CSS   | Responsive styling and layout                 |
| Framer Motion  | UI animations and transitions                 |
| GSAP           | Advanced animation effects, where used        |
| Lucide React   | Interface icons                               |
| HTML5 and CSS3 | Web structure and styling foundations         |

### Backend and Database

| Technology         | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| Next.js App Router | Application routing and server-side capabilities |
| Route Handlers     | Backend API endpoints                            |
| Prisma ORM         | Typed database access and data operations        |
| MySQL              | Persistent relational data storage               |
| JWT                | Token-based authentication                       |
| bcryptjs           | Password hashing                                 |

### External Services and Tools

| Service or Tool | Purpose                               |
| --------------- | ------------------------------------- |
| Resend          | Transactional email delivery          |
| Cloudinary      | Image and media management            |
| Git             | Version control                       |
| GitHub          | Source code hosting and collaboration |
| Postman         | API testing                           |

---

## Key Features

### Public Website

* Responsive navigation for different screen sizes.
* Homepage with agency introduction and key content sections.
* Service listing and service detail pages.
* Portfolio listing and individual project pages.
* Testimonials and FAQs.
* Contact and enquiry forms.
* Reusable UI components.
* Interactive elements and animation effects.
* Responsive layouts for mobile, tablet, and desktop.

### Admin Dashboard and CMS

* Administrative dashboard with protected areas.
* Service and portfolio content management.
* FAQ and testimonial management.
* Lead and enquiry management.
* Homepage content and site settings management, where implemented.
* Database-backed content operations.
* Cloudinary integration for supported media workflows.

### Backend and Integrations

* API endpoints implemented using Next.js Route Handlers.
* Prisma-based MySQL operations.
* Email OTP verification before enquiry submission.
* Persistent lead storage.
* Automated company and customer email notifications.
* JWT-based authentication infrastructure.
* Input validation and error handling across implemented workflows.

---

## Application Architecture

The application follows a full-stack architecture within a single Next.js codebase.

```text
                 Public Website
                       |
                Next.js / React
                       |
          ---------------------------
          |                         |
     Server Components        API Route Handlers
          |                         |
          |                 Validation and Logic
          |                         |
          ----------- Prisma ORM ----
                       |
                    MySQL
                       |
          ---------------------------
          |                         |
     Website Content          Leads and Users

External Integrations
    |                    |
  Resend              Cloudinary
    |                    |
 Email Delivery       Media Storage
```

### Architectural approach

* **Presentation layer:** React components and Next.js pages render the user interface.
* **Application layer:** Server components and route handlers process requests and implement application workflows.
* **Data layer:** Prisma ORM provides typed access to MySQL.
* **Integration layer:** Resend and Cloudinary provide external email and media capabilities.

Keeping these responsibilities organized within a single application simplifies development and provides a foundation for future extension.

---

## Public Website

The public website serves as the primary interface between the agency and prospective clients.

### Main sections

* **Home:** Introduces the agency and its services.
* **About:** Presents the agency's background and capabilities.
* **Services:** Displays available IT and digital services.
* **Portfolio:** Showcases project work and relevant details.
* **Testimonials:** Displays client feedback where available.
* **FAQs:** Answers frequently asked questions.
* **Contact:** Allows visitors to submit enquiries.

The interface uses reusable components, responsive Tailwind CSS layouts, and animation libraries to maintain a consistent visual experience across devices.

---

## Content Management System

The CMS enables administrators to manage supported website content through the dashboard instead of editing source files for every content change.

### Service Management

Service records can contain:

* Service name and slug.
* Description and image.
* SEO title and meta description.
* Canonical URL.
* Open Graph image.
* Associations with locations and industries, where configured.

### Portfolio Management

Portfolio records can contain:

* Project name and slug.
* Project thumbnail.
* Client name and project URL.
* Project challenge, solution, and process.
* Project summary or results.
* Related services and industries.
* Client testimonial, where available.

### Additional Content Management

The application also includes management modules for supported content such as FAQs, testimonials, leads, and website settings.

The relevant public pages retrieve database records and display the available information, helping maintain consistency between the CMS and the public website.

---

## Dynamic Service and Location Pages

The application supports database-driven service pages and location-specific service pages.

### Example Routes

```text
/services/[service]
/services/[service]/[city]
```

The service slug identifies the requested service. A city-specific route can provide content tailored to a particular location.

### Request Flow

1. Receive the requested service and optional city slug.
2. Retrieve the corresponding database records.
3. Render the page using the available content.
4. Generate appropriate metadata for supported routes.
5. Return a not-found response when the requested content does not exist.

This approach supports reusable page templates and allows the website to expand its service and location coverage without requiring a separate hardcoded component for every page.

---

## Portfolio Management

The portfolio module connects the administrative content workflow with the public project showcase.

### Example Routes

```text
/portfolio
/portfolio/[project]
```

The portfolio listing retrieves project records, while the individual project route uses a slug to locate and render the corresponding project details.

Depending on the available record, a project page can present its thumbnail, client information, description, challenge, solution, process, related services, and testimonial.

This database-driven approach makes it easier to maintain and extend the agency's project showcase as new work is added.

---

## Enquiry and Lead Management

The enquiry system connects the public contact form to the backend, database, and email service.

### Enquiry Workflow

```text
Visitor submits enquiry details
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
* The verification code is delivered by email.
* The stored OTP is hashed rather than saved as plaintext.
* The OTP has a limited validity period.
* Verification attempts and resend requests are restricted by the implemented checks.
* The backend checks verification status before accepting the enquiry.

The current workflow uses **email OTP verification only**. The phone number is collected as contact information; phone/SMS OTP verification is not part of this flow.

### Lead Storage

After successful verification, the application stores the enquiry in MySQL. Depending on the submitted form, lead information can include:

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

The enquiry workflow sends:

1. A new-enquiry notification to the company's configured email address.
2. A thank-you or confirmation email to the visitor.

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
* OTP expiration and verification-attempt limits.
* Environment variables for sensitive credentials.

### Production Security Considerations

For a production deployment, all protected API operations should enforce server-side authentication and role-based authorization. Additional safeguards should include appropriate rate limiting, strong secrets, HTTPS, secure cookie configuration, database backups, and careful validation of incoming requests.

---

## SEO and Metadata

SEO-oriented implementation supports the website's service pages and dynamic routes.

Capabilities include, where configured:

* Dynamic page titles and meta descriptions.
* Canonical URL support.
* Open Graph metadata.
* Structured data for supported page types.
* Metadata generation for dynamic pages.
* Database-driven service and location content.
* Not-found handling for invalid dynamic routes.

These capabilities provide a foundation for improving search engine discoverability and the presentation of pages in search results and social previews.

---

## Media Management

Cloudinary is integrated for hosted media and image management.

Supported media workflows can include:

* Service images.
* Portfolio thumbnails.
* Project imagery.
* Other CMS-managed visual assets.

Media URLs can be stored with the corresponding content records and rendered by the public website, separating media hosting from the application's deployment environment.

---

## Database and Data Flow

MySQL serves as the persistent data layer, while Prisma ORM provides structured and typed database access.

The database supports core application entities such as services, portfolio projects, leads, and other configured CMS records.

### General Data Flow

1. A visitor or administrator interacts with the application.
2. A server component or API route handler processes the request.
3. The application validates input and applies relevant business rules.
4. Prisma retrieves or updates the relevant MySQL records.
5. The application returns a response or renders the updated content.

This approach separates presentation, application logic, and persistence while maintaining a unified Next.js codebase.

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
| `src/app/(website)/` | Public website pages                           |
| `src/app/admin/`     | Administrative dashboard                       |
| `src/app/api/`       | Backend API route handlers                     |
| `src/components/`    | Reusable UI components                         |
| `src/emails/`        | Transactional email templates, where organized |
| `src/lib/`           | Shared utilities, database client, and helpers |
| `prisma/`            | Database schema and migrations, where present  |
| `public/`            | Static assets                                  |

---

## Environment Configuration

Create a `.env` file in the project root and configure the variables required by the application.

### Example

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

Configure only the environment variables used by the current codebase. The database URL must point to the intended MySQL database, and external-service credentials must be valid for the target environment.

**Never commit `.env` files, API keys, database credentials, or authentication secrets to GitHub.**

---

## Getting Started

### Prerequisites

* Node.js compatible with the version required by the project.
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

Create a `.env` file in the project root and add the required database, authentication, email, and media configuration.

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

Ensure the database schema is synchronized with the intended database before running the application. Use the project's existing migration workflow where available. For a new development database, follow the setup process defined by the repository.

### 5. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Production Build

Before deployment, validate the application with a production build:

```bash
npm run build
```

To run the production server in a suitable Node.js environment:

```bash
npm run start
```

The production environment must have all required environment variables, working database connectivity, and valid external-service credentials.

Recommended deployment checks:

* Confirm that the production database is configured correctly.
* Apply schema changes using the appropriate production migration workflow.
* Verify authentication and administrative authorization.
* Test email OTP verification and enquiry submission end to end.
* Confirm company and customer email delivery.
* Test image uploads and media URLs.
* Validate important public pages on mobile and desktop.
* Configure HTTPS, backups, and production monitoring.

---

## Future Improvements

Potential areas for continued development include:

* Comprehensive automated tests for API endpoints and enquiry workflows.
* Enhanced API rate limiting and abuse prevention.
* Further accessibility and reduced-motion improvements.
* Image optimization and performance monitoring.
* Improved mobile navigation for administrative screens.
* More detailed lead analytics and reporting.
* Expanded SEO and structured-data validation.
* Additional operational monitoring and error reporting.

---

## Author

**Mahak Bhargava**
B.Tech — Electronics and Communication Engineering
UIET Jalandhar

**Project:** Soclthry — Full-Stack IT Agency Website & CMS
**Engagement:** Freelance Client Project
**Repository:** [MAHAK-BHARGAVA/it-agency-website](https://github.com/MAHAK-BHARGAVA/it-agency-website)
