# Seizure Pregnancy Navigator

A comprehensive web application designed specifically for pregnant women with epilepsy to manage seizures, medications, and pregnancy safely with proper medical guidance.

## 🎯 Overview

The Seizure Pregnancy Navigator is a free, evidence-based application that empowers pregnant women with epilepsy to:

- **Track seizures** with detailed logging and analytics
- **Monitor medication safety** during pregnancy
- **Follow pregnancy milestones** with trimester-specific guidance
- **Generate reports** for healthcare providers
- **Access emergency information** when needed

## ✨ Key Features

### 🧾 Tracking
- **Seizure Logging**: Time, type, severity, triggers, and notes
- **Medication Tracking**: Safety profiles and pregnancy categories
- **Symptom Monitoring**: Fatigue, nausea, headaches, mood
- **Pregnancy Milestones**: Trimester-based guidance and reminders

### 🔍 Knowledge & Guidance
- **Medication Safety Database**: Searchable database with pregnancy categories
- **Trimester-Based Care**: Epilepsy-specific guidance for each trimester
- **Nutrition & Lifestyle**: General health and wellness tips
- **Emergency Checklists**: What to do during seizures while pregnant

### 👨‍👩‍👧 Doctor-Centric
- **Pre-Consultation Reports**: Auto-generated PDF/CSV for healthcare providers
- **Medical Disclaimers**: Clear notices that app doesn't replace medical advice
- **Healthcare Integration**: Designed to support doctor-patient relationships

### 📲 Reminders & Safety
- **Medication Reminders**: Never miss a dose
- **Appointment Reminders**: Neurologist and OB/GYN visits
- **Seizure Diary Prompts**: Daily check-ins
- **SOS Button**: Quick access to emergency contacts
- **Offline Mode**: Works without internet connection

## 🛠️ Technical Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Hook Form** for form handling
- **React Hot Toast** for notifications

### Backend
- **Next.js API Routes** for data management
- **Local Storage** for data persistence
- **JSON/CSV/XML** data formats
- **PDF generation** for reports

### Data Sources
- **OpenFDA API** for drug information
- **NIH DailyMed API** for medication safety
- **CDC, WHO, RCOG** guidelines and data
- **Epilepsy Foundation** resources
- **Comprehensive medical databases**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/seizure-pregnancy-navigator.git
   cd seizure-pregnancy-navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Deployment

#### Vercel (Recommended)
1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

#### Other Platforms
- **Netlify**: Connect your GitHub repository
- **Railway**: Deploy with one click
- **Heroku**: Use the included `vercel.json` configuration

## 📱 Features Overview

### Seizure Tracking
- Log seizures with detailed information
- Track patterns and triggers
- Generate analytics and reports
- Export data for healthcare providers

### Medication Safety
- Comprehensive medication database
- Pregnancy category information
- Safety profiles and monitoring requirements
- Search and filter capabilities

### Pregnancy Monitoring
- Set due date and track progress
- Trimester-specific guidance
- Milestone tracking
- Healthcare provider integration

### Emergency Features
- Quick access to emergency contacts
- Seizure first aid information
- Pregnancy-specific emergency guidance
- Offline accessibility

## 🔒 Privacy & Security

- **Local Storage**: All data stored locally by default
- **HIPAA/GDPR Friendly**: Patient owns their data
- **No Tracking**: No analytics or user tracking
- **Secure**: All data stays on your device

## 📊 Data Sources

### Medical Databases
- **Epilepsy Foundation** - Seizure management resources
- **RCOG Guidelines** - Royal College of Obstetricians and Gynaecologists
- **CDC Data** - Centers for Disease Control and Prevention
- **WHO Resources** - World Health Organization
- **NIH Information** - National Institutes of Health

### Medication Safety
- **OpenFDA API** - Drug safety information
- **DailyMed API** - Medication labeling
- **RxNorm** - Standardized drug names
- **Pregnancy Categories** - FDA pregnancy risk categories

## 🎨 UI/UX Design

### Design Principles
- **Calm Colors**: Soft blues, pinks, and greens to reduce anxiety
- **Minimal Steps**: Seizure logging in ≤ 3 taps
- **Icons + Text**: Easy navigation for stressed users
- **Accessibility**: Large text options and voice-to-text support
- **Mobile-First**: Optimized for mobile devices

### Color Scheme
- **Primary**: Blue (#0ea5e9) - Trust and medical
- **Secondary**: Pink (#ec4899) - Pregnancy and care
- **Success**: Green (#22c55e) - Safety and health
- **Warning**: Yellow (#f59e0b) - Caution and attention
- **Danger**: Red (#ef4444) - Emergency and alerts

## 📈 Roadmap

### Phase 1 (MVP) - 4-6 weeks ✅
- [x] User onboarding and disclaimers
- [x] Seizure diary with local storage
- [x] Medication log with pregnancy-safe database
- [x] Appointment and medication reminders
- [x] Basic pregnancy tracker

### Phase 2 (Enhancements) - 6-8 weeks
- [ ] Auto-generated PDF health reports
- [ ] Kick counter and fetal movement log
- [ ] SOS button customization
- [ ] Daily wellness check-in

### Phase 3 (Final Touch) - 8-10 weeks
- [ ] Caregiver mode (partner can log on patient's behalf)
- [ ] Offline-first optimization
- [ ] Accessibility improvements
- [ ] In-app educational library

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Emergency Resources
- **Emergency Services**: 911
- **Epilepsy Foundation Helpline**: 1-800-332-1000
- **National Suicide Prevention Lifeline**: 988

### Medical Disclaimer
This application is for informational purposes only and does not replace professional medical advice. Always consult your healthcare provider before making any medical decisions.

## 🙏 Acknowledgments

- **Epilepsy Foundation** for resources and guidance
- **RCOG** for clinical guidelines
- **CDC** for health information
- **WHO** for global health resources
- **Medical professionals** who provided expert review

## 📞 Contact

- **Project Lead**: [Your Name]
- **Email**: [your-email@example.com]
- **GitHub**: [@your-username]

---

**Remember**: This app is designed to support your relationship with healthcare providers, not replace them. Always consult your doctor for medical decisions.
