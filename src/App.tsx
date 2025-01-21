import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaymentPage } from './components/PaymentPage';
import { PaymentForm } from './components/PaymentForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentForm />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
