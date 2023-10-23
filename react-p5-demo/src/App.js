// Import necessary dependencies
import React from 'react';
import { useRoutes, Outlet, useParams } from 'react-router-dom'; // Import useParams
import AudioList from './pages/AudioList';
import AudioDetail from './pages/AudioDetail';

function App() {
  const element = useRoutes([
    {
      path: '/',
      element: <AudioList />,
    },
    {
      path: 'audio/:songId',
      element: <AudioDetailView />,
    },
  ]);

  // Create a separate AudioDetailView component
function AudioDetailView() {
  // Access the filename route parameter using useParams
  const { songId } = useParams();
  console.log("Song id is",songId);

  // Pass the filename as a prop to AudioDetail component
  return <AudioDetail songId = {songId}/>
}


  return (
    <div>
      {element}
      <Outlet />
    </div>
  );
}

export default App;
