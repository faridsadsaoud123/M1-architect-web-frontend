import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./pages/home"
import { Parcours } from "./pages/parcours"
import App from "./App"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/parcours",
        element: <Parcours />,
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
