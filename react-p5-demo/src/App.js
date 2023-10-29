// Import necessary dependencies
import React from 'react';
import { useRoutes, Outlet, useParams, Link } from 'react-router-dom'; // Import useParams
import AudioList from './pages/AudioList';
import AudioDetail from './pages/AudioDetail';
import InputMelody from './pages/InputMelody';
import './App.css';
import RingSketch from './components/animations/Rings';
import FrequencyGraph from './components/charts';

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
    {
      path: '/test',
      element: <FrequencyGraph/>
    }
  ]);

  // Create a separate AudioDetailView component
  function AudioDetailView() {
    // Access the filename route parameter using useParams
    const { songId } = useParams();
    console.log("Song id is", songId);

    // Pass the filename as a prop to AudioDetail component
    return <AudioDetail songId={songId} />;
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

        <Link to="/" className="navbar-link">
          <h1 className="navbar-header">V A V S A </h1>
        </Link>
          {/* You can add navigation links here if needed */}
        </nav>
        
        {/* Render the element based on the route */}
        {element}
        
        {/* Render the nested routes */}
        <Outlet />
      </div>
    )
}

export default App;
