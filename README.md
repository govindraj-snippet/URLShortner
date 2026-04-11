<div align="center">

# 🔗 URL Shortener Pro

**A scalable, full-stack URL shortening service with advanced analytics, real-time click tracking, and user authentication.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://urlshortnerr.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://urlshortner-6dzi.onrender.com/api)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](#)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](#)

[View Live Website](https://urlshortnerr.vercel.app/) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ⚡ Features

- **Blazing Fast Redirection**: Turn long, messy URLs into clean, shareable links instantly.
- **Deep Analytics**: Track exactly how many times your links are clicked, complete with beautiful charting.
- **Global Dashboard**: View your account's lifetime activity metrics over the last 7 or 30 days.
- **User Authentication**: Secure Sign-Up and Login handled via JWT (JSON Web Tokens).
- **Responsive UI**: A gorgeous, dark-mode compatible interface built with precise React styling.
- **Bulletproof Security**: Spring Security locked API endpoints preventing unauthorized URL manipulation.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS for highly responsive, modern components
- **Routing**: React Router DOM (v7)
- **Charts**: Recharts for dynamic visual data
- **Hosting**: Vercel

### Backend (The Engine)
- **Core**: Java 17 & Spring Boot (v4)
- **Security**: Spring Security + JWT Architecture
- **Data Access**: Spring Data JPA & Hibernate
- **Database**: MySQL (Hosted on TiDB Serverless)
- **Containerization**: Docker
- **Hosting**: Render

---

## 🚀 Live Demo

You can test the fully functional deployed application here:
**[👉 https://urlshortnerr.vercel.app/](https://urlshortnerr.vercel.app/)**

---

## 💻 Local Developer Setup

If you wish to spin up this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/URLShortner.git
cd URLShortner
```

### 2. Configure the Backend
Navigate to the backend directory and set up your local database variables.
```bash
cd backend
```
In `backend/src/main/resources/application.properties`, configure your local database:
```ini
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/urlShortnerdb
spring.datasource.username=root
spring.datasource.password=your-local-password
```
Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

### 3. Configure the Frontend
Open a new terminal session, navigate to the frontend directory, install dependencies, and run Vite.
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser!

---

## 📦 Deployment Architecture

This project was built cleanly as a monorepo explicitly tailored for robust cloud deployment:
- **Vite/React** connects dynamically to the backend via Vite environment variables.
- **Spring Boot** connects dynamically to the database via dynamically injected `SPRING_DATASOURCE_URL` commands on Render.
- **Cross-Origin Resource Sharing (CORS)** is dynamically verified strictly allowing cross-talk exclusively from the deployed App.

---

<div align="center">
  <p>Built with ❤️ using React & Spring Boot</p>
</div>
