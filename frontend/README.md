# Vijay Cashew - Frontend

React + Vite frontend for the Vijay Cashew e-commerce platform.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/      # React components
├── pages/          # Page components
├── services/       # API services
├── context/        # React context
├── hooks/          # Custom hooks
├── styles/         # Global styles
├── utils/          # Utilities
├── App.jsx         # Main app
└── main.jsx        # Entry point
```

## Environment Variables

Create a `.env` file in the root:

```
VITE_API_URL=http://localhost:5000/api
```

## API Integration

All API calls go through `services/api/axios.js` which is configured to:
- Use the backend URL from `.env`
- Include JWT tokens in all requests
- Handle 401 errors automatically

See [../backend/README.md](../backend/README.md) for API documentation.
