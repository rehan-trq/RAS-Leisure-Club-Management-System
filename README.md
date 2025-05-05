# RAS Leisure Club Management System

A comprehensive web application designed to streamline leisure club operations, including user registration, activity bookings, membership management, payments, and facility maintenance. Built using the **MERN** stack for scalability, maintainability, and ease of development.

---

## Overview

The **RAS Leisure Club Management System** is designed to automate and optimize day-to-day operations for a leisure club offering various facilities (e.g., swimming, gym, sauna, golf, table tennis). The system provides:

- A **user-friendly** interface for members to **register**, **book activities**, **renew memberships**, and **make payments** online.
- An **admin dashboard** to **manage staff**, **track facility status**, **view bookings**, and **generate reports** on club usage and revenue.

---

## Features

1. **User Authentication & Profile Management**  
   - Register, log in, and reset passwords securely.
   - Update personal information and view booking history.

2. **Activity Booking**  
   - Reserve time slots for activities (e.g., swimming, gym, sauna).
   - View, cancel, or reschedule existing bookings.

3. **Membership Management**  
   - Purchase, renew, or upgrade memberships.
   - Automated reminders for membership expiration.

4. **Payment Integration**  
   - Secure online payments for bookings and memberships.
   - View payment history and receive transaction confirmations.

5. **Facility Maintenance & Staff Management**  
   - Log maintenance requests and track facility status.
   - Manage staff profiles and assign roles.

6. **Reporting & Analytics**  
   - Generate operational reports (e.g., bookings, payments).
   - Admin dashboard for real-time insights.

7. **Notifications & Alerts**  
   - Email/SMS reminders for upcoming bookings or expiring memberships.
   - Alerts for low facility availability or scheduled maintenance.

---

## Tech Stack

- **MongoDB**: Database for storing user data, bookings, memberships, etc.  
- **Express.js**: Backend framework for building RESTful APIs.  
- **React.js**: Frontend library for creating dynamic user interfaces.  
- **Node.js**: Runtime environment for executing server-side JavaScript.

---


## Installation

### Prerequisites

* **Node.js** (v14+ recommended)
* **npm** or **yarn**
* **MongoDB** (local or cloud-based, e.g., MongoDB Atlas)

### Steps

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/<your-username>/RAS-Leisure-Club-Management-System.git
   cd RAS-Leisure-Club-Management-System
   ```

2. **Install Dependencies:**

   * For the backend:

     ```bash
     cd server
     npm install
     ```
   * For the frontend:

     ```bash
     cd ..
     npm install
     ```

3. **Run the Project:**

   * Start the backend server:

     ```bash
     cd server
     npm run dev
     ```
   * In a new terminal, start the frontend:

     ```bash
     cd RAS-Leisure-Club-Management-System
     npm run dev
     ```

---

## Contributing

1. **Fork the repository.**

2. **Create a new branch:**

   ```bash
   git checkout -b feature/some-feature
   # or for a bug fix:
   git checkout -b bugfix/some-bug
   ```

3. **Commit your changes with clear messages.**

4. **Push your branch to your fork:**

   ```bash
   git push origin feature/some-feature
   ```

5. **Open a pull request to this repository.**

---
