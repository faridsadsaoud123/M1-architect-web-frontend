import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./pages/home"
import { ParcoursPage } from "./pages/parcours"
import { UesPage } from "./pages/ues"
import { EtudiantPage } from "./pages/Etudiant"
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
        element: <ParcoursPage />,
      },
      {
        path: "/ues",
        element: <UesPage />,
      },
      {
        path: "/etudiants",
        element: <EtudiantPage />,
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
