# SnapCode Room

A beautiful, temporary code collaboration tool for hackathons, interviews, and quick team syncs. Share code snippets instantly with zero setup.

## ✨ Features

### Core Functionality
- **🚀 Instant Room Creation** - Create a new collaboration space in seconds with just one click
- **⏰ Auto-Expiration** - Rooms automatically expire after your chosen timeframe (6h, 12h, 24h)
- **📝 Multiple Code Snippets** - Add and manage multiple code snippets with syntax highlighting
- **🎨 20+ Languages** - Support for JavaScript, TypeScript, Python, Java, Go, Rust, and more
- **📋 Copy to Clipboard** - Quickly copy any code snippet with a single click
- **🔗 Unique Room Links** - Get a unique link to share with team members (no login needed)
- **✨ Syntax Highlighting** - Beautiful, accurate code highlighting for all supported languages
- **🌓 Light/Dark Mode** - Seamlessly toggle between themes with persistent preferences

### UI/UX Enhancements
- **Beautiful Hero Section** - Engaging home page with feature highlights
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Loading spinners, transitions, and visual feedback
- **Interactive Cards** - Hover effects and smooth transitions throughout
- **Toast Notifications** - Real-time feedback for user actions
- **Mobile Optimized** - Touch-friendly buttons and mobile-first layout
- **Accessibility** - ARIA labels, keyboard navigation, and screen reader support

## 🎨 Design System

