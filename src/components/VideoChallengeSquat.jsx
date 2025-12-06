// // import React, { useState, useRef, useCallback, useEffect } from 'react';
// // import Webcam from 'react-webcam';
// // import './videoChallengeSquat.css'; // <--- IMPORT THE CSS HERE

// // // --- CONFIGURATION ---
// // const CHALLENGE_DURATION_SECONDS = 30; 
// // const ORACLE_API_URL = "http://localhost:8001/verify_proof/"; 

// // const videoConstraints = {
// //     width: 480,
// //     height: 720,
// //     facingMode: "user"
// // };

// // export default function VideoChallenge() {
// //     // --- State Variables ---
// //     const [walletAddress, setWalletAddress] = useState('');
// //     const [isRecording, setIsRecording] = useState(false);
// //     const [recordedChunks, setRecordedChunks] = useState([]);
// //     const [countdown, setCountdown] = useState(CHALLENGE_DURATION_SECONDS);
// //     const [statusMessage, setStatusMessage] = useState('Enter wallet and click START.');
    
// //     // --- Refs ---
// //     const webcamRef = useRef(null);
// //     const mediaRecorderRef = useRef(null);

// //     const handleStopCaptureClick = useCallback(() => {
// //         if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
// //             mediaRecorderRef.current.stop();
// //             setIsRecording(false);
// //             setCountdown(0);
// //             setStatusMessage('Recording stopped. Ready to upload.');
// //         }
// //     }, [setIsRecording, setCountdown, setStatusMessage]);
    
// //     // --- Timer Logic ---
// //     useEffect(() => {
// //         let timer;
// //         if (isRecording && countdown > 0) {
// //             timer = setInterval(() => {
// //                 setCountdown((prevCount) => prevCount - 1);
// //             }, 1000);
// //         } else if (isRecording && countdown === 0) {
// //             // eslint-disable-next-line react-hooks/set-state-in-effect
// //             handleStopCaptureClick();
// //         }
// //         return () => clearInterval(timer);
// //     }, [isRecording, countdown, handleStopCaptureClick]); 

// //     // --- Media Recorder Callbacks ---
// //     const handleDataAvailable = useCallback(({ data }) => {
// //         if (data.size > 0) {
// //             setRecordedChunks((prev) => prev.concat(data));
// //         }
// //     }, [setRecordedChunks]);

// //     const handleStartCaptureClick = useCallback(() => {
// //         if (!walletAddress) {
// //             setStatusMessage("🛑 Please enter your wallet address first.");
// //             return;
// //         }

// //         setRecordedChunks([]);
// //         setCountdown(CHALLENGE_DURATION_SECONDS);
// //         setIsRecording(true);
// //         setStatusMessage('Recording...');

// //         try {
// //             mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
// //                 mimeType: "video/webm"
// //             });
            
// //             mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
// //             mediaRecorderRef.current.start(1000); 
// //         } catch (error) {
// //             console.error("Failed to start MediaRecorder:", error);
// //             setStatusMessage("🔴 Recording failed. Check console for details.");
// //             setIsRecording(false);
// //         }

// //     }, [webcamRef, setIsRecording, setCountdown, setStatusMessage, handleDataAvailable, walletAddress]);

// //     // --- Upload Logic ---
// //     const handleUpload = useCallback(async () => {
// //         if (recordedChunks.length === 0) {
// //             setStatusMessage("⚠️ No video recorded to upload.");
// //             return;
// //         }

// //         setStatusMessage("⬆️ Uploading to Oracle...");
        
// //         const blob = new Blob(recordedChunks, { type: "video/webm" });
// //         const videoFile = new File([blob], "proof.webm", { type: "video/webm" });

// //         const formData = new FormData();
// //         formData.append("file", videoFile);
// //         formData.append("user_wallet", walletAddress);
        
// //         try {
// //             const response = await fetch(`${ORACLE_API_URL}?user_wallet=${walletAddress}`, {
// //                 method: "POST",
// //                 body: formData,
// //             });

