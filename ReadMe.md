# Gemini Chat Web App

A lightweight chat interface that connects to Google's Gemini API using the official `@google/genai` client. The app exposes a single Express endpoint that proxies requests from the browser, keeping your API key safely on the server.

## Features

- ✨ Modern, responsive chat UI with an empty state and loading feedback
- 🔐 Server-side integration with Gemini using `GEMINI_API_KEY`
- ♻️ Conversation history persisted across turns for more contextual replies
- 🚀 Single command to start both the API and static client

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create an environment file**

   Copy `.env.example` (or create a new file) and add your Gemini API key:

   ```bash
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   ```

   You can generate a key from the [Google AI Studio](https://aistudio.google.com/).

3. **Run the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

4. **Chat with Gemini**

   Open the app in your browser, ask a question, and wait for Gemini's reply.

## Project Structure

```
.
├── public
│   ├── app.js        # Front-end logic for handling chat interactions
│   ├── index.html    # Static HTML entry point
│   └── styles.css    # Styling for the chat UI
├── server
│   └── index.js      # Express server and Gemini API proxy
├── .gitignore
├── package.json
└── ReadMe.md
```

## Environment Variables

| Name            | Required | Description                            |
| --------------- | -------- | -------------------------------------- |
| `GEMINI_API_KEY` | Yes      | API key used to authenticate with Gemini |

## Notes

- The Express server automatically serves the static files from `public/`.
- Ensure that `GEMINI_API_KEY` is set before making requests; otherwise, the API call will fail.
- The repository does not include a build step—what ships in `public/` is what the browser receives.
