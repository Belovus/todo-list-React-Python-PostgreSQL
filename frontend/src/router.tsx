import { createBrowserRouter } from "react-router";
import App from "./App";
import { Login } from "./pages/auth/login";
import { Registration } from "./pages/auth/registration";

const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: 'auth',
        Component: AuthLayout,
        children: [
          { path: 'login', Component: Login },
          { path: 'registration', Component: Registration }
        ]
      },
      {
        path: 'settings',
        Component: Settings,
      }
    ]
  }
])

export default router;
