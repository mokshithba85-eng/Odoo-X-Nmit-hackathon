
# Gemini AI Chatbot Setup

## Environment Variables

To use the AI chatbot feature, you need to set up the following environment variables:

### Backend (.env file)

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/ecofinds

# Server Configuration
PORT=4000
CLIENT_ORIGIN=http://localhost:3000

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env` file as `GEMINI_API_KEY`

## Installation

1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

## Features

The AI chatbot provides:
- Eco-friendly product recommendations
- Sustainability advice
- General help with the ECOFINDS marketplace
- Environmental impact information
- Buying and selling guidance

The chatbot appears as a floating chat button on all pages and opens a modal interface for conversation.
