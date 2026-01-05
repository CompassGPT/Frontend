# CompassGPT Frontend

This is the frontend application for the CompassGPT project, built with React and Vite.

## Features

- Modern React SPA
- Authentication and protected routes
- API integration with backend
- Responsive design

## Requirements

- Node.js 18+
- npm
- (Optional) Docker

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Running Locally

### Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Using Docker

Build and run the container:

```bash
docker build -t compassgpt-frontend .
docker run -p 5173:5173 compassgpt-frontend
```

## Configuration

- Environment variables can be set in a `.env` file (see documentation or ask the team for required variables).
- API endpoints are configured in `src/lib/api.ts`.

## Project Structure

- `src/` – Source code
- `public/` – Static assets

## License

See [LICENSE](LICENSE).