### Color Palette
- **Light Mode**: Clean whites (#fff) and grays with blue accents (#0969da)
- **Dark Mode**: Deep background (#0d1117) with bright blue accents (#58a6ff)
- **Consistency**: All components use theme-aware design tokens

### Typography
- **Headings**: Bold, clean sans-serif (Geist)
- **Body**: Readable sans-serif for comfortable reading
- **Code**: Monospace font for perfect code alignment

### Interactive Elements
- **Loading States**: Animated spinners on buttons during operations
- **Hover Effects**: Enhanced shadows, border colors on card hover
- **Copy Feedback**: Visual confirmation when code is copied
- **Button States**: Disabled states when operations are in progress

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation
```bash
npm install
# or
yarn install
```

### Development
```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

## 📖 How to Use

### 1. Create a Room (Home Page)
- Visit the SnapCode Room homepage
- Select room expiry time: **6 hours**, **12 hours**, or **24 hours**
- Click **Create Room** button
- You'll be taken to your unique room workspace

### 2. Share with Your Team
- In the room header, click **Copy Link** to copy the room URL
- Share this link with your teammates
- No login or authentication required

### 3. Add Code Snippets
- Click the **Add Snippet** button in the header
- **Title** (required): Give your snippet a meaningful name
- **Language** (required): Select the programming language
- **Code** (required): Paste your code
- **Description** (optional): Add notes or explanation
- Click **Add Snippet** to share instantly

### 4. View & Manage Snippets
- All snippets are displayed on the snippet board
- Each snippet shows:
  - Title and description
  - Language badge
  - Syntax-highlighted code
  - Time added
  - Who added it
- Click **Copy Code** to copy snippet to clipboard
- Click **Delete** to remove a snippet

### 5. Theme Toggle
- Click the Sun/Moon icon in the top-right corner
- Your preference is automatically saved
- Works on both home page and room dashboard

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19.2
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui (production-ready components)
- **Code Highlighting**: react-syntax-highlighter with Atom One Dark theme
- **Icons**: Lucide React (beautiful, consistent icons)
- **Theme Management**: next-themes (seamless light/dark mode)
- **State Management**: React hooks with localStorage (demo)
- **Type Safety**: TypeScript for full type coverage

### Data Structure
```typescript
// Room Object
{
  id: string              // Unique room identifier
  createdAt: string       // ISO timestamp
  expiresAt: string       // ISO timestamp for expiration
  snippets: Snippet[]     // Array of code snippets
}

// Snippet Object
{
  id: string              // Unique snippet ID
  title: string           // User-given title
  language: string        // Programming language
  code: string            // Source code
  description?: string    // Optional description
  createdAt: string       // When it was added
  createdBy: string       // Who added it (currently "You")
}
```

## 📁 File Structure

```
/app
  ├── page.tsx                    # Home page with room creation
  ├── layout.tsx                  # Root layout with theme provider
  ├── globals.css                 # Theme tokens & global styles
  └── /room/[id]
      ├── page.tsx               # Room workspace
      └── layout.tsx             # Room layout

/components
  ├── /ui                         # shadcn/ui components
  ├── /room
  │   ├── room-header.tsx        # Header with room info & actions
  │   ├── snippet-board.tsx      # Display all snippets
  │   └── add-snippet-modal.tsx  # Add snippet form
  ├── theme-provider.tsx         # next-themes setup
  └── theme-toggle.tsx           # Light/dark mode button

/hooks
  ├── use-room.ts               # Room data management
  ├── use-toast.ts              # Toast notifications
  └── use-mobile.ts             # Mobile detection

/lib
  └── utils.ts                  # Utility functions (cn)
```

## 💬 Supported Languages

The app includes support for **19+ programming languages**:

- **Web**: JavaScript, TypeScript, JSX, TSX, HTML, CSS
- **Backend**: Python, Java, C++, C#, Go, Rust, Ruby, PHP
- **Data**: SQL, JSON, YAML, XML, Shell

## 🎯 Use Cases

- **Hackathons**: Instant code sharing without account setup
- **Technical Interviews**: Live code collaboration during interviews
- **Code Reviews**: Discuss snippets with colleagues
- **Remote Pair Programming**: Quick collaborative sessions
- **Quick Demos**: Share code examples with perfect formatting

## ✅ Fully Functional Features

- ✅ Create rooms with expiry times
- ✅ Add code snippets with all details
- ✅ Delete snippets
- ✅ Copy code to clipboard
- ✅ Syntax highlighting for 19+ languages
- ✅ Light/Dark theme toggle
- ✅ Responsive mobile design
- ✅ Loading states and animations
- ✅ Toast notifications
- ✅ localStorage persistence

## 🔄 Next Steps (Backend Integration)

### Phase 2 - Backend Implementation
- **Real-time Collaboration**: WebSocket updates with Socket.IO
- **Database**: Redis or PostgreSQL for persistent storage
- **API**: RESTful endpoints for room & snippet operations
- **Auto-Cleanup**: Server-side TTL and cleanup jobs
- **User Management**: Optional anonymous user identification

### Phase 3 - Advanced Features
- Room access controls
- Snippet comments and discussions
- Code execution capabilities
- Integration with IDEs
- Team analytics and history

## 🎨 Customization

### Add More Languages
Edit `LANGUAGE_OPTIONS` in `/components/room/add-snippet-modal.tsx`

### Change Expiry Times
Edit `EXPIRY_OPTIONS` in `/app/page.tsx`

### Modify Colors
Edit color tokens in `/app/globals.css`:
- Light theme: `:root` section
- Dark theme: `.dark` section

### Change Syntax Theme
In `/components/room/snippet-board.tsx`, import different styles from `react-syntax-highlighter/dist/esm/styles/hljs`

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect your GitHub repo to Vercel
# Auto-deploys on push to main branch
```

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 Notes

- **Current**: Uses localStorage for demo (cleared on browser cache)
- **Production**: Will use backend database with TTL
- **Real-time**: Currently uses polling, ready for WebSocket upgrade
- **Security**: Production version will include proper auth & validation

## 🤝 Contributing

This project is built with modern web technologies and is designed to be easily extended. The architecture supports:
- Backend API integration
- Real-time WebSocket updates
- Database persistence
- User authentication

---

**Built with ❤️ for developers who value simplicity and speed.**
