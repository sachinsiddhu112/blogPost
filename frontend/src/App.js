
import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css';
import Home from './pages/home/Home.jsx';
import Post from "./pages/post/Post.jsx";
import CreatePost from "./pages/createPost/CreatePost.jsx";
import Login from "./pages/login/Login.jsx";
import Signup from "./pages/signup/Signup.jsx";
import { AuthProvider } from "./context/authContext.js";

function App() {

  return (
    <AuthProvider>
      <div className="custom" style={{height:"100%"}}>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>

      </BrowserRouter>
      </div>
    </AuthProvider>
  );
}





export default App;