// //             if (response.ok) {
// //                 const result = await response.json();
// //                 setStatusMessage(`✅ SUCCESS! Goal: ${result.goal_met ? 'MET' : 'FAILED'}. Tx: ${result.transaction_hash.substring(0, 10)}...`);
// //             } else {
// //                 const errorData = await response.json();
// //                 setStatusMessage(`❌ Upload Failed: ${errorData.detail || response.statusText}`);
// //             }
// //         } catch (error) {
// //             console.error("Upload error:", error);
// //             setStatusMessage(`❌ Network Error: Could not reach Oracle backend.`);
// //         }
        
// //         setRecordedChunks([]); 

// //     }, [recordedChunks, walletAddress, setStatusMessage]);

// //     // --- Rendering ---
// //     const formatTime = (seconds) => {
// //         const min = Math.floor(seconds / 60);
// //         const sec = seconds % 60;
// //         return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
// //     };

// //     const isIdle = !isRecording && recordedChunks.length === 0;

// //     return (
// //         <>
// //             {/* NEW HEADER STRUCTURE
// //             <header className="dash-header">
// //                 <div className="brand">
// //                     {/* Placeholder image for logo - replace src with your actual logo import */}
// //                     {/* <img src="../logo.png" alt="Logo" className="brand-logo" />
// //                     <div className="brand-info">
// //                         <h1 className="brand-title">Fit-In-Healix</h1>
// //                         <p className="brand-subtitle">Terminal v1.0</p>
// //                     </div>
// //                 </div>
// //             </header> */} 

// //             <div style={styles.container}>
// //                 <h2 style={{color: '#fff'}}>StakeFit Challenge Proof Squat</h2>
// //                 <p style={styles.status}>{statusMessage}</p>
                
// //                 <input
// //                     type="text"
// //                     value={walletAddress}
// //                     onChange={(e) => setWalletAddress(e.target.value)}
// //                     placeholder="Enter your ETH Wallet Address"
// //                     style={styles.input}
// //                     disabled={isRecording}
// //                 />
                
// //                 <div style={styles.videoWrapper}>
// //                     {isIdle && <div style={styles.overlayText}>Camera Preview</div>}
                    
// //                     <Webcam
// //                         audio={false}
// //                         ref={webcamRef}
// //                         videoConstraints={videoConstraints}
// //                         mirrored={true}
// //                         style={styles.webcam}
// //                     />
                    
// //                     {isRecording && (
// //                         <div style={styles.timerOverlay}>
// //                             Recording: {formatTime(countdown)}
// //                         </div>
// //                     )}
// //                 </div>
                
// //                 <div style={styles.controls}>
// //                     <button 
// //                         onClick={isRecording ? handleStopCaptureClick : handleStartCaptureClick}
// //                         disabled={!walletAddress}
// //                         style={isRecording ? styles.stopButton : styles.startButton}
// //                     >
// //                         {isRecording ? `STOP (${formatTime(countdown)})` : 'START CHALLENGE'}
// //                     </button>

// //                     {!isRecording && recordedChunks.length > 0 && (
// //                         <button 
// //                             onClick={handleUpload}
// //                             style={styles.uploadButton}
// //                         >
// //                             UPLOAD PROOF
// //                         </button>
// //                     )}
// //                 </div>
// //             </div>
// //         </>
// //     );
// // }

