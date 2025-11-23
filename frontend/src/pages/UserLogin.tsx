import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowLeft, LogIn } from 'lucide-react';
import axios from 'axios';

const UserLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await axios.post('http://localhost:8000/user/login', formData);
            const accessToken = response.data.access_token;
            const userData = response.data.user;

            // Store user session
            localStorage.setItem('user_token', accessToken);
            localStorage.setItem('user_data', JSON.stringify(userData));

            // Navigate to upload page
            navigate('/upload');
        } catch (err: any) {
            setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post('http://localhost:8000/user/register', {
                name: name,
                email: email,
                password: password
            });

            setSuccess("Registration successful! You can now login.");
            setIsRegistering(false);
            setName('');
            setPassword('');
        } catch (err: any) {
            setError(err.response?.data?.detail || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                </button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                        {isRegistering ? 'Create Account' : 'User Login'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isRegistering ? 'Register to track your prints' : 'Access your print history'}
                    </p>
                </div>

                {/* Login/Register Form */}
                <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
                    {isRegistering && (
                        <div>
                            <label className="block text-slate-400 mb-1 text-sm">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="user@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 mb-1 text-sm">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3">
                            <p className="text-green-400 text-sm">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        {isRegistering ? 'Create Account' : 'Login'}
                    </button>
                </form>

                {/* Toggle Login/Register */}
                <div className="text-center pt-4 border-t border-slate-700">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError(null);
                            setSuccess(null);
                        }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                        {isRegistering
                            ? 'Already have an account? Login'
                            : "Don't have an account? Register"}
                    </button>
                </div>

                {/* Guest Mode */}
                <div className="text-center">
                    <button
                        onClick={() => navigate('/upload')}
                        className="text-slate-500 hover:text-slate-400 text-sm"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
