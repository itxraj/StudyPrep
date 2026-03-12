import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';
import QuizView from './pages/QuizView';
import FlashcardView from './pages/FlashcardView';
import StudyRooms from './pages/StudyRooms';
import ActiveRoom from './pages/ActiveRoom';
import CommunityDecks from './pages/CommunityDecks';
import ProgressDashboard from './pages/ProgressDashboard';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes inside Layout */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="document/:id" element={<DocumentView />} />
                    <Route path="quiz/:id" element={<QuizView />} />
                    <Route path="flashcards/:id" element={<FlashcardView />} />
                    <Route path="rooms" element={<StudyRooms />} />
                    <Route path="rooms/:roomId" element={<ActiveRoom />} />
                    <Route path="community" element={<CommunityDecks />} />
                    <Route path="progress" element={<ProgressDashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
