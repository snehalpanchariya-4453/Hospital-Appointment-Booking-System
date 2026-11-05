const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_booking';
    const maskedUri = uri.includes('@') ? uri.replace(/:([^:@]+)@/, ':****@') : uri;
    console.log(`🌱 Connecting to database at ${maskedUri}...`);
    await mongoose.connect(uri);
    console.log('🌸 Connected to MongoDB successfully.');

    console.log('🧹 Clearing existing data...');
    await Appointment.deleteMany();
    await Doctor.deleteMany();
    await Department.deleteMany();
    await User.deleteMany();

    console.log('👤 Creating Admin user...');
    const adminUser = await User.create({
      name: 'Hospital Administrator',
      email: 'admin@blossomhospital.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      gender: 'other',
      address: 'Blossom Central Medical Suites, Suite 500',
    });

    console.log('🏥 Creating Hospital Departments...');
    const departments = await Department.create([
      {
        name: 'Cardiology',
        description: 'Comprehensive heart care, cardiovascular diagnostics, ECG, echocardiography, and interventional cardiology.',
        icon: 'Heart',
        status: 'active',
      },
      {
        name: 'Neurology',
        description: 'Advanced diagnosis and treatment for disorders of the brain, spinal cord, peripheral nerves, and stroke care.',
        icon: 'Brain',
        status: 'active',
      },
      {
        name: 'Pediatrics',
        description: 'Compassionate medical care for infants, children, and adolescents, including immunization and wellness checks.',
        icon: 'Baby',
        status: 'active',
      },
      {
        name: 'Dermatology',
        description: 'Expert medical and cosmetic dermatology for skin disorders, acne, eczema, psoriasis, and rejuvenating treatments.',
        icon: 'Sparkles',
        status: 'active',
      },
      {
        name: 'Orthopedics',
        description: 'Specialized bone, joint, and musculoskeletal care, sports injury rehabilitation, and joint replacement surgeries.',
        icon: 'Bone',
        status: 'active',
      },
      {
        name: 'Gynecology & Obstetrics',
        description: 'Dedicated women’s healthcare, prenatal and postnatal support, fertility counseling, and maternity wellness.',
        icon: 'Activity',
        status: 'active',
      },
      {
        name: 'General Medicine',
        description: 'Preventative health examinations, chronic condition management, acute illnesses, and comprehensive outpatient care.',
        icon: 'Stethoscope',
        status: 'active',
      },
    ]);

    const deptMap = {};
    departments.forEach((dept) => {
      deptMap[dept.name] = dept._id;
    });

    console.log('👨‍⚕️ Creating Doctor users and profiles...');
    const doctorsData = [
      {
        user: {
          name: 'Dr. Sarah Jenkins',
          email: 'sarah.jenkins@blossomhospital.com',
          password: 'doctor123',
          role: 'doctor',
          phone: '+1 (555) 234-5678',
          gender: 'female',
          address: '45 Health Ave, Metro City',
          avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        },
        profile: {
          department: deptMap['Cardiology'],
          specialization: 'Interventional Cardiology',
          qualification: 'MBBS, MD (Cardiology), FACC',
          experienceYears: 12,
          consultationFee: 85,
          roomNumber: 'OPD-201',
          bio: 'Dr. Sarah Jenkins is a board-certified interventional cardiologist dedicated to preventative cardiology, hypertension control, and cardiac catheterization.',
          rating: 4.9,
          reviewsCount: 48,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:00', end: '16:00', slotDurationMinutes: 30 },
        },
      },
      {
        user: {
          name: 'Dr. Robert Chen',
          email: 'robert.chen@blossomhospital.com',
          password: 'doctor123',
          role: 'doctor',
          phone: '+1 (555) 345-6789',
          gender: 'male',
          address: '88 Neuro Blvd, Metro City',
          avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        },
        profile: {
          department: deptMap['Neurology'],
          specialization: 'Cognitive Neurology & Stroke Care',
          qualification: 'MD, DM (Neurology), PhD',
          experienceYears: 15,
          consultationFee: 100,
          roomNumber: 'OPD-305',
          bio: 'Dr. Robert Chen specializes in complex neurological conditions, migraines, cognitive diagnostics, and neuropathy management.',
          rating: 4.8,
          reviewsCount: 36,
          workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '10:00', end: '17:00', slotDurationMinutes: 30 },
        },
      },
      {
        user: {
          name: 'Dr. Emily Rose',
          email: 'emily.rose@blossomhospital.com',
          password: 'doctor123',
          role: 'doctor',
          phone: '+1 (555) 456-7890',
          gender: 'female',
          address: '12 Sunshine Park, Metro City',
          avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=400',
        },
        profile: {
          department: deptMap['Pediatrics'],
          specialization: 'Pediatric Care & Child Nutrition',
          qualification: 'MBBS, MD (Pediatrics), FAAP',
          experienceYears: 8,
          consultationFee: 65,
          roomNumber: 'OPD-102',
          bio: 'Warm and caring pediatrician passionate about gentle child wellness examinations, developmental milestones, and infant immunity.',
          rating: 5.0,
          reviewsCount: 62,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday'],
          workingHours: { start: '08:30', end: '15:30', slotDurationMinutes: 30 },
        },
      },
      {
        user: {
          name: 'Dr. Alexander Wright',
          email: 'alexander.wright@blossomhospital.com',
          password: 'doctor123',
          role: 'doctor',
          phone: '+1 (555) 567-8901',
          gender: 'male',
          address: '77 Pearl Street, Metro City',
          avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
        },
        profile: {
          department: deptMap['Dermatology'],
          specialization: 'Clinical Dermatology & Laser Therapy',
          qualification: 'MBBS, DVD, MD (Dermatology)',
          experienceYears: 10,
          consultationFee: 75,
          roomNumber: 'OPD-404',
          bio: 'Dr. Wright provides advanced medical dermatology for chronic skin conditions, allergic dermatitis, and aesthetic skin health.',
          rating: 4.7,
          reviewsCount: 29,
          workingDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          workingHours: { start: '09:00', end: '16:30', slotDurationMinutes: 30 },
        },
      },
      {
        user: {
          name: 'Dr. Maya Patel',
          email: 'maya.patel@blossomhospital.com',
          password: 'doctor123',
          role: 'doctor',
          phone: '+1 (555) 678-9012',
          gender: 'female',
          address: '90 Lotus Lane, Metro City',
          avatar: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
        },
        profile: {
          department: deptMap['Gynecology & Obstetrics'],
          specialization: 'High-Risk Pregnancy & Reproductive Health',
          qualification: 'MBBS, MS (OBG), MRCOG (UK)',
          experienceYears: 14,
          consultationFee: 90,
          roomNumber: 'OPD-210',
          bio: 'Dr. Maya Patel brings international experience in prenatal health, gentle birthing support, and comprehensive women’s wellness.',
          rating: 4.9,
          reviewsCount: 54,
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:30', end: '16:00', slotDurationMinutes: 30 },
        },
      },
      {
        user: {
          name: 'Dr. David Miller',
          email: 'david.miller@blossomhospital.com',
          password: 'doctor123',
          role: 'doctor',
          phone: '+1 (555) 789-0123',
          gender: 'male',
          address: '33 Spine Way, Metro City',
          avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
        },
        profile: {
          department: deptMap['Orthopedics'],
          specialization: 'Joint Replacement & Sports Medicine',
          qualification: 'MBBS, MS (Ortho), Fellowship Arthroscopy',
          experienceYears: 11,
          consultationFee: 80,
          roomNumber: 'OPD-115',
          bio: 'Specialist in arthroscopic joint surgery, knee preservation, and non-surgical sports rehabilitation.',
          rating: 4.8,
          reviewsCount: 41,
          workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
          workingHours: { start: '09:00', end: '17:00', slotDurationMinutes: 30 },
        },
      },
    ];

    const createdDoctors = [];
    for (const docData of doctorsData) {
      const u = await User.create(docData.user);
      const p = await Doctor.create({
        ...docData.profile,
        user: u._id,
      });
      createdDoctors.push(p);
    }

    console.log('🧑‍🦱 Creating Patient users...');
    const patientUser1 = await User.create({
      name: 'John Doe',
      email: 'patient@blossomhospital.com',
      password: 'patient123',
      role: 'patient',
      phone: '+1 (555) 111-2233',
      gender: 'male',
      dateOfBirth: new Date('1992-05-14'),
      address: '102 Maple Street, Apt 4B',
      bloodGroup: 'O+',
    });

    const patientUser2 = await User.create({
      name: 'Alice Walker',
      email: 'alice@example.com',
      password: 'patient123',
      role: 'patient',
      phone: '+1 (555) 444-5566',
      gender: 'female',
      dateOfBirth: new Date('1996-10-22'),
      address: '404 Blossom Terrace',
      bloodGroup: 'A+',
    });

    console.log('📅 Creating Sample Appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const formatDateStr = (d) => d.toISOString().split('T')[0];

    await Appointment.create([
      {
        patient: patientUser1._id,
        doctor: createdDoctors[0]._id, // Dr. Sarah Jenkins (Cardiology)
        department: deptMap['Cardiology'],
        appointmentDate: tomorrow,
        dateString: formatDateStr(tomorrow),
        timeSlot: '09:30 AM',
        reason: 'Routine cardiovascular checkup and mild shortness of breath upon exertion',
        symptoms: 'Mild chest tightness after jogging',
        status: 'Confirmed',
        fee: 85,
        paymentStatus: 'Paid',
      },
      {
        patient: patientUser1._id,
        doctor: createdDoctors[2]._id, // Dr. Emily Rose (Pediatrics)
        department: deptMap['Pediatrics'],
        appointmentDate: dayAfter,
        dateString: formatDateStr(dayAfter),
        timeSlot: '10:00 AM',
        reason: 'Annual pediatric health check and vaccination update for child',
        symptoms: 'None, preventative health check',
        status: 'Pending',
        fee: 65,
        paymentStatus: 'Pending',
      },
      {
        patient: patientUser2._id,
        doctor: createdDoctors[3]._id, // Dr. Alexander Wright (Dermatology)
        department: deptMap['Dermatology'],
        appointmentDate: today,
        dateString: formatDateStr(today),
        timeSlot: '11:00 AM',
        reason: 'Skin allergy assessment and rash treatment',
        symptoms: 'Itchy rash on forearms',
        status: 'Completed',
        doctorNotes: 'Prescribed topical hydrocortisone cream and cetirizine 10mg once daily. Advised avoiding scented soaps.',
        prescription: 'Hydrocortisone 1% cream, Cetirizine 10mg tablets for 7 days',
        fee: 75,
        paymentStatus: 'Paid',
      },
    ]);

    console.log(`
🌸 ======================================================== 🌸
   BLOSSOM HOSPITAL APPOINTMENT BOOKING SYSTEM SEED COMPLETE
🌸 ======================================================== 🌸

Demo Logins:
- 👑 Admin:
    Email:    admin@blossomhospital.com
    Password: admin123

- 🩺 Doctor (Cardiology):
    Email:    sarah.jenkins@blossomhospital.com
    Password: doctor123

- 🩺 Doctor (Pediatrics):
    Email:    emily.rose@blossomhospital.com
    Password: doctor123

- 🩺 Doctor (Neurology):
    Email:    robert.chen@blossomhospital.com
    Password: doctor123

- 🧑 Patient:
    Email:    patient@blossomhospital.com
    Password: patient123

- 👩 Patient 2:
    Email:    alice@example.com
    Password: patient123
============================================================
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
