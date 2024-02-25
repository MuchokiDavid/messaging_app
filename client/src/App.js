import './App.css';
import Home from './components/Home';
import { Route, Routes} from "react-router-dom";
import Messageview from './components/Messageview';

function App() {
  return (
    <div className="App container mx-auto">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/conversations/:id" element={<Messageview />} />
        {/* <Route path="/live" element={<Live />} />
        <Route path="/contact" element={<Contact />} /> */}
      </Routes>
    </div>
  );
}

export default App;
