import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { useDispatch } from "react-redux";
import { setValue } from "./redux/userSlice";
import { useEffect, useCallback } from "react";
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
    ],
  },
  { path: "/login", element: <LoginPage /> },
]);

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  // ✅ Gunakan useCallback supaya tidak buat fungsi baru tiap render
  const keepLogin = useCallback(async () => {
    try {
      const data = await keepLoginRequest();
      const { fullname, username, email, jabatan } = data;
      dispatch(setValue({ fullname, username, email, jabatan }));
    } catch (err) {
      console.log("Token invalid atau expired:", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      keepLogin();
    } else {
      console.log("Sign in first");
    }
  }, [keepLogin, token]);

  return <RouterProvider router={router} />;
}

export default App;
