import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, CheckCircle, AlertTriangle, Loader, FileText } from 'lucide-react';
import axios from 'axios';

interface DocumentStatus {
    _id: string;
    filename: string;
    status: 'uploaded' | 'downloading' | 'queued' | 'printing' | 'completed' | 'failed';
    print_options: {
        copies: number;
        color_mode: string;
    };
}

const Status: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<DocumentStatus | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/status/${id}`);
                setStatus(response.data);
            } catch (err) {
                setError("Failed to load document status.");
            }
        };
        fetchStatus();
    }, [id]);

    // WebSocket Connection
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/status');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.document_id === id) {
                setStatus((prev) => prev ? { ...prev, status: data.status } : null);
            }
        };

        return () => {
            ws.close();
        };
    }, [id]);

    // Trigger Print (Simulated auto-trigger or manual)
    const handlePrint = async () => {
        try {
            await axios.post('http://localhost:8000/print', { document_id: id });
        } catch (err) {
            setError("Failed to start printing.");
        }
    };

    // Auto-trigger print if uploaded (as per requirements "Device triggers print command automatically")
    // But let's give user a moment to review or press a button for better UX?
    // Requirement says "Device triggers print command automatically".
    // Let's simulate that with a useEffect if status is 'uploaded'.
    useEffect(() => {
        if (status?.status === 'uploaded') {
            // Small delay for UX
            const timer = setTimeout(() => {
                handlePrint();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [status?.status]);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl flex items-center gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="underline">Go Home</button>
                </div>
            </div>
        );
    }

    if (!status) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <Loader className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }

    const getStatusIcon = () => {
        switch (status.status) {
            case 'completed': return <CheckCircle className="w-24 h-24 text-green-500" />;
            case 'failed': return <AlertTriangle className="w-24 h-24 text-red-500" />;
            default: return <Printer className="w-24 h-24 text-blue-500 animate-pulse" />;
        }
    };

    const getStatusMessage = () => {
        switch (status.status) {
            case 'uploaded': return "Document Uploaded. Preparing...";
            case 'queued': return "Queued for Printing...";
            case 'printing': return "Printing in Progress...";
            case 'completed': return "Print Completed! Please collect your document.";
            case 'failed': return "Printing Failed. Please contact support.";
            default: return "Processing...";
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl text-center space-y-8 animate-fade-in">

                <div className="flex justify-center">
                    {getStatusIcon()}
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl font-bold">{getStatusMessage()}</h2>
                    <p className="text-slate-400 flex items-center justify-center gap-2">
                        <FileText className="w-4 h-4" />
                        {status.filename}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${status.status === 'completed' ? 'bg-green-500 w-full' :
                                status.status === 'failed' ? 'bg-red-500 w-full' :
                                    'bg-blue-500 w-1/2 animate-pulse' // Indeterminate for now
                            }`}
                    />
                </div>

                {status.status === 'completed' && (
                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                        Print Another Document
                    </button>
                )}

                {status.status === 'failed' && (
                    <button
                        onClick={() => navigate('/upload')}
                        className="w-full py-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-lg shadow-lg transition-all"
                    >
                        Try Again
                    </button>
                )}

            </div>
        </div>
    );
};

export default Status;
