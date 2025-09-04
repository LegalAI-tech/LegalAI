# LegalAI - Your Legal Queries Simplified

Transform complex legal questions into clear, actionable insights with our AI-powered legal assistant.

## 🚀 Features

- **AI-Powered Chat Interface** - Interactive chat system for legal queries
- **Modern UI/UX** - Built with Radix UI components and Tailwind CSS
- **Dark/Light Theme Support** - Seamless theme switching with next-themes
- **Responsive Design** - Optimized for desktop and mobile devices
- **Real-time Animations** - Enhanced user experience with Framer Motion and GSAP
- **TypeScript Support** - Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Spline, Cobe
- **Icons**: Lucide React
- **Theme**: next-themes

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/AnuGuin/LegalAI.git
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── chat/              # Chat-related pages
│   ├── demo/              # Demo pages
│   └── test/              # Test pages
├── components/            # React components
│   ├── app/               # Main application components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat interface components
│   ├── landing/           # Landing page components
│   ├── providers/         # Context providers
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🎨 Key Components

### Chat System
- **ChatMessage**: Displays individual chat messages with user/assistant differentiation
- **Avatar Support**: User avatars and bot icons
- **Timestamp Display**: Message timing information
- **Responsive Layout**: Adapts to different screen sizes

### UI Components
- Built on Radix UI primitives for accessibility
- Custom styling with Tailwind CSS
- Consistent design system across the application

## 🚀 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production with Turbopack
- `npm start` - Start the production server

## 🎯 Development

The project uses modern development practices:

- **Turbopack**: Fast bundler for development and production
- **TypeScript**: Static type checking
- **ESLint**: Code linting (configured via Next.js)
- **Path Aliases**: Clean imports with `@/*` mapping to `src/*`

## 🌟 Features in Development

- Legal document analysis
- Case law research
- Legal advice generation
- Document templates
- Multi-language support

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices
- Various screen orientations

## 🔧 Configuration

The project includes configuration for:
- **TypeScript**: Strict mode enabled with modern ES features
- **Tailwind CSS**: Custom design system with animations
- **Next.js**: Optimized for performance and SEO

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js and modern web technologies.