// // // I updated the container styles slightly to look better with the dark header
// // const styles = {
// //     container: {
// //         maxWidth: '500px',
// //         margin: '50px auto',
// //         padding: '20px',
// //         border: '1px solid #333', // Darker border
// //         backgroundColor: '#1e1e1e', // Dark card background
// //         borderRadius: '16px',
// //         textAlign: 'center',
// //         boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
// //     },
// //     input: {
// //         width: 'calc(100% - 20px)',
// //         padding: '12px',
// //         margin: '10px 0 20px 0',
// //         borderRadius: '8px',
// //         border: '1px solid #444',
// //         backgroundColor: '#2c2c2c',
// //         color: '#fff',
// //         outline: 'none'
// //     },
// //     videoWrapper: {
// //         position: 'relative',
// //         marginBottom: '20px',
// //         borderRadius: '12px',
// //         overflow: 'hidden',
// //         border: '2px solid #333',
// //         backgroundColor: '#000'
// //     },
// //     webcam: {
// //         width: '100%',
// //         height: 'auto',
// //         display: 'block'
// //     },
// //     timerOverlay: {
// //         position: 'absolute',
// //         top: '10px',
// //         right: '10px',
// //         backgroundColor: 'rgba(255, 0, 0, 0.8)',
// //         color: 'white',
// //         padding: '5px 12px',
// //         borderRadius: '20px',
// //         fontSize: '1em',
// //         fontWeight: 'bold'
// //     },
// //     overlayText: {
// //         position: 'absolute',
// //         top: '50%',
// //         left: '50%',
// //         transform: 'translate(-50%, -50%)',
// //         zIndex: 10,
// //         color: '#fff',
// //         backgroundColor: 'rgba(0, 0, 0, 0.6)',
// //         padding: '15px',
// //         borderRadius: '8px',
// //         backdropFilter: 'blur(3px)'
// //     },
// //     controls: {
// //         display: 'flex',
// //         gap: '15px',
// //         justifyContent: 'center'
// //     },
// //     startButton: {
// //         padding: '15px 30px',
// //         fontSize: '1rem',
// //         fontWeight: 'bold',
// //         backgroundColor: '#00bcd4', // Cyan match
// //         color: '#121212',
// //         border: 'none',
// //         borderRadius: '30px',
// //         cursor: 'pointer',
// //         transition: 'all 0.3s ease'
// //     },
// //     stopButton: {
// //         padding: '15px 30px',
// //         fontSize: '1rem',
// //         fontWeight: 'bold',
// //         backgroundColor: '#f44336',
// //         color: 'white',
// //         border: 'none',
// //         borderRadius: '30px',
// //         cursor: 'pointer'
// //     },
// //     uploadButton: {
// //         padding: '15px 30px',
// //         fontSize: '1rem',
// //         fontWeight: 'bold',
// //         backgroundColor: 'transparent',
// //         color: '#00bcd4',
// //         border: '2px solid #00bcd4',
// //         borderRadius: '30px',
// //         cursor: 'pointer'
// //     },
// //     status: {
// //         minHeight: '20px',
// //         fontWeight: '500',
// //         color: '#aaa',
// //         marginBottom: '15px'
// //     }
// // };


// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import Webcam from 'react-webcam';

// // --- CONFIGURATION ---
// const CHALLENGE_DURATION_SECONDS = 30; // 30 seconds for the squat challenge
// const FRAME_STREAM_INTERVAL_MS = 100; // Send a frame every 100ms (10 FPS)

// // IMPORTANT: Replace this with an actual API call to your Node.js backend
// // The Node.js backend must return the full, secure WebSocket URL:
// // e.g., "ws://localhost:8001/ws/live_verify/0xabc...?api_key=SF_AI_ORACLE_KEY_0987654321"
// const NODE_WS_URL_ENDPOINT = 'http://localhost:8080/api/secure-ws-url';

// const videoConstraints = {
//   width: 480,
//   height: 720,
//   facingMode: 'user', // Use the front-facing camera
// };

// export default function VideoChallenge() {
//   // --- State Variables ---
//   const [walletAddress, setWalletAddress] = useState('');
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [countdown, setCountdown] = useState(CHALLENGE_DURATION_SECONDS);
//   const [statusMessage, setStatusMessage] = useState('Enter wallet and click START.');
//   // New state for live feedback
//   const [liveFeedback, setLiveFeedback] = useState({
//     reps: 0,
//     score: 0,
//     form: 'Awaiting Reps',
//   });

