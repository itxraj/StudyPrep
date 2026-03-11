import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DocumentView from './pages/DocumentView';
import QuizView from './pages/QuizView';
import FlashcardView from './pages/FlashcardView';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes inside Layout */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="document/:id" element={<DocumentView />} />
                    <Route path="quiz/:id" element={<QuizView />} />
                    <Route path="flashcards/:id" element={<FlashcardView />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
