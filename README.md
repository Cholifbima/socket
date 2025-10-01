# Telegram Clone - Real-time Chat Application

A real-time chat application built with Node.js, Socket.IO, and Express, featuring a Telegram-like interface.

## Features

- 🔐 **User Authentication** - Register and login system with JSON storage
- 💬 **Real-time Messaging** - Instant messaging using Socket.IO
- 👥 **User List** - See all registered users
- 🟢 **Online Status** - Real-time online/offline indicators
- ⌨️ **Typing Indicators** - See when someone is typing
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Telegram-like UI** - Modern and clean interface

## Technology Stack

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: JSON files (for simplicity)
- **Deployment**: AWS App Runner ready

## Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd telegram-clone-chat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Production

To run in production mode:
```bash
npm start
```

## Usage

1. **Register**: Create a new account with your details
2. **Login**: Sign in with your username/email and password
3. **Chat**: Select a user from the sidebar to start chatting
4. **Real-time**: Messages appear instantly for both users

## Project Structure

```
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── public/                # Frontend files
│   ├── index.html        # Main HTML file
│   ├── styles.css        # CSS styles
│   └── script.js         # Frontend JavaScript
├── users.json            # User data storage (auto-generated)
├── messages.json         # Messages storage (auto-generated)
├── Dockerfile            # Docker configuration
├── apprunner.yaml        # AWS App Runner configuration
└── README.md             # This file
```

## API Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `GET /api/users` - Get all users
- `GET /api/messages/:userId` - Get messages for specific user

## Socket Events

### Client to Server
- `user_online` - User comes online
- `send_message` - Send a message
- `typing` - Typing indicator

### Server to Client
- `receive_message` - Receive a message
- `message_sent` - Message sent confirmation
- `user_typing` - Someone is typing
- `user_status_change` - User online/offline status change

## Deployment to AWS App Runner

### Method 1: GitHub Integration

1. Push your code to GitHub
2. Go to AWS App Runner console
3. Create new service
4. Connect to your GitHub repository
5. AWS App Runner will automatically detect the `apprunner.yaml` configuration
6. Deploy!

### Method 2: Docker Hub

1. Build and push Docker image:
```bash
docker build -t your-username/telegram-clone .
docker push your-username/telegram-clone
```

2. Create App Runner service with Docker image source

### Environment Variables

The application uses these environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Features in Detail

### Authentication System
- Secure password hashing with bcryptjs
- Session management with localStorage
- Input validation and error handling

### Real-time Communication
- WebSocket connection with Socket.IO
- Automatic reconnection handling
- Message delivery confirmation

### User Interface
- Telegram-inspired design
- Dark theme
- Responsive layout
- Smooth animations and transitions

### Data Storage
- JSON file-based storage for simplicity
- Automatic file creation and management
- User data and message persistence

## Development

### Adding New Features

1. **Server-side**: Add routes in `server.js`
2. **Client-side**: Update `public/script.js`
3. **Styling**: Modify `public/styles.css`

### Testing Locally

1. Open multiple browser tabs/windows
2. Register different users
3. Test real-time messaging between users

## Security Notes

⚠️ **Important**: This is a demonstration project. For production use, consider:

- Database instead of JSON files
- JWT tokens for authentication
- Input sanitization and validation
- Rate limiting
- HTTPS enforcement
- Environment-based configuration

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the PORT in package.json or environment
2. **Socket connection failed**: Check firewall settings
3. **Messages not sending**: Verify Socket.IO connection

### Logs

Check console logs in both browser and server for debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Demo

Once deployed to AWS App Runner, you can access your chat application at the provided URL.

### Sample Users for Testing

After deployment, register multiple users to test the chat functionality:

1. User 1: John Doe (john@example.com)
2. User 2: Jane Smith (jane@example.com)
3. Test real-time messaging between them

---

**Happy Chatting! 💬**