//   // --- Refs for Webcam and WebSocket ---
//   const webcamRef = useRef(null);
//   const wsRef = useRef(null);
//   const streamIntervalRef = useRef(null); // Ref for the frame streaming loop

//   // --- Frame Streaming Logic ---
//   const streamFrame = useCallback(() => {
//     if (webcamRef.current && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       // Get the current frame as a Base64 encoded JPEG string
//       const imageSrc = webcamRef.current.getScreenshot();
//       if (imageSrc) {
//         // Send the Base64 string directly over the WebSocket
//         wsRef.current.send(imageSrc);
//       }
//     }
//   }, []);

//   // --- STOP STREAMING Logic ---
//   const handleStopStreaming = useCallback(() => {
//     if (streamIntervalRef.current) {
//       clearInterval(streamIntervalRef.current);
//       streamIntervalRef.current = null;
//     }

//     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//       // 1. Stop sending frames immediately (already cleared above)
//       // 2. Send "STOP" signal to the Oracle to trigger blockchain transaction
//       wsRef.current.send('STOP');
//       setStatusMessage('✅ Session ended. Awaiting final Oracle verification...');
//       // Note: The final result and connection close will be handled by wsRef.current.onmessage handler (FINAL_RESULT)
//     } else {
//       setIsStreaming(false);
//       setCountdown(0);
//       setStatusMessage('Streaming manually stopped.');
//     }
//   }, []);

//   // --- Timer Logic (useEffect) ---
//   useEffect(() => {
//     let timer;
//     if (isStreaming && countdown > 0) {
//       timer = setInterval(() => {
//         setCountdown((prevCount) => prevCount - 1);
//       }, 1000);
//     } else if (isStreaming && countdown === 0) {
//       // Auto-stop streaming when the timer hits zero
//       handleStopStreaming();
//     }

//     return () => clearInterval(timer);
//   }, [isStreaming, countdown, handleStopStreaming]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (streamIntervalRef.current) {
//         clearInterval(streamIntervalRef.current);
//       }
//       if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
//         wsRef.current.close();
//       }
//     };
//   }, []);

//   // --- START STREAMING Logic ---
//   const handleStartStreaming = useCallback(async () => {
//     if (!walletAddress) {
//       setStatusMessage('🛑 Please enter your wallet address first.');
//       return;
//     }

//     // 1. Fetch the secure WebSocket URL from Node.js Backend
//     setStatusMessage('🔗 Getting secure connection URL...');
//     let wsUrl;
//     try {
//       const response = await fetch(
//         `${NODE_WS_URL_ENDPOINT}?wallet=${encodeURIComponent(walletAddress)}`
//       );
//       if (!response.ok) throw new Error('Failed to get WS URL from MERN.');
//       const data = await response.json();
//       wsUrl = data.wsUrl;
//     } catch (error) {
//       setStatusMessage(`❌ Connection Error: ${error.message}`);
//       return;
//     }

//     // 2. Initialize WebSocket
//     wsRef.current = new WebSocket(wsUrl);

//     wsRef.current.onopen = () => {
//       console.log('WebSocket connected.');
//       setStatusMessage('✅ Connection Open. Starting Challenge...');

//       // 3. Start State
//       setCountdown(CHALLENGE_DURATION_SECONDS);
//       setIsStreaming(true);
//       setLiveFeedback({ reps: 0, score: 0, form: 'Start Squatting!' });

//       // 4. Start Continuous Frame Streaming
//       streamIntervalRef.current = setInterval(streamFrame, FRAME_STREAM_INTERVAL_MS);
//     };

//     wsRef.current.onmessage = (event) => {
//       const data = JSON.parse(event.data);

