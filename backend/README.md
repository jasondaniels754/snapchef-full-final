# SnapChef Backend

This is the Express server for SnapChef. It exposes a `/generate-recipes` endpoint that queries the OpenAI API.

## Setup

1. Copy `.env.example` to `.env` and fill in your OpenAI key.
2. `npm install`
3. `npm run dev` for development (with nodemon) or `npm start` to run normally.

## Endpoints

- `POST /generate-recipes`
  - Body: `{ difficulty, genre, numIngredients }`
  - Response: `{ content: string }`
