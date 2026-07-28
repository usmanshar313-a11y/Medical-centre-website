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
- Powered by **Firebase Authentication** (Email/Password login and registration).
- **Patient Dashboard**: Manage profile details, view upcoming appointments, access past medical visit records, and review prescribed diagnostics.
- Real-time offline support with auto-detect long polling Firestore sync.

### 🛠️ 4. Hospital Admin Management Portal
- Administrative dashboard for receptionists and hospital staff to manage appointment queues, approve bookings, update doctor schedules, and log patient visits.

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
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the project root directory (or use `.env.example`) and configure your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```
The application will start locally at `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
```
The optimized production build output will be generated in the `dist/` directory.

---

## 📁 Project Structure

```text
├── public/                # Static assets, logos, and icons
├── src/
│   ├── admin/             # Hospital administration dashboard components
│   ├── components/        # Reusable UI components
│   │   ├── booking/       # Appointment booking modal & forms
│   │   ├── common/        # Navbar, Footer, Floating WhatsApp CTA
│   │   └── home/          # Hero, About, Departments, Location sections
│   ├── context/           # React Context (AuthContext, LanguageContext)
│   ├── pages/             # Route pages (HomePage, DepartmentsPage, AboutPage, PortalPage)
│   ├── translations/      # i18n translation files (English & Urdu)
│   ├── types/             # Global TypeScript interfaces & data models
│   ├── App.tsx            # Main application layout & routes setup
│   ├── firebase.ts        # Firebase app & Firestore initialization
│   └── main.tsx           # React entry point
├── package.json           # Scripts and dependencies
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

---

## 📞 Hospital Contact & Emergency Information

- **Hospital Name**: Rafah-E-Aam Medical Centre
- **Address**: Plot ST-2, Block 13, Federal B Area, Karachi, Sindh, Pakistan
- **Emergency Line (24/7)**: [+92 21 36342011](tel:+922136342011) / [+92 300 2108785](tel:+923002108785)
- **Email**: contact@rafaheaam.org.pk
- **OPD Timings**: Monday – Saturday (09:00 AM – 11:00 PM) | ER Open 24/7

---

## 📄 License

This repository is maintained for **Rafah-E-Aam Medical Centre**. All rights reserved.
