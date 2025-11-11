import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { useDispatch } from "react-redux";
import { setValue } from "./redux/userSlice";
import { useEffect } from "react";
import { LoginPage } from "./pages/login";
import { Navbar } from "./components/navbar";
import { keepLoginRequest } from "./api/listEndpoint";
import NotFoundPage from "./pages/notfoundpage";

const router = createBrowserRouter([
  { 
    path: "/", 
    element: <Navbar />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> }, 
    ]
  },
  { path: "/login", element: <LoginPage /> },
]);

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const keepLogin = async () => {
    try {
      const data = await keepLoginRequest();
      const { fullname, username, email, jabatan } = data;
      dispatch(setValue({ fullname, username, email, jabatan }));
    } catch (err) {
      console.log(err);
      console.log("Token invalid atau expired:", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    token ? keepLogin() : console.log("Sign in first");
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
