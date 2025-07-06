import { BrowserRouter as Router, Routes, Route } from 'react-router';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Homepage from "./page/Homepage";
import { UserTable } from './page/UserTable';


export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/YFUFCJHVJVHtettrdhghi8ytit8" element={<UserTable/>} />
          <Route path="/" element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          } />
        
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;