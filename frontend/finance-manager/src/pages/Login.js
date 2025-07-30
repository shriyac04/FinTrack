import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const financeQuotes = [
  "A budget is more than just numbers on a page; it's an embodiment of our values.",
  "Beware of little expenses; a small leak will sink a great ship.",
  "The quickest way to double your money is to fold it and put it back in your pocket.",
  "Do not save what is left after spending, but spend what is left after saving.",
  "The habit of managing money is more important than the amount.",
];

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [popupMessage, setPopupMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      const user = response.data.user;
      localStorage.setItem('token', response.data.token);

      // Show success popup
      setUserName(user.name);
      setPopupMessage(`Welcome, ${user.name}!`);
      setRandomQuote(financeQuotes[Math.floor(Math.random() * financeQuotes.length)]);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        setLoading(true);
        setTimeout(() => {
          navigate('/dashboard', { state: { user } });
        }, 2000);
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Invalid login. Please try again.';
      setPopupMessage(errorMessage);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex overflow-hidden">
      <div className="w-2/3 flex items-center justify-center bg-black h-screen">
        <css-doodle>
          {`
            :doodle {
              @grid: 18x18;
              @size: 100%;
            }
            --hue: calc(180 + 1.5 * @x * @y);
            background: hsl(var(--hue), 50%, 70%);
            margin: -0.5px;
            transition: @r(.5s) ease;
            clip-path: polygon(@pick(
              '0 0, 100% 0, 100% 100%',
              '0 0, 100% 0, 0 100%',
              '0 0, 100% 100%, 0 100%',
              '100% 0, 100% 100%, 0 100%'
            ));
          `}
        </css-doodle>
      </div>
      <div className="w-1/3 flex items-center justify-center h-screen">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-lg w-[90%] max-w-md space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
          <p className="text-center">
            Don't have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </span>
          </p>
          <p className="text-center mt-4">
            <span
              className="text-gray-600 cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </span>
          </p>
        </form>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-0 inset-x-0 flex justify-center mt-6 z-50">
          <div className="relative bg-black text-white px-8 py-4 rounded-lg shadow-lg animate-popup w-96 text-center">
            <h1 className="text-2xl font-bold mb-2">{popupMessage}</h1>
            <p className="text-sm italic">"{randomQuote}"</p>
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-300"></div>
        </div>
      )}

      {/* Popup Animation Styles */}
      <style>
        {`
          .animate-popup {
            animation: slideDown 0.5s ease-in-out, fadeOut 2s 1.5s forwards;
          }

          @keyframes slideDown {
            0% {
              transform: translateY(-50%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            to {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Login;