//       if (data.status === 'FINAL_RESULT') {
//         // 5. Handle Final Result from the Oracle
//         setStatusMessage(
//           `🎉 FINAL: ${data.message}. Goal: ${data.goal_met ? 'MET' : 'FAILED'}.`
//         );
//         if (streamIntervalRef.current) {
//           clearInterval(streamIntervalRef.current);
//           streamIntervalRef.current = null;
//         }
//         setIsStreaming(false);
//       } else {
//         // 6. Handle Real-time Feedback
//         setLiveFeedback({
//           reps: data.rep_count,
//           score: Math.round(data.score),
//           form: data.feedback,
//         });
//       }
//     };

//     wsRef.current.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//       setStatusMessage('🔴 WebSocket Error. Check console.');
//       if (streamIntervalRef.current) {
//         clearInterval(streamIntervalRef.current);
//         streamIntervalRef.current = null;
//       }
//       setIsStreaming(false);
//     };

//     wsRef.current.onclose = () => {
//       console.log('WebSocket closed.');
//       setStatusMessage((prev) =>
//         prev.includes('FINAL') ? prev : 'Connection closed.'
//       );
//       if (streamIntervalRef.current) {
//         clearInterval(streamIntervalRef.current);
//         streamIntervalRef.current = null;
//       }
//       setIsStreaming(false);
//     };
//   }, [walletAddress, streamFrame]);

//   // --- Rendering ---
//   const formatTime = (seconds) => {
//     const min = Math.floor(seconds / 60);
//     const sec = seconds % 60;
//     return `${min.toString().padStart(2, '0')}:${sec
//       .toString()
//       .padStart(2, '0')}`;
//   };

//   return (
//     <div style={styles.container}>
//       <h2>StakeFit Live Challenge Squats</h2>
//       <p style={styles.status}>{statusMessage}</p>

//       <input
//         type="text"
//         value={walletAddress}
//         onChange={(e) => setWalletAddress(e.target.value)}
//         placeholder="Enter your ETH Wallet Address"
//         style={styles.input}
//         disabled={isStreaming}
//       />

//       <div style={styles.videoWrapper}>
//         {!isStreaming && <div style={styles.overlayText}>Camera Preview</div>}

//         <Webcam
//           audio={false}
//           ref={webcamRef}
//           videoConstraints={videoConstraints}
//           mirrored={true}
//           style={styles.webcam}
//         />

//         {isStreaming && (
//           <div style={styles.timerOverlay}>
//             Time Left: {formatTime(countdown)}
//           </div>
//         )}

//         {isStreaming && (
//           <div style={styles.feedbackOverlay}>
//             <strong>Reps:</strong> {liveFeedback.reps} |{' '}
//             <strong>Score:</strong> {liveFeedback.score}% <br />
//             Form: {liveFeedback.form}
//           </div>
//         )}
//       </div>

//       <div style={styles.controls}>
//         <button
//           onClick={isStreaming ? handleStopStreaming : handleStartStreaming}
//           disabled={!walletAddress}
//           style={isStreaming ? styles.stopButton : styles.startButton}
//         >
//           {isStreaming ? 'STOP STREAMING & FINALIZE' : 'START LIVE CHALLENGE'}
//         </button>
//       </div>
//     </div>
//   );
// }

