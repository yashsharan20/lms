
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HeroSection from './components/student/HeroSection'
import Navbar from './components/ui/Navbar'
import Login from './pages/Login'
import MainLayout from './layout/MainLayout'
import Courses from './components/student/Courses'
import MyLearning from './components/student/MyLearning'
import Profile from './components/student/Profile'
import Sidebar from './components/admin/Sidebar'
import Dashboard from './components/admin/Dashboard'
import CourseTable from './components/admin/course/CourseTable'
import AddCourse from './components/admin/course/AddCourse'
import EditCourse from './components/admin/course/EditCourse'
import CreateLecture from './components/admin/lecture/CreateLecture'
import EditLecture from './components/admin/lecture/EditLecture'
import CourseDetail from './components/student/CourseDetail'
import CourseProgress from './components/student/CourseProgress'
import SearchPage from './components/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ui/protectedRoutes'
import PurchaseCourseProtectedRoute from './components/ui/PurchaseCourseProtectedRoute'
import { ThemeProvider } from './components/ui/ThemeProvider'

 const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
     {
        path:"/",
        element:(
          <>
          <HeroSection/>
          <Courses/>
          </>
        )
     },
     {
        path:"login",
        element:<AuthenticatedUser><Login/></AuthenticatedUser>
     },
     {
        path:"my-learning",
        element:<ProtectedRoute><MyLearning/></ProtectedRoute>
     },
     {
        path:"profile",
        element:<ProtectedRoute><Profile/></ProtectedRoute>
     },
     {
        path:"course/search",
        element:<ProtectedRoute><SearchPage/></ProtectedRoute>
     },
      {
        path:"course-detail/:courseId",
        element:<ProtectedRoute><CourseDetail/></ProtectedRoute>
      },
      {
        path:"course-progress/:courseId",
        element:<ProtectedRoute><PurchaseCourseProtectedRoute><CourseProgress/></PurchaseCourseProtectedRoute></ProtectedRoute>
      },
     {
        path:"admin",
        element:<AdminRoute><Sidebar/></AdminRoute>,
        children:[
          {
            path:"dashboard",
            element:<Dashboard/>
          },
          {
            path:"course",
            element:<CourseTable/>
          },
          {
            path:"course/create",
            element:<AddCourse/>
          },
          {
            path:"course/:courseId",
            element:<EditCourse/>
          },
          {
            path:"course/:courseId/lecture",
            element:<CreateLecture/>
          },
          {
            path:"course/:courseId/lecture/:lectureId",
            element:<EditLecture/>
          }
        ]
     }
    ],
  }
]);

function App() {

  return (
    <main>
      <ThemeProvider>
      <RouterProvider router={appRouter}/>
      </ThemeProvider>
    </main>
  )
}

export default App
