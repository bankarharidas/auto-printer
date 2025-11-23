import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LayoutDashboard, FileText, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import axios from 'axios';

interface Stats {
    total_documents: number;
    completed_prints: number;
    failed_prints: number;
    recent_documents: any[];
}

const Admin: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post('http://localhost:8000/admin/login', formData);
            const accessToken = response.data.access_token;

            localStorage.setItem('admin_token', accessToken);
            setToken(accessToken);
            fetchStats(accessToken);
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        setToken(null);
        setStats(null);
    };

    const fetchStats = async (authToken: string) => {
        try {
            const response = await axios.get('http://localhost:8000/admin/stats', {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            setStats(response.data);
        } catch (err) {
            setError("Failed to fetch stats. Session might be expired.");
            handleLogout();
        }
    };

    useEffect(() => {
        if (token) {
            fetchStats(token);
        }
    }, [token]);

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-slate-400 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="admin"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="password"
                            />
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all">
                            Login
                        </button>
                    </form>

                    <div className="text-center">
                        <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-400 text-sm">Back to Kiosk</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex items-center gap-4">
                        <LayoutDashboard className="w-8 h-8 text-blue-500" />
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-400">Total Documents</h3>
                                <FileText className="w-6 h-6 text-blue-500" />
                            </div>
                            <p className="text-4xl font-bold">{stats.total_documents}</p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-400">Completed Prints</h3>
                                <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            <p className="text-4xl font-bold">{stats.completed_prints}</p>
                        </div>

                        <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-slate-400">Failed Prints</h3>
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-4xl font-bold">{stats.failed_prints}</p>
                        </div>
                    </div>
                )}

                {/* Recent Documents Table */}
                <div className="bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-700">
                    <div className="p-6 border-b border-slate-700">
                        <h3 className="text-xl font-bold">Recent Documents</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-700/50 text-slate-400">
                                <tr>
                                    <th className="p-4">Filename</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {stats?.recent_documents.map((doc) => (
                                    <tr key={doc._id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium">{doc.original_filename}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${doc.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    doc.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'}
                      `}>
                                                {doc.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">{doc.file_type}</td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(doc.upload_time).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;