// // Simple Inline Styles (Updated to include feedback overlay)
// const styles = {
//   container: {
//     maxWidth: '500px',
//     margin: '50px auto',
//     padding: '20px',
//     border: '1px solid #ddd',
//     borderRadius: '10px',
//     textAlign: 'center',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//   },
//   input: {
//     width: 'calc(100% - 20px)',
//     padding: '10px',
//     margin: '10px 0 20px 0',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   videoWrapper: {
//     position: 'relative',
//     marginBottom: '20px',
//     borderRadius: '10px',
//     overflow: 'hidden',
//   },
//   webcam: {
//     width: '100%',
//     height: 'auto',
//     display: 'block',
//   },
//   timerOverlay: {
//     position: 'absolute',
//     top: '10px',
//     right: '10px',
//     backgroundColor: 'rgba(255, 0, 0, 0.8)',
//     color: 'white',
//     padding: '5px 10px',
//     borderRadius: '5px',
//     fontSize: '1.2em',
//     zIndex: 10,
//   },
//   feedbackOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     width: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     color: 'white',
//     padding: '10px',
//     textAlign: 'left',
//     fontSize: '1.1em',
//     zIndex: 10,
//   },
//   overlayText: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     zIndex: 10,
//     color: '#fff',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     padding: '15px',
//     borderRadius: '8px',
//   },
//   controls: {
//     display: 'flex',
//     gap: '10px',
//     justifyContent: 'center',
//   },
//   startButton: {
//     padding: '15px 25px',
//     fontSize: '1.1em',
//     backgroundColor: '#4CAF50',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//   },
//   stopButton: {
//     padding: '15px 25px',
//     fontSize: '1.1em',
//     backgroundColor: '#f44336',
//     color: 'white',
//     border: 'none',
//     borderRadius: '8px',
//     cursor: 'pointer',
//   },
//   status: {
//     minHeight: '20px',
//     fontWeight: 'bold',
//   },
// };
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import Webcam from "react-webcam";

const FRAME_STREAM_INTERVAL_MS = 100; // 10 fps

// Backend base URL (Express)
const BACKEND_BASE_URL = "http://localhost:5000";

// Endpoint that returns secure WS URL
// GET /api/secure-ws-url?wallet=0x...
const NODE_WS_URL_ENDPOINT = `${BACKEND_BASE_URL}/api/secure-ws-url`;

const videoConstraints = {
  width: 480,
  height: 720,
  facingMode: "user",
};

