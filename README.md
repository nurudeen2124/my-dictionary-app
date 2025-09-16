# Dictionary App

A modern, full-stack dictionary application with a Python backend and React/Next.js frontend.

## Features

- 🔍 **Comprehensive Word Search**: Get detailed definitions, pronunciations, and examples
- 🎯 **Smart Autocomplete**: Word suggestions as you type
- 🎵 **Audio Pronunciations**: Listen to correct pronunciations
- 🎨 **Modern UI**: Beautiful, responsive design with emerald green theme
- ⚡ **Fast Python Backend**: Robust API with async support and error handling
- 🛡️ **Input Validation**: Comprehensive validation and sanitization
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Architecture

### Frontend (React/Next.js)
- Modern React components with TypeScript
- Tailwind CSS for styling with custom design tokens
- Real-time search with debounced autocomplete
- Responsive design with glass morphism effects

### Backend (Python)
- FastAPI-like HTTP server with CORS support
- Async/await support for better performance
- Comprehensive input validation and error handling
- Integration with external dictionary API
- Word suggestion system

## Getting Started

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- Required Python packages: `aiohttp`, `requests`

### Installation

1. **Install Python dependencies**:
\`\`\`bash
pip install aiohttp requests
\`\`\`

2. **Start the Python backend**:
\`\`\`bash
cd scripts
python run_dictionary_server.py
\`\`\`
The server will start on `http://localhost:8000`

3. **Start the frontend** (in v0):
The Next.js app will automatically connect to the Python backend.

### Testing

Run the comprehensive test suite:
\`\`\`bash
cd scripts
python test_dictionary_features.py
\`\`\`

This will test:
- Word search functionality
- Input validation
- Autocomplete suggestions
- Error handling
- Data structure validation
- Server endpoints (if running)

## API Endpoints

### Python Backend (`localhost:8000`)

- `GET /api/search?word=<word>` - Search for word definitions
- `GET /api/suggestions?partial=<partial>` - Get word suggestions
- `GET /api/health` - Health check endpoint

### Example Response

\`\`\`json
{
  "word": "hello",
  "found": true,
  "data": [
    {
      "word": "hello",
      "phonetic": "/həˈloʊ/",
      "meanings": [
        {
          "partOfSpeech": "exclamation",
          "definitions": [
            {
              "definition": "Used as a greeting or to begin a phone conversation.",
              "example": "Hello there, Katie!"
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

## Environment Variables

- `NEXT_PUBLIC_PYTHON_API_URL` - Python API URL (defaults to `http://localhost:8000/api`)

## Development

### Code Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dictionary page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles with design tokens
├── components/            # React components
│   ├── search-bar.tsx     # Search with autocomplete
│   ├── definition-card.tsx # Word definition display
│   └── api-status.tsx     # Backend status monitor
├── lib/                   # Utilities
│   └── dictionary-api.ts  # API client functions
├── scripts/               # Python backend
│   ├── dictionary_api.py  # Core API logic
│   ├── run_dictionary_server.py # HTTP server
│   └── test_dictionary_features.py # Test suite
└── types/                 # TypeScript definitions
    └── dictionary.ts      # API response types
\`\`\`

### Design System

The app uses a custom emerald green theme with semantic design tokens:

- **Primary**: Emerald green (#059669)
- **Secondary**: Bright green (#10b981) 
- **Neutrals**: White, light gray, dark gray
- **Typography**: Geist Sans for clean, modern text

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the test suite
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.
