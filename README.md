# ChatGPT Email Monitor Extension

A Chrome extension that monitors ChatGPT prompts and automatically detects, anonymizes, and logs email addresses to protect user privacy.

## Features

### Core Functionality

- **Email Detection**: Automatically scans ChatGPT prompts for email addresses using regex patterns
- **Automatic Anonymization**: Replaces detected emails with `[EMAIL_ADDRESS]` before sending to ChatGPT
- **Real-time Alerts**: Shows immediate alerts when email addresses are detected
- **Persistent Logging**: Stores all detected emails in browser local storage

### User Interface

- **React/TypeScript**: Modern, responsive UI built with React and Tailwind CSS
- **Two-Tab Interface**:
  - **Issues Found**: Displays the most recent email detections
  - **History**: Shows complete history of all detections with expandable details
- **React Query**: Data fetching and caching with automatic background refresh
- **Polished Design**: Tailwind CSS with shadcn/ui components

### Advanced Features

- **24-Hour Dismiss System**: Dismiss individual emails for 24 hours to prevent repeated alerts
- **Visual Indicators**: Shows dismissed status and remaining time for each email
- **Cross-Browser Support**: Compatible with Chrome, Edge, and other Chromium-based browsers

## Architecture

### Components

1. **Service Worker** (`src/background/service-worker.ts`)
   - Handles message passing between content script and popup
   - Manages browser storage operations
   - Implements dismiss system with 24-hour expiration
   - Auto-cleanup of expired dismissals every hour

2. **Content Script** (`src/content/content-script.ts`)
   - Intercepts Enter key and send button clicks
   - Scans prompt text for email addresses
   - Blocks send, checks dismissed status, then anonymizes or allows

3. **React Popup UI** (`src/popup/`)
   - Main App component with tab navigation
   - IssuesFound component for latest detections
   - History component with expandable issue list
   - React Query hooks for data fetching

### Data Flow

```
User types email → Tries to send → Content script intercepts (sync block)
    → Service worker checks dismissed list → Returns non-dismissed emails
    → If any: anonymize text, show alert, log to history
    → If all dismissed: programmatically trigger send
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or download the project**

   ```bash
   cd chrome-extension
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

   For development with auto-rebuild:

   ```bash
   npm run dev
   ```

4. **Load in Chrome/Edge**
   - Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist` folder from this project

5. **Create Icons** (Optional)
   - The manifest expects icon files in `public/icons/`
   - You can create simple PNG icons or use placeholders:
     - icon16.png (16x16)
     - icon48.png (48x48)
     - icon128.png (128x128)

## Usage

1. **Navigate to ChatGPT**
   - Go to https://chat.openai.com or https://chatgpt.com
   - Start a new conversation

2. **Type a message with an email**
   - Example: "Send a report to john.doe@example.com"
   - The extension will detect and alert you

3. **View Detections**
   - Click the extension icon in your browser toolbar
   - Switch between "Issues Found" and "History" tabs

4. **Dismiss Emails**
   - Click "Dismiss" on any email to suppress alerts for 24 hours
   - Dismissed emails show a green badge with remaining time

5. **Clear History**
   - Click "Clear History" button in the History tab to remove all records
   - This also clears all dismissed emails

## Technical Details

### Email Detection

- Uses regex pattern: `/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g`
- Scans request body before sending to ChatGPT API
- Handles multiple emails in a single prompt

### Anonymization

- Replaces each detected email with `[EMAIL_ADDRESS]`
- Ensures ChatGPT never receives actual email addresses
- Maintains original message structure

### Storage Structure

```typescript
{
  emailIssues: [
    {
      id: string,
      emails: string[],
      url: string,
      timestamp: number
    }
  ],
  dismissedEmails: [
    {
      email: string,
      dismissedAt: number,
      expiresAt: number
    }
  ]
}
```

## Development

### Project Structure

```
chrome-extension/
├── public/
│   ├── manifest.json
│   └── icons/
├── src/
│   ├── background/
│   │   └── service-worker.ts
│   ├── content/
│   │   └── content-script.ts
│   ├── popup/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   ├── styles.css
│   │   └── components/
│   │       ├── issues-found.tsx
│   │       └── history.tsx
│   ├── components/ui/        # shadcn/ui components
│   ├── hooks/
│   │   └── useEmailQueries.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── query-client.ts
│   │   ├── persister.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── popup.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Build Commands

- `npm run build` - Production build
- `npm run dev` - Development build with watch mode
- `npm run type-check` - TypeScript type checking

### Key Technologies

- **TypeScript**: Type-safe development
- **React 19**: Latest React version
- **Vite**: Fast build tool with HMR
- **CRXJS**: Vite plugin for Chrome Extension development
- **React Query**: Server state management with caching and background refresh
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component primitives
- **Chrome Extension API**: Manifest V3

## Browser Compatibility

### Supported Browsers

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Any Chromium-based browser

### Firefox Support

The extension can be adapted for Firefox by:

1. Updating manifest.json to use `browser` namespace
2. Using the browser-compat.ts utility for API calls
3. Testing with Firefox-specific requirements

## Security & Privacy

- **No External Network Calls**: All data stays local
- **Local Storage Only**: Uses browser's local storage API
- **No Data Collection**: Extension doesn't collect or transmit user data
- **Open Source**: All code is transparent and auditable

## Troubleshooting

### Extension not detecting emails

- Ensure you're on chat.openai.com or chatgpt.com
- Check that the extension is enabled
- Reload the ChatGPT page after installing

### Build errors

- Delete `node_modules` and `dist` folders
- Run `npm install` again
- Ensure you're using Node.js v16+

### Storage issues

- Open DevTools > Application > Storage
- Clear extension storage and reload

## License

MIT License - Feel free to use and modify for your needs.

## Credits

Created as an educational project demonstrating:

- Chrome Extension development with Manifest V3
- React/TypeScript integration
- State management with Context API
- Fetch request interception
- Browser storage management
