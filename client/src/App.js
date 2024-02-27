import './App.css';
import { Route, Routes, Navigate} from "react-router-dom";
import Messageview from './components/Messageview';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home'

function App() {
  return (
    <div className="App container mx-auto">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}/>
        <Route path="/conversations/:id" element={<Messageview />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
