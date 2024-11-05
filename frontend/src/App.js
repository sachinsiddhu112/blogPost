
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import './App.css';
import Home from './pages/home/Home.jsx';
import Post from "./pages/post/Post.jsx";
import CreatePost from "./pages/createPost/CreatePost.jsx";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import { AuthProvider } from "./context/authContext.js";
import Posts from "./pages/posts/Posts.jsx";
import Category from "./pages/category/Category.jsx";
import Contact from "./pages/contact/Contact.jsx";
import Alert from "./components/alert/Alert.jsx";
import AuthorProfile from "./pages/authorProfile/AuthorProfile.jsx"

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const queryClient = new QueryClient();
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
    <AuthProvider>
      
        <div className="custom" style={{ height: "100%" }}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient} >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blogs" element={<Posts />} />
                <Route path="/blogs/:category" element={<Category />} />
                <Route path="/post/:id" element={<Post />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/user-posts" element={<AuthorProfile />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path='/updatePost/:id' element={<CreatePost />} />
                <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/alert" element={<Alert />} />
            </Routes>
          </QueryClientProvider>
        </BrowserRouter>
      </div>
   
    </AuthProvider >
     </GoogleOAuthProvider>
  );
}





export default App;
