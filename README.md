# 🌸 Blossom Health - Hospital Appointment Booking System

A full-stack, responsive Hospital Appointment Booking System developed with the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) featuring a **baby-pink and white theme** (`#fce4ec`, `#ec407a`, `#ffffff`).

---

## 🌟 Key Features by Role

### 1. 🧑 Patient Portal
- **Registration & Authentication**: Secure sign-up and JWT login with password encryption via `bcryptjs`.
- **Hospital Departments**: Browse hospital clinical centers (Cardiology, Neurology, Pediatrics, Dermatology, Orthopedics, Gynecology, General Medicine).
- **Find Doctors**: Search specialists by doctor name, specialization, or department.
- **Doctor Profiles**: Comprehensive profile pages showing credentials, years of experience, patient reviews, room numbers, and consultation fees.
- **Live Available Slots Picker**: Real-time calendar slot generator checking doctor's working schedule and occupied slots.
- **Zero Double-Booking Guarantee**: Database-level compound partial unique index combined with pre-insert slot conflict detection.
- **Manage Appointments**: View booking history, reschedule appointment date/time, and cancel appointments with reasons.

### 2. 🩺 Doctor Portal
- **Doctor Authentication & Dashboard**: Real-time overview of today's schedule, pending reviews, confirmed bookings, and total consultations.
- **Availability Management**: Configure active working days (Mon–Sun), daily practice hours (Start/End time in 24h format), and consultation slot duration (15, 30, 45, or 60 minutes).
- **Booking Status Toggle**: 1-click switch to toggle between "Available / Accepting Patients" and "Offline / Paused".
- **Appointment Management**: Review patient complaint, confirm appointments, mark visits as completed, or cancel.
- **Clinical Records**: Write clinical diagnosis notes and prescriptions (Rx) attached to patient appointment records.

### 3. 👑 Admin Portal
- **Executive Dashboard**: Live hospital statistics, patient count, active doctors count, total appointments, today's schedule count, revenue calculation, and status distribution breakdown.
- **Doctor Management**: Onboard new doctor credentials with department assignment, specialization, qualification, fee, and room number; delete or update doctor records.
- **Patient Management**: View patient registry with blood group, contact details, and 1-click account activation/deactivation.
- **Department Management**: Add, edit, or delete hospital departments with custom medical icons and descriptions.
- **Appointment Master Ledger**: Full view of all appointments across all departments with administrative rescheduling and cancellation overrides.

---

## 🛠️ Technology Stack (Strictly MERN)

- **Database**: MongoDB Atlas (Cloud) / Local MongoDB via Mongoose ODM
- **Backend**: Node.js & Express.js REST API
- **Frontend**: React.js 18 + Vite
- **Styling**: Tailwind CSS with custom Baby-Pink palette & Soft Pink Shadows
- **Authentication**: JSON Web Tokens (JWT) + HTTP Authorization Header Bearer Tokens
- **Icons**: Lucide React
- **HTTP Client**: Axios with request/response interceptors

---

## 📁 Project Folder Structure

```
Hospital-Appointment-Booking-System/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection & Atlas tips
│   │   ├── controllers/
│   │   │   ├── adminController.js     # Admin metrics, patient/doctor management
│   │   │   ├── appointmentController.js # Slot generation & double-booking prevention
│   │   │   ├── authController.js      # Patient register, login, JWT issuance
│   │   │   ├── departmentController.js# Department CRUD & doctor aggregation
│   │   │   └── doctorController.js    # Doctor search, filters, availability
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verification & profile attachment
│   │   │   ├── roleCheck.js           # Role authorization (patient, doctor, admin)
│   │   │   └── errorHandler.js        # Global error & duplicate key handler
│   │   ├── models/
│   │   │   ├── Appointment.js         # Appointment schema with unique slot index
│   │   │   ├── Department.js          # Department schema
│   │   │   ├── Doctor.js              # Doctor schema & working hours
│   │   │   └── User.js                # User schema (patient, doctor, admin)
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── departmentRoutes.js
│   │   │   └── doctorRoutes.js
│   │   ├── utils/
│   │   │   ├── seedData.js            # Initial database seeder
│   │   │   └── slotGenerator.js       # Dynamic slot calculation engine
│   │   └── server.js                  # Express app entry point
│   ├── .env.example
│   ├── .env
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── appointments/
│   │   │   │   ├── AppointmentCard.jsx# Reusable card with status badges & actions
│   │   │   │   └── SlotPicker.jsx     # Live slot availability grid
│   │   │   ├── common/
│   │   │   │   ├── Footer.jsx         # 24/7 helpline & hospital links
│   │   │   │   ├── LoadingSpinner.jsx # Baby-pink medical spinner
│   │   │   │   ├── Modal.jsx          # Accessible dialog with blur backdrop
│   │   │   │   ├── Navbar.jsx         # Responsive navbar with 1-click Demo Switcher
│   │   │   │   └── ProtectedRoute.jsx # Role-based route guard
│   │   │   └── dashboard/
│   │   │       └── StatCard.jsx       # Analytics KPI card
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global Auth & Demo accounts provider
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminAppointments.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminDepartments.jsx
│   │   │   │   ├── AdminDoctors.jsx
│   │   │   │   └── AdminPatients.jsx
│   │   │   ├── doctor/
│   │   │   │   ├── DoctorAppointments.jsx
│   │   │   │   ├── DoctorAvailability.jsx
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   └── DoctorProfile.jsx
│   │   │   ├── patient/
│   │   │   │   ├── BookAppointment.jsx
│   │   │   │   ├── MyAppointments.jsx
│   │   │   │   ├── PatientDashboard.jsx
│   │   │   │   └── PatientProfile.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Departments.jsx
│   │   │   ├── DoctorDetails.jsx
│   │   │   ├── Doctors.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js                 # Axios API service
│   │   ├── App.jsx                    # Routing configuration
│   │   ├── index.css                  # Baby-pink theme & utilities
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js             # Baby-pink color palette & shadows
│   └── vite.config.js
└── README.md
```

