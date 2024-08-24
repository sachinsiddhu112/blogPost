# Blog Application

A full-stack blog application where users can explore, create, and manage blog posts.

## Features

### Backend:
- **Express.js** and **MongoDB** used.
- User sign up and login with JWT-based authentication.
- Middleware to authorize users to perform update and delete operations on their own posts only.
- Data models created for Post and User.
- API endpoints written for:
  - All posts
  - Single post
  - Post update
  - Post delete

### Frontend:
- **React.js** used to develop the following pages:
  - Login
  - Signup
  - Home
  - Post (for showing specific post)
  - CreatePost
- Components created:
  - Header
  - Posts (for showing all posts on the Home page)
  - Footer
- Context API used for state management of the user.
- Responsive UI for all devices (mobiles, tablets, and desktops).
- **Axios** used for connecting frontend and backend.

## Installation

1. Clone this repository.
2. Execute the following command in both the `backend` and `frontend` directories individually:
   (window environment)
   ```bash
   npm init

3.Create a .env file in the backend directory and provide the following variables:
MONGO_URI
JWT_SECRET
PORT

4.Usage
If you just want to explore the latest blogs on the latest topics, you don't need to log in or sign up.
To encourage bloggers with likes and comments or to create your own blog, you need to log in or sign up.
You can create a blog with documents, images, videos, and articles.
You can update or delete your blog.
Your blog is safe—nobody else can edit or delete it.

5.Deployment
Backend deployed on Render.com.
Frontend deployed on Vercel.
You can deploy on any platform as per your convenience.

6.Contact Information
Email: sachinsiddhu112@gmail.com