# 🏥 Rafah-E-Aam Medical Centre — Official Web Platform

Welcome to the official repository for **Rafah-E-Aam Medical Centre**, a modern, fully responsive hospital management and patient portal website built for one of Karachi's premier community healthcare institutions (located in Block 13, Federal B Area, Karachi, Pakistan).

---

## 🌟 Key Features

### 🏛️ 1. Comprehensive Departments & Doctor Panel
- **15+ Medical & Surgical Departments**: General OPD & Internal Medicine, Cardiology, Orthopedics, Laparoscopic & General Surgery, Pediatrics, Obstetrics & Gynaecology, Radiology & Diagnostic Sonology, Diabetology, Pulmonology, Gastroenterology, Family Medicine, Dialysis Unit, ENT, Dental Surgery, and 24/7 Emergency & Casualty Care.
- **34+ Authorized Consultant Doctors**: Complete schedule with OPD timings, available days, room numbers, consultation fees, and doctor bio profiles.
- **Advanced Search & Filtering**: Instant filter by department name, medical specialty, or consultant doctor name.

### 📅 2. Direct Online Visit & OPD Booking System
- Interactive booking modal with pre-selected department and doctor context.
- Instant submission saved directly to Firebase Firestore.
- Confirmation receipts with appointment ID, date, time slot, and reception instructions.

### 🔐 3. Secure Patient Portal & Authentication
- Powered by **Firebase Authentication** (Google Sign-In & Email login).
- **Patient Dashboard**: Manage profile details, view upcoming appointments, access past medical visit records, and review prescribed diagnostics.
- Real-time Firestore synchronization for up-to-the-minute appointment updates.

### 🛠️ 4. Hospital Admin Management
- Backend administrative panel (`/admin`) for receptionists and hospital staff to manage appointment queues, approve bookings, update doctor schedules, and log patient visits.

### 🌐 5. Multilingual Support & Mobile Optimization
- Instant language toggle between **English** and **Urdu (اردو)**.
- Desktop-first precision with mobile-first responsive layout (320px to 4K displays).
- Accessible color scheme conforming to healthcare design standards.

---

## 🛠️ Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build System** | [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Database & Auth** | [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Auth](https://firebase.google.com/docs/auth) |
| **Animations** | [Motion](https://motion.dev/) |
| **Iconography** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

Follow these instructions to set up and run the project locally on your machine.

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/rafaheaam-medical-centre.git
cd rafaheaam-medical-centre
