# DevConnect

DevConnect is a full-stack developer social platform for sharing posts, chatting in real-time, following other developers, and discovering job opportunities. Built with React (frontend) and Express (backend), it features authentication, profile management, real-time messaging, and job listings.

## Features

- **Authentication**: Sign up, sign in, and secure session management (JWT, OAuth via Google/GitHub).
- **Profile**: View and edit user profiles, including followers and following lists.
- **Posts**: Create, view, like, and comment on posts. Image uploads supported via ImageKit.
- **Q&A Platform**: Stack Overflow-style question and answer system with voting, answers, and community engagement.
- **Chat**: Real-time messaging between users using Socket.io with emoji picker and typing indicators.
- **Notifications**: Real-time notifications for likes, comments, and messages.
- **Jobs**: Browse and apply for developer jobs.
- **Followers**: Follow/unfollow users and view followers/following.
- **AI Chatbot**: Developer chatbot powered by OpenAI.
- **Emoji Picker**: Integrated emoji support for posts and messages with custom reusable component.
- **Image Carousel**: Multi-image post support with interactive carousel navigation.
- **File Uploads**: Image uploads via ImageKit.
- **Dark/Light Theme**: Persistent theme toggle with Redux state management.
- **Responsive Design**: Mobile-first glassmorphism UI with Tailwind CSS.
- **Docker Support**: Run the app locally with Docker Compose.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit,Lucide Icons
- **Backend**: Node.js, Express, Mongoose
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Auth**: JWT, Passport (Google/GitHub OAuth)
- **Storage**: ImageKit
- **Other**: Docker, Redis, OpenAI SDK

## Folder Structure

```
DevConnect/
├── client/         # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route pages
│   │   ├── services/        # API service layer
│   │   ├── features/        # Redux slices
│   │   └── App.jsx
│   └── ...
├── server/         # Express backend
│   ├── src/
│   │   ├── models/          # Mongoose schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # Express routes
│   │   └── app.js
│   └── ...
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Docker (optional, for containerized setup)
- MongoDB instance

### Local Development

#### 1. Clone the repository
```powershell
git clone https://github.com/parthamondal20/Devconnect.git
cd Devconnect
```

#### 2. Backend Setup
```powershell
cd server
npm install
```
- Create a `.env` file in `server/` with your environment variables (see below).
- Start the backend:
```powershell
npm run dev
```

#### 3. Frontend Setup
```powershell
cd client
npm install
```
- Create a `.env` file in `client/` with your environment variables (see below).
- Start the frontend:
```powershell
npm run dev
```

#### 4. Docker Setup (Optional)
- To run both frontend and backend with Docker Compose:
```powershell
docker-compose up --build
```

## Environment Variables

### server/.env (example)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
CLIENT_URL=http://localhost:5173
```

### client/.env (example for development with Vite)
```
VITE_BACKEND_URL=http://localhost:5000
```

## API Endpoints

- `/api/auth` - Authentication (register, login, OAuth)
- `/api/user` - User profile, followers, search
- `/api/post` - Posts (create, delete, like, comment)
- `/api/questions` - Q&A (create, delete, vote, answer)
- `/api/message` - Chat messages
- `/api/job` - Job listings

Swagger docs available at `/api-docs` when backend is running.

## Available npm scripts

### Client (see `client/package.json`):
- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

### Server (see `server/package.json`):
- `npm run dev` — start server with nodemon (`src/index.js`)
- `npm start` — run the server (node)

## Environment & Security Notes

- Never commit `.env` or secrets to the repo. Use GitHub Secrets, environment variables in CI, or Docker secrets for deployment.
- Rotate keys and secrets periodically.

## Contribution

Contributions are welcome. Please follow these steps:
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

When opening PRs, include a short description, screenshots (if UI changed), and testing steps.

## Troubleshooting

- If uploads fail, verify ImageKit credentials.
- If auth fails with JWT errors, ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` match between deployments.
- If CORS issues occur, check `CLIENT_URL` and server CORS configuration.

## License
MIT

## Maintainers
- [parthamondal20](https://github.com/parthamondal20)

---
