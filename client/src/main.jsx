import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';

import Layout from './Layout.jsx';
import Home from "./pages/Home";
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import GitHubSuccess from './pages/GitHubSuccess.jsx';
import Loader from './components/Loader.jsx'
import store from './app/store.js'
const Feed = lazy(() => import("./pages/Feed.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const OTPpage = lazy(() => import("./components/Otppage.jsx"));
const QuestionsPage = lazy(() => import("./pages/QuestionPage.jsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage.jsx"));
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<Layout />}>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/github-success' element={<GitHubSuccess />} />
      <Route path='/feed' element={<Feed />} />
      <Route path='/profile/:user_id' element={<Profile />} />
      <Route path='/projects/:githubId' element={<ProjectPage />} />
      <Route path='/verify-otp' element={<OTPpage />} />
      <Route path='/questions' element={<QuestionsPage />} />
    </Route>
  )
)
createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Provider store={store}>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  </StrictMode>,
)
