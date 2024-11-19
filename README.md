![Press Start Logo](./public/press-start-logo-tagline-dark.svg#gh-dark-mode-only)
![Press Start Logo](./public/press-start-logo-tagline-light.svg#gh-light-mode-only)

## Overview

Press Start is an app that helps users build and manage a personal library of the video games they own. It allows them to track which games they have, what platform they’re on, and whether they are physical or digital. This MVP is designed for personal use, with user registration and authentication being added later if there is time.

### Problem Space

Gamers often find themselves stuck when deciding what to play next, especially when they can’t remember which games they already own. Managing a collection of games across multiple consoles and formats—digital and physical—makes it easy to forget about titles purchased during sales or lost in the shuffle. Press Start addresses this pain point by offering a centralized platform where users can organize all their games in one place, making it easy to see their collection and decide on their next adventure. Whether you’re in the mood for a quick puzzle game or an expansive RPG, Press Start helps you quickly identify which games are ready to play.

### User Profile

**:dart: Target Users**

- Gamers with collections spanning multiple platforms (consoles, PC, etc.).
- Players who need an efficient way to organize both physical and digital games.
- Users who want to quickly browse their libraries to decide what to play next.

### Features

**:mag: Browsing & Search**
Explore games by platform, release date, or popularity, or searching by title.

**:gear: Library Filters**
Sort and filter games by platform, genre, time to beat, etc.

**:video_game: Game Management**
Users can add, edit, and delete games in their library, specifying platform, format, and status.

**:iphone: Responsive Design**
Fully responsive for use across all device sizes.

#### Optional Future Enhancements

**:lock: User Registration & Login**
Allow users to create accounts to save their libraries and wishlists.

**:star2: Game Recommendations**
Suggest titles based on a user’s preferences and collection.

**:bell: Notifications**
Alert users about new game releases in franchises they own.

## Implementation

### Tech Stack

**Front-end:** React, Sass, Axios, React Router
**Back-end:** Node.js, Express.js
**Database:** MySQL, Knex
**Authentication _(optional future enhancement)_:** Firebase

### APIs

IGDB (https://www.igdb.com/api)

### Sitemap

- **Landing Page _(optional future enhancement)_:** Overview of website, call to action to sign up.
- **Login/Register _(optional future enhancement)_:** User authentication.
- **Explore:** Users can search for games, or browse by platform, release date, etc.
- **Search Results:** List of games with pagination at the bottom and filters along the side for console, genre, etc.
- **Game Details:** Show details of a specific game along with Similar Games and Other Games in Franchise.
- **Dashboard:** User's library of games where they can see everything they own and filter for what to play for next.
- **User Settings _(optional future enhancement)_:** Manage personal settings including avatar, email, and password.

### Mockups

#### Dashboard

![Dashboard Mockup](./public/mockups/ps-wireframes-dashboard.png)

#### Explore

![Explore Mockups](./public/mockups/ps-wireframes-explore.png)

#### Game List

![Game List Mockups](./public/mockups/ps-wireframes-search-results.png)

#### Game Details

![Game Details Mockups](./public/mockups/ps-wireframes-game-details.png)

### Data

#### User

Represents each registered user.

- id _(primary key)_
- email
- password
- name / username

#### Library

Represents relationship between a user and their game library.

- id: _(primary key)_
- userId: _(foreign key)_
- gameId _(unique identifier for games in IGDB API)_
- gameStatus
  - Playing
  - Want to play
  - Played
  - Wishlist
- gameConsole
  - Xbox (X|S, One, 360)
  - PlayStation (PS5, PS4, PS3)
  - Nintendo (Switch, Wii U, Wii)
  - PC
  - MacOs
  - Linux
- gameFormat
  - Physical
  - Digital

### Endpoints

#### Proxy Server Endpoints

**GET /api/games/:platform**

- Get list of games based on gaming Platform.
  _Note, this endpoint could switch out Platform for Release Date._

Response _(Status 200 OK)_

```
[
	{
		"id": 217554,
		"cover": "cover-url.png",
		"name": "Octopath Traveller II",
		"platforms": ["PC", "PS4", "Xbox One", "Switch", "PS5", "Xbox X|S"],
		"genres": ["Role-playing (RPG)", "Turn-based strategy (TBS)"],
	},
	{...}
]
```

Response _(Status 404 Not Found)_

```
[
	{
		"message": "Error fetching games",
	}
]
```

**GET /api/game-details/:gameId**

- Get details for a game based on game ID.

Response _(Status 200 OK)_

```
{
	"id": 217554,
	"cover": "cover-url.png",
	"esrbRating": ["Mild Blood", "Use of Alcohol & Tobacco",
	"Fantasy Violence", "Suggestive Themes", "Mild Language"],
	"name": "Octopath Traveller II",
	"developer": "Square Enix",
	"releaseDate": "Feb 24, 2023",
	"summary": "This game is a brand-new entry in the Octopath Traveler series. It takes the series’ HD-2D graphics, a fusion of retro pixel art and 3DCG, to even greater heights. In the world of Solistia, eight new travelers venture forth into an exciting new era. Where will you go? What will you do? Whose tale will you bring to life? Every path is yours to take. Embark on an adventure all your own.",
	"rating": 89,
	"platforms": ["PC", "PS4", "Xbox One", "Switch", "PS5", "Xbox X|S"],
	"genres": ["Role-playing (RPG)", "Turn-based strategy (TBS)"],
	"franchises": [
		{
			"id": 123,
			"cover": "cover-url.png",
			"name": "Title of Game",
			"rating": 86,
			"platforms": ["PC", "PS4", "Xbox One", "Switch", "PS5", "Xbox X|S"],
			"releaseDate": "Feb 24, 2023",
		},
		{...},
	],
	"similarGames": [
		{
			"id": 123,
			"cover": "cover-url.png",
			"name": "Title of Game",
			"rating": 86,
			"platforms": ["PC", "PS4", "Xbox One", "Switch", "PS5", "Xbox X|S"],
			"releaseDate": "Feb 24, 2023",
		},
		{...},
	],
}
```

**POST /api/search**

- Search for game by title.

Request Body

```
{
	"query": "queryString"
}
```

Response _(Status 200 OK)_

```
[
	{
		"id": 217554,
		"cover": "cover-url.png",
		"name": "Octopath Traveller II",
		"platforms": ["PC", "PS4", "Xbox One", "Switch", "PS5", "Xbox X|S"],
	},
	{...}
]
```

Response _(Status 404 Not Found)_

```
[
	{
		"message": "No games found for query string",
	}
]
```

#### Database Endpoints

**GET /library**

- Gets list of games from users library

Request Header

```
Authorization: Bearer <access-token>
```

Response _(Status 200 OK)_

```
[{
	"id": 1,
	"userId": 1,
	"gameId": 26765,
	"gameName": "Octopath Traveler II",
	"gameCover": "octopath-cover.png",
	"gameStatus": "Want to play",
	"gameConsole": "Switch",
	"gameFormat": "Digital",
},
{
	"id": 2,
	"userId": 1,
	"gameId": 152202,
	"gameName": "Avatar: Frontiers of Pandora",
	"gameCover": "avatar-fop-cover.png",
	"gameStatus": "Played",
	"gameConsole": "PS5",
	"gameFormat": "Physical",
}]
```

Response _(Status 400 Bad Request)_

```
{
	"message": "Error fetching library data"
}
```

**POST /library**

- Adds game to user's library

Request Header

```
Authorization: Bearer <access-token>
```

Request Body

```
{
	"gameId": 1942,
	"gameName": "The Witcher 3: Wild Hunt",
	"gameCover": "the-witcher-3.png",
	"gameStatus": "Want to play",
	"gameConsole": "Xbox X|S",
	"gameFormat": "Physical",
}
```

Response _(Status 201 Created)_

```
{
	"id": 3,
	"userId": 1,
	"gameId": 1942,
	"gameName": "The Witcher 3: Wild Hunt",
	"gameCover": "the-witcher-3.png",
	"gameStatus": "Want to play",
	"gameConsole": "Xbox X|S",
	"gameFormat": "Physical",
}
```

Response _(Status 400 Bad Request)_

```
{
	"message": "Error adding game to library",
	"gameId": "OK" || "Invalid gameId",
	"gameName": "OK" || "Invalid gameName",
	"gameCover": "OK" || "Invalid gameCover",
	"gameStatus": "OK" || "Invalid gameStatus",
	"gameConsole": "OK" || "Invalid gameConsole",
	"gameFormat": "OK" || "Invalid gameFormat",
}
```

**PATCH /library/:id**

- Updates a game in user's library. Users can update Status, Platform, and Format. The example below demonstrates an update to game Status.

Request Header

```
Authorization: Bearer <access-token>
```

Request Body

```
{
	"gameStatus": "Playing",
}
```

Response _(Status 200 OK)_

```
{
	"id": 3,
	"userId": 1,
	"gameId": 1942,
	"gameName": "The Witcher 3: Wild Hunt",
	"gameCover": "the-witcher-3.png",
	"gameStatus": "Playing",
	"gameConsole": "Xbox X|S",
	"gameFormat": "Physical",
}
```

Response _(Status 400 Bad Request)_

```
{
	"message": "Error updating game",
}
```

**DELETE /library/:id**

- Removes game from user's library by id.

Request Header

```
Authorization: Bearer <access-token>
```

Response _(Status 204 No Content)_
No response body for status 204.

Response _(Status 400 Bad Request)_

```
{
	"message": "Error deleting game",
}
```

## Roadmap

**1. Planning & Setup**

- Finalize project goals and features.
- Set up project structure and development environment (including proxy server for API requests to IGDB).
- Mock up visuals for general direction of what site will look like.

**2. Front-end: Setup**

- Create basic layouts for dashboard, explore, game results, and game details.

**3. Backend: API & Database Setup**

- Set up database (MySQL, Knex).
- Build endpoints for user data and library.

**4. Front-end: Game Details**

- Create a page for viewing individual game details (title, description, platform, etc.) using IGDB data.
- Ensure users can navigate back to search or the dashboard easily.

**5. Front-end: Game Browsing**

- Add a search feature to look up games.
- Integrate IGDB API to fetch and display game data based on query.
- Display results and allow users to filter and view game details.

**6. Front-end: Dashboard**

- Create user dashboard to display user's game library.
- Add basic sorting and filtering (e.g., by platform or genre) for games in the library.

**7. Styling & Responsive Design**

- Ensure site is fully responsive for both mobile and desktop.

**8. Testing & Debugging**

- Test all functionality to ensure everything is working.
- Debug any issues with IGDB integration or data handling.
- Ensure seamless navigation across pages.

**9. Implement Additional Features**

- If time allows, add user authentication.

**10. Deployment & Final Testing**

- Conduct final testing to ensure everything works after deployment.
- Prepare presentation and submit!

---

## Future Implementations

**User Registration / Authentication:** Allow others to sign up for site.
**Notifications:** Let user's know when a new game is released from a franchise that is in their library.
**Game Recommendations:** Suggest games based on the user’s library and preferences.