export default function VideoChallengeSquat({
  duration = 30,
  targetReps,
  stakeAmount,
}) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [countdown, setCountdown] = useState(duration);
  const [statusMessage, setStatusMessage] = useState(
    "Enter wallet and click START."
  );
  const [liveFeedback, setLiveFeedback] = useState({
    reps: 0,
    score: 0,
    form: "Awaiting Reps",
  });

  const webcamRef = useRef(null);
  const wsRef = useRef(null);
  const streamIntervalRef = useRef(null);

  // Send one frame over WebSocket
  const streamFrame = useCallback(() => {
    if (
      webcamRef.current &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        wsRef.current.send(imageSrc);
      }
    }
  }, []);

  // Stop streaming
  const handleStopStreaming = useCallback(() => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send("STOP");
      setStatusMessage(
        "✅ Session ended. Awaiting final Oracle verification..."
      );
    } else {
      setIsStreaming(false);
      setCountdown(0);
      setStatusMessage("Streaming manually stopped.");
    }
  }, []);

  // Timer
  useEffect(() => {
    let timer;
    if (isStreaming && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isStreaming && countdown === 0) {
      handleStopStreaming();
    }

    return () => clearInterval(timer);
  }, [isStreaming, countdown, handleStopStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  // Start streaming
  const handleStartStreaming = useCallback(async () => {
    if (!walletAddress) {
      setStatusMessage("🛑 Please enter your wallet address first.");
      return;
    }

    // 1. Get secure WS URL
    setStatusMessage("🔗 Getting secure connection URL...");
    let wsUrl;
    try {
      const response = await fetch(
        `${NODE_WS_URL_ENDPOINT}?wallet=${encodeURIComponent(walletAddress)}`
      );
      if (!response.ok) throw new Error("Failed to get WS URL from backend.");
      const data = await response.json();
      wsUrl = data.wsUrl;
    } catch (error) {
      setStatusMessage(`❌ Connection Error: ${error.message}`);
      return;
    }

    // 2. Open WebSocket
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log("WebSocket connected.");
      setStatusMessage("✅ Connection Open. Starting Squat Challenge...");

      setCountdown(duration);
      setIsStreaming(true);
      setLiveFeedback({
        reps: 0,
        score: 0,
        form: "Start squatting!",
      });

      // Start streaming frames
      streamIntervalRef.current = setInterval(
        streamFrame,
        FRAME_STREAM_INTERVAL_MS
      );
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("WS message:", data);

      if (data.status === "FINAL_RESULT") {
        // Oracle final verdict
        const isSuccess =
          data.isValid !== undefined ? data.isValid : data.goal_met;

        setStatusMessage(
          `🎉 FINAL: ${data.message}. Goal: ${
            isSuccess ? "MET" : "FAILED"
          }. Saving on-chain...`
        );

        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }
        setIsStreaming(false);

        // 3. Call backend to update blockchain
        try {
          const resp = await fetch(`${BACKEND_BASE_URL}/api/verifyDay`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user: walletAddress,
              isSuccess,
              targetReps,
              stakeAmount,
            }),
          });
          const json = await resp.json();
          console.log("verifyDay result:", json);

          if (json.ok) {
            setStatusMessage(
              `✅ On-chain update successful. ${
                isSuccess ? "Rewarded!" : "Better luck next time."
              }`
            );
          } else {
            setStatusMessage(
              `⚠️ Oracle done, but chain update failed: ${
                json.error || "Unknown error"
              }`
            );
          }
        } catch (err) {
          console.error("verifyDay error:", err);
          setStatusMessage(
            "🔴 Oracle finished, but blockchain update request failed. Check console."
          );
        }
      } else {
        // Live feedback
        setLiveFeedback({
          reps: data.rep_count,
          score: Math.round(data.score),
          form: data.feedback,
        });
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
      setStatusMessage("🔴 WebSocket Error. Check console.");
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      setIsStreaming(false);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed.");
      setStatusMessage((prev) =>
        prev.includes("FINAL") ? prev : "Connection closed."
      );
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
      setIsStreaming(false);
    };
  }, [walletAddress, duration, targetReps, stakeAmount, streamFrame]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={styles.container}>
      <h2>StakeFit Live Squat Challenge</h2>
      <p style={styles.status}>{statusMessage}</p>

      <p>
        <strong>Target Reps:</strong> {targetReps} |{" "}
        <strong>Total Stake:</strong> {stakeAmount} ETH
      </p>

      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Enter your ETH Wallet Address"
        style={styles.input}
        disabled={isStreaming}
      />

      <div style={styles.videoWrapper}>
        {!isStreaming && <div style={styles.overlayText}>Camera Preview</div>}

        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={videoConstraints}
          mirrored={true}
          style={styles.webcam}
        />

        {isStreaming && (
          <div style={styles.timerOverlay}>
            Time Left: {formatTime(countdown)}
          </div>
        )}

        {isStreaming && (
          <div style={styles.feedbackOverlay}>
            <strong>Reps:</strong> {liveFeedback.reps} |{" "}
            <strong>Score:</strong> {liveFeedback.score}% <br />
            Form: {liveFeedback.form}
          </div>
        )}
      </div>

      <div style={styles.controls}>
        <button
          onClick={isStreaming ? handleStopStreaming : handleStartStreaming}
          disabled={!walletAddress}
          style={isStreaming ? styles.stopButton : styles.startButton}
        >
          {isStreaming ? "STOP STREAMING & FINALIZE" : "START LIVE CHALLENGE"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "calc(100% - 20px)",
    padding: "10px",
    margin: "10px 0 20px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  videoWrapper: {
    position: "relative",
    marginBottom: "20px",
    borderRadius: "10px",
    overflow: "hidden",
  },
  webcam: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  timerOverlay: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "1.2em",
    zIndex: 10,
  },
  feedbackOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    padding: "10px",
    textAlign: "left",
    fontSize: "1.1em",
    zIndex: 10,
  },
  overlayText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 10,
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "15px",
    borderRadius: "8px",
  },
  controls: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  startButton: {
    padding: "15px 25px",
    fontSize: "1.1em",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  stopButton: {
    padding: "15px 25px",
    fontSize: "1.1em",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  status: {
    minHeight: "20px",
    fontWeight: "bold",
  },
};
