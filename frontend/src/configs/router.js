import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import { Login } from "../pages/auth/login";
import { Registration } from "../pages/auth/registration";
import { AuthLayout } from "../pages/auth/auth-layout";
import { Tasks } from "../pages/tasks";

const ROUTER = createBrowserRouter([
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
        path: 'tasks',
        Component: Tasks,
      },
      // {
      //   path: 'settings',
      //   Component: Settings,
      // }
    ]
  }
])

export default ROUTER;
