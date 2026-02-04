import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';
import { NotificationProvider } from './context/NotificationContext';

import Layout from './Layout.jsx';
import Home from "./pages/Home";
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import GitHubSuccess from './pages/GitHubSuccess.jsx';
import Loader from './components/Loader.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import store from './app/store.js'
const Feed = lazy(() => import("./pages/Feed.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const OTPpage = lazy(() => import("./components/Otppage.jsx"));
const QuestionsPage = lazy(() => import("./pages/QuestionPage.jsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage.jsx"));
const Jobs = lazy(() => import("./pages/Jobs.jsx"));
const Community = lazy(() => import("./pages/Community.jsx"));
const CommunityChatPage = lazy(() => import("./pages/CommunityChatPage.jsx"));
const ChatPage = lazy(() => import("./pages/ChatPage.jsx"));
const MessagePage = lazy(() => import("./pages/MessagePage.jsx"));
const NotificationPage = lazy(() => import("./pages/Notifications.jsx"));
const PostPage = lazy(() => import("./pages/PostPage.jsx"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<Layout />}>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/github-success' element={<GitHubSuccess />} />
      <Route path='/verify-otp' element={<OTPpage />} />

      {/* Protected Routes */}
      <Route path='/feed' element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path='/community' element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path='/profile/:user_id' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path='/community/:community_id' element={<ProtectedRoute><CommunityChatPage /></ProtectedRoute>} />
      <Route path='/jobs' element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path='/chat/:conversation_id' element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path='/projects/:githubId' element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
      <Route path='/questions' element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
      <Route path='/messages' element={<ProtectedRoute><MessagePage /></ProtectedRoute>} />
      <Route path='/notifications' element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
      <Route path='post/:post_id' element={<ProtectedRoute><PostPage /></ProtectedRoute>} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>
      <NotificationProvider>
        <Suspense fallback={<Loader message='render going to take some time to start server...' />}>
          <RouterProvider router={router} />
        </Suspense>
      </NotificationProvider>
    </Provider>
  </StrictMode>,
)
