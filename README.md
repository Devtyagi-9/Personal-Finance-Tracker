# Personal Finance Tracker

A modern, production-ready React application for personal finance management built with React 18, TypeScript, Vite, and Tailwind CSS.

## ✨ Features

- **Dashboard Overview**: Real-time financial summary with balance, income, and expenses
- **Smart Analytics**: Visual insights with charts and spending category breakdowns  
- **Transaction Management**: Add, categorize, and track financial transactions
- **Budget Planning**: Set and monitor budget goals with progress tracking
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js v16+ (recommended: v22.15.0)
- npm or yarn package manager

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve on http://localhost:3000
```

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 4.5.14 with hot module replacement
- **Styling**: Tailwind CSS 3.3.3 with custom design system
- **UI Components**: Radix UI primitives with custom theming
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icon library
- **State Management**: React hooks and context
- **Code Quality**: ESLint with TypeScript rules

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── LandingPage.tsx  # Landing page
│   ├── AuthPage.tsx     # Authentication
│   └── ErrorBoundary.tsx # Error handling
├── styles/
│   └── globals.css      # Global styles and CSS variables
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🔧 Development Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run type-check  # TypeScript type checking
npm run clean       # Clean build artifacts
npm run analyze     # Analyze bundle size
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Colors**: Primary blue theme with semantic color variables
- **Typography**: Modern font stack with consistent sizing
- **Spacing**: 8px base unit with responsive scaling  
- **Components**: Accessible, composable UI components
- **Dark Mode**: CSS custom properties for theme switching

## 🔒 Production Features

- **Error Boundaries**: Graceful error handling and recovery
- **Code Splitting**: Optimized bundle loading with route-based splitting
- **SEO Optimization**: Meta tags, structured data, and performance metrics
- **Security Headers**: CSP, HSTS, and other security best practices
- **PWA Ready**: Service worker support and manifest configuration
- **Docker Support**: Production containerization with Nginx

## 📊 Performance

The production build is optimized for performance:

- **Bundle Size**: ~486KB total (gzipped: ~140KB)
- **Code Splitting**: Separate chunks for UI, charts, and vendor code
- **Tree Shaking**: Unused code elimination
- **Minification**: CSS and JavaScript optimization
- **Compression**: Gzip and Brotli support

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t personal-finance-tracker .

# Run container
docker run -p 3000:80 personal-finance-tracker

# Access at http://localhost:3000
```

## 🔧 Environment Configuration

Create `.env.local` for environment-specific settings:

```bash
# API Configuration
VITE_API_URL=https://api.example.com
VITE_APP_ENV=production

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://radix-ui.com/) - Component primitives
- [Recharts](https://recharts.org/) - Chart library
- [Lucide](https://lucide.dev/) - Icon library

---

Built with ❤️ using modern web technologies for optimal performance and developer experience.
