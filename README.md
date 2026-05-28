# Press Start

A web app for gamers to discover, explore, and manage their game collections across platforms (PlayStation, Xbox,
Nintendo, Pc) and format(digital vs. physical) so they can get through their backlog.

## Features

- **Explore:** Browse games by platform (PlayStation, Xbox, Nintendo, PC), search with live results, and discover
  new releases and upcoming titles
- **Game Results:** Filter games across 6 categories: platform, genre, time to beat, rating, release date, and
  game type with shareable filtered URLs
- **Game Details:** Rich detail pages with cover art, descriptions, screenshots, ratings, time-to-beat stats, and
  related DLC/expansions
- **Collection Management:** Track your personal game library with statuses like Playing, Want to Play, Played, On
  Pause, and Wishlist
- **Authentication:** Sign up, sign in, and password reset flows

## Tech Stack

#### Front-End

[![My Skills](https://skillicons.dev/icons?i=react,ts,vite,tailwind)](https://skillicons.dev)

- **React 19** + **TypeScript**
- **Vite** - build tool and dev server
- **React Router DOM 7** - client-side routing
- **Tailwind CSS 4** - utility-first styling
- **Headless UI** - accessible, unstyled components
- **Embla Carousel** - carousel for game showcases
- **Axios** - HTTP client for API calls
- **Phosphor Icons** - icon library

#### Back-End

[![My Skills](https://skillicons.dev/icons?i=nodejs,express,postgresql,prisma)](https://skillicons.dev)

> [👉🏻 Backend Repo](https://github.com/janessaperry/press-start-server)

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [backend server](https://github.com/janessaperry/press-start-server)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_SERVER_URL="http://localhost:8080"
```

### Development

```bash
npm run dev
```

Starts the Vite dev server at `http://localhost:5173`.

### Build

```bash
npm run build
```

Type-checks with `tsc` then produces a production build in `/dist`.

```bash
npm run preview
```

Serves the production build locally for verification.

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── assets/          # Images and platform logos
├── components/      # Reusable UI components
├── constants/       # App-wide constants and placeholder data
├── context/         # React context (auth)
├── hooks/           # Custom hooks (game data, filters, auth, responsive)
├── layouts/         # Page layout wrappers (auth pages, main app)
├── pages/           # Page components
├── routes/          # Route guards (ProtectedRoute)
├── styles/          # Global CSS, theme tokens, utilities
└── utils/           # Image URL builders, form validators
```
