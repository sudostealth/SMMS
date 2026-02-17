<div align="center">

# 🎓 GUSMP Attendance System

### Green University Student Mentorship Program

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5.12-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</p>

<p align="center">
  <strong>A modern, full-featured attendance management system for university mentorship programs</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#-developer">Developer</a>
</p>

---

</div>

## � Overview

**GUSMP Attendance System** is a comprehensive web application designed to streamline the management of student mentorship programs at Green University of Bangladesh. Built with modern web technologies, it provides mentors with powerful tools to track batches, students, sessions, and attendance - all in one elegant dashboard.

### 🎯 Project Goals

- ✅ **Simplify** batch and student management
- ✅ **Digitize** attendance tracking with real-time analytics
- ✅ **Enhance** mentor-student communication
- ✅ **Provide** insightful attendance statistics
- ✅ **Support** bilingual interface (English & Bangla)

---

## ✨ Features

### 🎓 **Batch Management**

- Create and organize multiple mentorship batches
- Track batch details (department, section, semester, academic year)
- Manage student ID ranges
- Set batch status (Active/Inactive/Completed)
- Real-time batch statistics

### 👥 **Student Management**

- Add students individually or import in bulk (CSV/Excel)
- Advanced search functionality (name, ID, phone, email)
- Student profile with attendance statistics
- Edit and update student information
- View individual attendance history

### 📅 **Session Management**

- Create sessions with online/offline tracking
- Record platform details (Zoom, Meet, etc.) for online sessions
- Track room numbers for offline sessions
- Session-wise attendance overview
- Edit and update session details

### ✅ **Attendance Tracking**

- Modern, vertical list interface for marking attendance
- Quick bulk actions (Mark All Present/Absent)
- Real-time attendance statistics per session
- Color-coded attendance badges
- Collapsible session records for better organization
- Attendance percentage calculation

### 🌐 **Bilingual Support**

- Complete English and Bangla translations
- Easy language toggle
- Persistent language preference

### 🎨 **Modern UI/UX**

- Responsive design for all devices
- Dark/Light theme support
- Animated components and smooth transitions
- Real-time data updates
- Interactive charts and statistics
- Professional footer with developer info

### 🔐 **Authentication & Security**

- Secure email/password authentication via Supabase
- Email verification system
- Protected routes with middleware
- Row-level security (RLS) policies
- Session management

---

## �️ Tech Stack

### **Frontend**

| Technology                                                                                                      | Purpose                      |
| --------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| ![Next.js](https://img.shields.io/badge/-Next.js_15-000000?style=flat&logo=next.js)                             | React framework with SSR/SSG |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)       | Type-safe development        |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Utility-first CSS framework  |
| ![shadcn/ui](https://img.shields.io/badge/-shadcn/ui-000000?style=flat)                                         | Beautiful UI components      |

### **Backend & Database**

| Technology                                                                                                | Purpose                     |
| --------------------------------------------------------------------------------------------------------- | --------------------------- |
| ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)       | Backend as a Service (BaaS) |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white) | Relational database         |
| ![Next.js API](https://img.shields.io/badge/-Next.js_API-000000?style=flat&logo=next.js)                  | Server actions & API routes |

### **Dev Tools**

| Technology                                                                                                               | Purpose           |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| ![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat&logo=eslint)                                            | Code linting      |
| ![React Hook Form](https://img.shields.io/badge/-React_Hook_Form-EC5990?style=flat&logo=react-hook-form&logoColor=white) | Form management   |
| ![Zod](https://img.shields.io/badge/-Zod-3E67B1?style=flat)                                                              | Schema validation |
| ![Lucide Icons](https://img.shields.io/badge/-Lucide-F56565?style=flat)                                                  | Icon library      |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account** (for database)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/sudostealth/gusmp-attendance.git
   cd gusmp-attendance
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   Run the SQL schema file in your Supabase SQL editor:

   ```bash
   # Execute supabase_schema.sql in Supabase dashboard
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

### For Mentors

1. **Register/Login**
   - Create an account with your university email
   - Verify your email address

2. **Create a Batch**
   - Navigate to "Create Batch"
   - Fill in batch details
   - Set student ID range (optional)

3. **Add Students**
   - Add students individually
   - Or import bulk students via CSV/Excel

4. **Create Sessions**
   - Add session with date and method (Online/Offline)
   - Include platform or room details

5. **Mark Attendance**
   - Click "Mark Attendance" on any session
   - Toggle Present/Absent for each student
   - Use bulk actions for efficiency
   - Save attendance

6. **View Analytics**
   - Check batch-wise statistics
   - Review student attendance percentages
   - Search and filter students
   - View session-wise breakdown

---

## 📁 Project Structure

```
gusmp-attendance/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── batches/
│   │   │   └── [id]/             # Batch detail pages
│   │   ├── create-batch/
│   │   ├── dashboard/
│   │   └── profile/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                    # React components
│   ├── layout/                   # Layout components
│   │   ├── dashboard-sidebar.tsx
│   │   └── footer.tsx
│   ├── providers/                # Context providers
│   │   ├── language-provider.tsx
│   │   └── theme-provider.tsx
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility libraries
│   ├── services/                 # Service layer
│   ├── supabase/                 # Supabase client
│   ├── validations/              # Zod schemas
│   └── utils.ts
├── public/                       # Static assets
│   └── developer.json
├── types/                        # TypeScript types
└── package.json
```

---

## 🎨 Screenshots

> _Coming soon! Add screenshots of your application here_

- Dashboard Overview
- Batch Management
- Student List with Search
- Attendance Marking Interface
- Session Analytics
- Mobile Responsive Views

---

## 🌟 Key Features in Detail

### 🔍 **Advanced Search & Filter**

Search students by multiple criteria simultaneously:

- Full name (partial match)
- Student ID (exact or partial)
- Phone number
- Email address

### 📊 **Real-time Analytics**

- Attendance percentage per student
- Session-wise attendance breakdown
- Batch-level statistics
- Present/Absent counts with color coding

### 🎭 **Collapsible UI**

- Session records collapse/expand individually
- Bulk expand/collapse all sessions
- Saves screen space
- Improves navigation

### 🌍 **Internationalization**

- Full bilingual support (English/Bangla)
- 60+ translated UI strings
- Persistent language preference
- Toggle button in navigation

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and maintain code quality
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

<div align="center">

### **MD. SAZIB**

_Full Stack Developer_

[![Portfolio](https://img.shields.io/badge/-Portfolio-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://mdsazib.vercel.app)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/sudostealth)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/immdsazib)
[![Email](https://img.shields.io/badge/-Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mdsazib.cse@gmail.com)

**Green University of Bangladesh**

</div>

---

## 🙏 Acknowledgments

- **Green University of Bangladesh** for the mentorship program
- **Supabase** for the excellent BaaS platform
- **Vercel** for Next.js and deployment
- **shadcn** for beautiful UI components

---

<div align="center">

### ⭐ If you find this project useful, please consider giving it a star!

**Made with ❤️ in Bangladesh**

</div>
