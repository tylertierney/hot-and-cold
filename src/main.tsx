import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dropdown, { type Option } from './components/Dropdown/Dropdown.tsx'
// import Home from './components/Home/Home.tsx'
// import GamePage from './components/GamePage/GamePage.tsx'
// import gamesArr from '../games.json'
// import type { Game } from './models/models.tsx'
// import ErrorPage from './components/ErrorPage/ErrorPage.tsx'

const options: Option[] = [
  {
    label: 'Hint',
  },
  {
    label: 'Give up',
  },
  {
    label: 'How to play a game with your friends',
  },
]

const router = createBrowserRouter([
  {
    path: 'scratch',
    element: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100vh',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropdown options={options}>trigger</Dropdown>
          <Dropdown options={options}>trigger</Dropdown>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Dropdown options={options}>trigger</Dropdown>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Dropdown options={options}>trigger</Dropdown>
          <Dropdown options={options}>trigger</Dropdown>
        </div>
      </div>
    ),
  },
  {
    path: '/',
    element: <App />,
    errorElement: <p>something went wrong</p>,
    children: [
      // { index: true, element: <Home /> },
      // {
      //   path: 'home',
      //   element: <Home />,
      // },
      // {
      //   path: 'games/:gameIndex',
      //   element: <GamePage />,
      //   loader: ({ params }) => {
      //     const games = gamesArr as unknown as Game[]
      //     const asNumber = parseInt(params.gameIndex ?? '0', 10)
      //     const found = games.find(({ index }) => index === asNumber) ?? null
      //     return found
      //   },
      // },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
)
