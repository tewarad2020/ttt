import { Route, Routes } from "react-router-dom";
import NoPage from "./pages/JobSeeker/NoPage";
import SignUpJobSeek from "./pages/JobSeeker/SignUpJobSeek";
import SignUpEmp from "./pages/Employers/SignUpEmp";
import SignIn from "./pages/JobSeeker/SignIn";
import ContactUs from "./pages/JobSeeker/ContactUs";
import Profile from "./pages/JobSeeker/Profile";
import Settings from "./pages/JobSeeker/Settings";
import Home from "./pages/JobSeeker/Home";
import Find from "./pages/JobSeeker/Find";
import ApplicationForm from "./pages/JobSeeker/Application";
import HomepageEmployers from "./pages/Employers/HomepageEmployers";
import PostJobEmp from "./pages/Employers/PostEmployers";
import TrackEmployers from "./pages/Employers/TrackEmployers";
import TrackDetailsEmployers from "./pages/Employers/TrackDetailsEmployers";
import FindEmployers from "./pages/Employers/FindEmployers";
import ViewPostEmployers from "./pages/Employers/ViewPostEmployers";
import ProfileEmployers from "./pages/Employers/ProfileEmployers";
import JobPositionForm from "./pages/JobSeeker/JobPositionForm";
import TrackJobSeeker from "./pages/JobSeeker/TrackJobSeeker";
import TrackDetailsJobSeeker from "./pages/JobSeeker/TrackDetailsJobSeeker";
import PostJob from "./pages/JobSeeker/Post";
import JobDetail from "./pages/JobSeeker/JobDetail";
import JobDetailEmp from "./pages/Employers/๋JobDetailsEmp";
import UserTypeWizard from "./pages/UserTypeWizard";
import Admin from "./pages/Admin";
import ExampleComponent from "./components/ExampleComponent";
import Terms from "./pages/Term";
import ForgotPassword from "./pages/ForgotPassword";
import ViewPostJobseeker from "./pages/JobSeeker/ViewPostJobseeker";
import { useUser } from "./context/UserContext";
import { Navigate, Outlet } from "react-router-dom";
import AccessDenied from "./pages/AccessDenied";
import Mission from "./pages/Mission";

const ProtectedRoute = ({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const userType = user?.type || "GUEST"; // ถ้า user.type เป็น null ให้ role เป็น GUEST

  if (!allowedRoles.includes(userType)) {
    return <AccessDenied />;
  }
  return children;
};

function App() {
  return (
    <div>
      <Routes>
        {/* หน้าหลัก */}
        {/* perrmission Guest: yes ,Jobseeker: yes ,employer: yes ,company: yes */}
        <Route path="/" element={<Home />} />
        <Route path="find" element={<Find />} />

        <Route
          path="signUp/job-seeker"
          element={
            <ProtectedRoute allowedRoles={["GUEST"]}>
              <SignUpJobSeek />
            </ProtectedRoute>
          }
        />

        <Route
          path="signin"
          element={
            <ProtectedRoute allowedRoles={["GUEST"]}>
              <>
                <SignIn />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER", "EMPLOYER", "COMPANY"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* <Route path="settings" element={<Settings />} /> */}
        <Route path="contactus" element={<ContactUs />} />
        <Route
          path="application"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
              <ApplicationForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="application/JobPosition"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
              <JobPositionForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trackjobseeker"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
              <TrackJobSeeker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trackJobseeker/:id"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
              <TrackDetailsJobSeeker />
            </ProtectedRoute>
          }
        />
        <Route
          path="/postjob"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route path="/jobseeker/details/:id" element={<JobDetail />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/jobseeker/viewpost/:id"
          element={
            <ProtectedRoute allowedRoles={["JOBSEEKER"]}>
              <ViewPostJobseeker />
            </ProtectedRoute>
          }
        />

        {/* Routes สำหรับ Employers */}
        <Route
          path="signUp/Employer"
          element={
            <ProtectedRoute allowedRoles={["GUEST"]}>
              <SignUpEmp />
            </ProtectedRoute>
          }
        />
        <Route path="homeemp" element={<HomepageEmployers />} />
        <Route
          path="postjobemp"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER", "COMPANY"]}>
              <PostJobEmp />
            </ProtectedRoute>
          }
        />
        <Route
          path="trackemp"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER", "COMPANY"]}>
              <TrackEmployers />
            </ProtectedRoute>
          }
        />
        <Route
          path="track/:id"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER", "COMPANY"]}>
              <TrackDetailsEmployers />
            </ProtectedRoute>
          }
        />
        <Route
          path="findemp"
          element={
            <ProtectedRoute
              allowedRoles={["GUEST", "JOBSEEKER", "EMPLOYER", "COMPANY"]}
            >
              <FindEmployers />
            </ProtectedRoute>
          }
        />
        <Route
          path="profileemp"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER", "COMPANY"]}>
              <ProfileEmployers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/viewpost/:id"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER", "COMPANY"]}>
              <ViewPostEmployers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/details/:id"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYER", "COMPANY"]}>
              <JobDetailEmp />
            </ProtectedRoute>
          }
        />

        {/* หน้าสำหรับ Route ที่ไม่พบ */}
        {/* Routes สำหรับ Admin */}
        <Route path="/example" element={<ExampleComponent />} />
        <Route
          path="/select-user-type"
          element={
            <ProtectedRoute allowedRoles={["GUEST"]}>
              <UserTypeWizard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            // <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Admin />
            // </ProtectedRoute>
          }
        />
        <Route path="*" element={<NoPage />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/mission" element={<Mission />} />
      </Routes>
    </div>
  );
}

export default App;
