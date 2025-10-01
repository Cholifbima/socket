const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data storage files
const USERS_FILE = 'users.json';
const MESSAGES_FILE = 'messages.json';

// In-memory storage for online users
const onlineUsers = new Map();

// Helper functions for file operations
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeJsonFile(filename, data) {
  await fs.writeFile(filename, JSON.stringify(data, null, 2));
}

// Initialize data files if they don't exist
async function initializeDataFiles() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    await writeJsonFile(USERS_FILE, []);
  }
  
  try {
    await fs.access(MESSAGES_FILE);
  } catch {
    await writeJsonFile(MESSAGES_FILE, []);
  }
}

// API Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const users = await readJsonFile(USERS_FILE);
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      email,
      firstName,
      lastName,
      password: hashedPassword,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      joinedAt: moment().toISOString(),
      lastSeen: moment().toISOString(),
      isOnline: false
    };

    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);

    // Return user without password
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({ user: userResponse });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.username === username || u.email === username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last seen
    user.lastSeen = moment().toISOString();
    await writeJsonFile(USERS_FILE, users);

    // Return user without password
    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await readJsonFile(USERS_FILE);
    const usersWithoutPasswords = users.map(({ password, ...user }) => ({
      ...user,
      isOnline: onlineUsers.has(user.id)
    }));
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await readJsonFile(MESSAGES_FILE);
    
    // Get messages for specific user conversation
    const userMessages = messages.filter(msg => 
      (msg.senderId === userId || msg.receiverId === userId)
    );
    
    res.json(userMessages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user_online', async (userId) => {
    try {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      
      // Update user online status in database
      const users = await readJsonFile(USERS_FILE);
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].isOnline = true;
        users[userIndex].lastSeen = moment().toISOString();
        await writeJsonFile(USERS_FILE, users);
      }
      
      // Broadcast to all clients that user is online
      socket.broadcast.emit('user_status_change', { userId, isOnline: true });
      
      console.log(`User ${userId} is now online`);
    } catch (error) {
      console.error('User online error:', error);
    }
  });

  socket.on('send_message', async (messageData) => {
    try {
      const { senderId, receiverId, message, senderName, type, file } = messageData;
      
      const newMessage = {
        id: uuidv4(),
        senderId,
        receiverId,
        message: message || '',
        senderName,
        type: type || 'text',
        timestamp: moment().toISOString(),
        isRead: false
      };
      
      // Add file data if it's a file message
      if (type === 'file' && file) {
        newMessage.file = file;
      }

      // Save message to file
      const messages = await readJsonFile(MESSAGES_FILE);
      messages.push(newMessage);
      await writeJsonFile(MESSAGES_FILE, messages);

      // Send to receiver if online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }

      // Send back to sender for confirmation
      socket.emit('message_sent', newMessage);
      
      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error('Send message error:', error);
    }
  });

  socket.on('typing', (data) => {
    const { receiverId, senderName, isTyping } = data;
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { senderName, isTyping });
    }
  });

  socket.on('disconnect', async () => {
    try {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        
        // Update user offline status in database
        const users = await readJsonFile(USERS_FILE);
        const userIndex = users.findIndex(u => u.id === socket.userId);
        if (userIndex !== -1) {
          users[userIndex].isOnline = false;
          users[userIndex].lastSeen = moment().toISOString();
          await writeJsonFile(USERS_FILE, users);
        }
        
        // Broadcast to all clients that user is offline
        socket.broadcast.emit('user_status_change', { 
          userId: socket.userId, 
          isOnline: false 
        });
        
        console.log(`User ${socket.userId} is now offline`);
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
async function startServer() {
  await initializeDataFiles();
  server.listen(PORT, () => {
    console.log(`🚀 Telegram Clone Server running on port ${PORT}`);
    console.log(`📱 Open http://localhost:${PORT} to access the app`);
  });
}

startServer().catch(console.error);
