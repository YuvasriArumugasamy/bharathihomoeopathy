import { useState } from 'react';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';

const LoginModalExample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { googleLogin } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    // Google Login Success
    
    const result = await googleLogin(credentialResponse.credential);
    
    if (result.success) {
      // User logged in successfully
      setIsModalOpen(false);
      // Redirect or show success message
    } else {
      console.error('Login failed:', result.message);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Open Login Modal
      </button>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGoogleSuccess={handleGoogleSuccess}
      />
    </div>
  );
};

export default LoginModalExample;
