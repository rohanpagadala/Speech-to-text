# Speech to Text with Deepgram API

A beautiful, real-time speech-to-text application built with React and powered by Deepgram's advanced AI speech recognition API.

![Speech to Text Demo](https://images.pexels.com/photos/7130549/pexels-photo-7130549.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dopt=1)

## Features

- 🎤 **Real-time Speech Recognition** - See your words appear instantly as you speak
- 🤖 **AI-Powered Accuracy** - Uses Deepgram's Nova-2 model for superior transcription quality
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- 💾 **Export Functionality** - Download your transcripts as text files
- 🎨 **Beautiful UI** - Modern glass-morphism design with smooth animations
- 🔒 **Privacy Focused** - All processing happens through secure API calls
- ⚡ **Fast & Reliable** - Minimal latency with robust error handling

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: Deepgram Speech-to-Text API
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ 
- A Deepgram API key (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd speech-to-text-deepgram
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Get Your Deepgram API Key

1. Visit [Deepgram](https://deepgram.com/signup) and create a free account
2. Navigate to your dashboard and copy your API key
3. You get $200 in free credits to start with!

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## How to Use

1. **Grant Permissions**: Click the microphone button and allow browser access to your microphone
2. **Start Recording**: The large blue button starts recording when clicked
3. **Speak Clearly**: Talk normally - the app works best with clear speech
4. **Watch Real-time**: Your words appear instantly in the transcript area
5. **Stop Recording**: Click the red stop button when finished
6. **Export**: Use the download button to save your transcript as a text file

## Project Structure

```
src/
├── components/          # React components
│   ├── ApiKeySetup.tsx     # API key configuration modal
│   ├── RecordingButton.tsx # Main recording control
│   ├── StatusIndicator.tsx # Recording status display
│   └── TranscriptDisplay.tsx # Live transcript viewer
├── hooks/               # Custom React hooks
│   └── useDeepgramTranscription.ts # Main transcription logic
├── types/               # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## API Configuration

The app uses Deepgram's WebSocket API with the following configuration:

- **Model**: Nova-2 (latest and most accurate)
- **Language**: English (en)
- **Features**: Smart formatting, punctuation, interim results
- **Audio**: 16kHz sample rate with noise suppression

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 14+
- ✅ Edge 79+

**Note**: Requires HTTPS in production for microphone access.

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify/Vercel

1. Build the project
2. Upload the `dist` folder
3. Add your `VITE_DEEPGRAM_API_KEY` environment variable in the hosting platform

## Performance Tips

- Use a quality microphone for best results
- Speak clearly and at a moderate pace
- Minimize background noise
- Ensure stable internet connection for real-time processing

## Troubleshooting

### Common Issues

**"Microphone access denied"**
- Check browser permissions
- Ensure HTTPS is used (required for mic access)
- Try refreshing the page

**"API key not found"**
- Verify your `.env` file exists and contains the correct key
- Restart the development server after adding the key

**"Connection failed"**
- Check your internet connection
- Verify your Deepgram API key is valid and has credits remaining

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [Deepgram](https://deepgram.com) for their excellent speech-to-text API
- [Lucide](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling utilities

---

Built with ❤️ and the power of AI speech recognition