// Import necessary dependencies
import React from 'react';
import { useRoutes, Outlet, useParams } from 'react-router-dom'; // Import useParams
import AudioList from './pages/AudioList';
import AudioDetail from './pages/AudioDetail';
import InputMelody from './pages/InputMelody';
import './App.css';
import RingSketch from './components/Rings';
import BallSketch from './components/Balls';
import WaterSketch from './components/WaterSketch';

function App() {
  const element = useRoutes([
    {
      path: '/',
      element: <AudioList />,
    },
    {
      path: '/input',
      element: <InputMelody />,
    },
    {
      path: 'audiodetail/:songId',
      element: <AudioDetailView />,
    },
    {
      path: 'audio/:songId',
      element: <AnimateView />,
    },
  ]);

  // Create a separate AudioDetailView component
  function AudioDetailView() {
    // Access the filename route parameter using useParams
    const { songId } = useParams();
    console.log("Song id is", songId);

    // Pass the filename as a prop to AudioDetail component
    return <AudioDetail songId={songId} />;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

    // Create a separate AudioDetailView component
  function AnimateView() {
      // Access the filename route parameter using useParams
      const { songId } = useParams();
      console.log("Song id is", songId);
      return <RingSketch songId={songId}/>
      // Pass the filename as a prop to AudioDetail component
    }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="navbar-header">VAVSA</h1>
      </nav>
        {element}
        <Outlet />
    </div>
  );
}

export default App;