---

## 🛡️ Double Booking Prevention Architecture

Double booking is prevented through a **dual-layer protection strategy**:

1. **Database Level (Mongoose Index)**:
   ```javascript
   appointmentSchema.index(
     { doctor: 1, dateString: 1, timeSlot: 1 },
     {
       unique: true,
       partialFilterExpression: { status: { $ne: 'Cancelled' } },
     }
   );
   ```
   If status is `Cancelled`, the slot is freed up for other patients. For any active appointment (`Pending`, `Confirmed`, `Completed`, `Rescheduled`), MongoDB enforces uniqueness and rejects conflicting writes with error code `11000`.

2. **Controller Level (Atomic Check)**:
   ```javascript
   const existingBooking = await Appointment.findOne({
     doctor: doctorId,
     dateString,
     timeSlot,
     status: { $ne: 'Cancelled' },
   });
   if (existingBooking) {
     return res.status(409).json({ message: 'Slot already booked' });
   }
   ```

3. **Frontend Real-time Slot Picker (`SlotPicker.jsx`)**:
   Queries `/api/appointments/available-slots?doctorId=...&date=...` and automatically marks already-booked slots as disabled with a clear `Booked` strikeout badge.

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- **Local MongoDB Server** (managed via [MongoDB Compass](https://www.mongodb.com/products/tools/compass) or local `mongod` service running on `mongodb://127.0.0.1:27017`)

---

### Step 1: Configure Backend Environment

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Check `backend/.env`. It is configured to connect to your local MongoDB server:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/hospital_booking
   JWT_SECRET=hospital_booking_jwt_secret_pink_theme_2025_safe_token
   JWT_EXPIRE=30d
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```
   > 💡 **Note on Port 5001**: Port `5001` is used instead of 5000 to prevent conflicts with macOS AirPlay Receiver / ControlCenter which occupies port 5000 by default.

---

### Step 2: Seed Initial Sample Data

Populate your local MongoDB database with sample departments (Cardiology, Neurology, Pediatrics, etc.), doctors with bios and schedules, patients, and initial bookings:

```bash
npm run seed
```

You can open **MongoDB Compass**, connect to `mongodb://127.0.0.1:27017`, and inspect the `hospital_booking` database with all collections: `departments`, `doctors`, `users`, and `appointments`.

---

### Step 3: Start the Backend Server

```bash
npm run dev
# or: npm start
```
The backend will run on `http://localhost:5001`. You can test the health check at `http://localhost:5001/api/health`.

---

### Step 4: Start the Frontend Application

Open a second terminal window:

```bash
cd frontend
npm run dev
```
The frontend will launch at `http://localhost:5173`.

> 💡 **Quick Demo Helper**: The navigation bar and login screen include **1-Click Demo Login** buttons (`Patient`, `Doctor`, `Admin`) so you can test all 3 role perspectives without typing credentials!

---

## 🏥 Testing the Complete User Flow

1. **Patient Flow**:
   - Log in or register as a patient.
   - Click **Book Appointment** in the top navbar.
   - Select a department (e.g. *Cardiology*) and pick **Dr. Sarah Jenkins**.
   - Select a date on the calendar.
   - Choose any open slot (e.g. `09:30 AM`). Notice that already-booked slots are disabled to prevent double bookings.
   - Enter your reason for visit and click **Confirm & Book Appointment**.
   - View your booked appointment card in **My Appointments**. Test rescheduling to another slot or cancelling.

2. **Doctor Flow**:
   - Log in as **Dr. Sarah Jenkins** (`sarah.jenkins@blossomhospital.com` / `doctor123`).
   - View your appointments schedule.
   - Change appointment status (from *Pending* to *Confirmed* or *Completed*).
   - Click **Add Notes** to input diagnosis findings and prescriptions.
   - Visit **Availability** in the navbar to modify working days or consultation slot duration.

3. **Admin Flow**:
   - Log in as Admin (`admin@blossomhospital.com` / `admin123`).
   - View dashboard analytics: total patients, active doctors, appointments, revenue, and status breakdown.
   - Navigate to **Doctors** -> Click **Add New Doctor** to onboard a new specialist.
   - Navigate to **Departments** to add or edit clinical departments.
   - Navigate to **Appointments** to view or manage bookings across the entire hospital.
