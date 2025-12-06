import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import './videoChallengeSquat.css'; // <--- IMPORT THE CSS HERE

// --- CONFIGURATION ---
const CHALLENGE_DURATION_SECONDS = 30; 
const ORACLE_API_URL = "http://localhost:8001/verify_proof/"; 

const videoConstraints = {
    width: 480,
    height: 720,
    facingMode: "user"
};

export default function VideoChallenge() {
    // --- State Variables ---
    const [walletAddress, setWalletAddress] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [countdown, setCountdown] = useState(CHALLENGE_DURATION_SECONDS);
    const [statusMessage, setStatusMessage] = useState('Enter wallet and click START.');
    
    // --- Refs ---
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);

    const handleStopCaptureClick = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setCountdown(0);
            setStatusMessage('Recording stopped. Ready to upload.');
        }
    }, [setIsRecording, setCountdown, setStatusMessage]);
    
    // --- Timer Logic ---
    useEffect(() => {
        let timer;
        if (isRecording && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);
        } else if (isRecording && countdown === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleStopCaptureClick();
        }
        return () => clearInterval(timer);
    }, [isRecording, countdown, handleStopCaptureClick]); 

    // --- Media Recorder Callbacks ---
    const handleDataAvailable = useCallback(({ data }) => {
        if (data.size > 0) {
            setRecordedChunks((prev) => prev.concat(data));
        }
    }, [setRecordedChunks]);

    const handleStartCaptureClick = useCallback(() => {
        if (!walletAddress) {
            setStatusMessage("🛑 Please enter your wallet address first.");
            return;
        }

        setRecordedChunks([]);
        setCountdown(CHALLENGE_DURATION_SECONDS);
        setIsRecording(true);
        setStatusMessage('Recording...');

        try {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            
            mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
            mediaRecorderRef.current.start(1000); 
        } catch (error) {
            console.error("Failed to start MediaRecorder:", error);
            setStatusMessage("🔴 Recording failed. Check console for details.");
            setIsRecording(false);
        }

    }, [webcamRef, setIsRecording, setCountdown, setStatusMessage, handleDataAvailable, walletAddress]);

    // --- Upload Logic ---
    const handleUpload = useCallback(async () => {
        if (recordedChunks.length === 0) {
            setStatusMessage("⚠️ No video recorded to upload.");
            return;
        }

        setStatusMessage("⬆️ Uploading to Oracle...");
        
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        const videoFile = new File([blob], "proof.webm", { type: "video/webm" });

        const formData = new FormData();
        formData.append("file", videoFile);
        formData.append("user_wallet", walletAddress);
        
        try {
            const response = await fetch(`${ORACLE_API_URL}?user_wallet=${walletAddress}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setStatusMessage(`✅ SUCCESS! Goal: ${result.goal_met ? 'MET' : 'FAILED'}. Tx: ${result.transaction_hash.substring(0, 10)}...`);
            } else {
                const errorData = await response.json();
                setStatusMessage(`❌ Upload Failed: ${errorData.detail || response.statusText}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setStatusMessage(`❌ Network Error: Could not reach Oracle backend.`);
        }
        
        setRecordedChunks([]); 

    }, [recordedChunks, walletAddress, setStatusMessage]);

    // --- Rendering ---
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const isIdle = !isRecording && recordedChunks.length === 0;

    return (
        <>
            {/* NEW HEADER STRUCTURE
            <header className="dash-header">
                <div className="brand">
                    {/* Placeholder image for logo - replace src with your actual logo import */}
                    {/* <img src="../logo.png" alt="Logo" className="brand-logo" />
                    <div className="brand-info">
                        <h1 className="brand-title">Fit-In-Healix</h1>
                        <p className="brand-subtitle">Terminal v1.0</p>
                    </div>
                </div>
            </header> */} 

            <div style={styles.container}>
                <h2 style={{color: '#fff'}}>StakeFit Challenge Proof Push-Up</h2>
                <p style={styles.status}>{statusMessage}</p>
                
                <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Enter your ETH Wallet Address"
                    style={styles.input}
                    disabled={isRecording}
                />
                
                <div style={styles.videoWrapper}>
                    {isIdle && <div style={styles.overlayText}>Camera Preview</div>}
                    
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        videoConstraints={videoConstraints}
                        mirrored={true}
                        style={styles.webcam}
                    />
                    
                    {isRecording && (
                        <div style={styles.timerOverlay}>
                            Recording: {formatTime(countdown)}
                        </div>
                    )}
                </div>
                
                <div style={styles.controls}>
                    <button 
                        onClick={isRecording ? handleStopCaptureClick : handleStartCaptureClick}
                        disabled={!walletAddress}
                        style={isRecording ? styles.stopButton : styles.startButton}
                    >
                        {isRecording ? `STOP (${formatTime(countdown)})` : 'START CHALLENGE'}
                    </button>

                    {!isRecording && recordedChunks.length > 0 && (
                        <button 
                            onClick={handleUpload}
                            style={styles.uploadButton}
                        >
                            UPLOAD PROOF
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

// I updated the container styles slightly to look better with the dark header
const styles = {
    container: {
        maxWidth: '500px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #333', // Darker border
        backgroundColor: '#1e1e1e', // Dark card background
        borderRadius: '16px',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    },
    input: {
        width: 'calc(100% - 20px)',
        padding: '12px',
        margin: '10px 0 20px 0',
        borderRadius: '8px',
        border: '1px solid #444',
        backgroundColor: '#2c2c2c',
        color: '#fff',
        outline: 'none'
    },
    videoWrapper: {
        position: 'relative',
        marginBottom: '20px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid #333',
        backgroundColor: '#000'
    },
    webcam: {
        width: '100%',
        height: 'auto',
        display: 'block'
    },
    timerOverlay: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '1em',
        fontWeight: 'bold'
    },
    overlayText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        color: '#fff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '15px',
        borderRadius: '8px',
        backdropFilter: 'blur(3px)'
    },
    controls: {
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
    },
    startButton: {
        padding: '15px 30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: '#00bcd4', // Cyan match
        color: '#121212',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    stopButton: {
        padding: '15px 30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer'
    },
    uploadButton: {
        padding: '15px 30px',
        fontSize: '1rem',
        fontWeight: 'bold',
        backgroundColor: 'transparent',
        color: '#00bcd4',
        border: '2px solid #00bcd4',
        borderRadius: '30px',
        cursor: 'pointer'
    },
    status: {
        minHeight: '20px',
        fontWeight: '500',
        color: '#aaa',
        marginBottom: '15px'
    }
};