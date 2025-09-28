import './App.css';


import React, { useState } from 'react';



// Combined record, transcribe, and feedback
const recordTranscribeFeedback = async (duration, scenario) => {
  const res = await fetch('http://localhost:5000/record_transcribe_feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ duration, scenario })
  });
  const data = await res.json();
  return data;
};







function HomeScreen({ onStart }) {
  return (
    <div className="App" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '48px 32px',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 700,
          marginBottom: '18px',
          color: '#2d3a4a',
          letterSpacing: '1px'
        }}>Socialemedy</h1>
        <p style={{
          fontSize: '1.2rem',
          color: '#4a5a6a',
          marginBottom: '32px'
        }}>
          Socialemedy helps you practice and improve your social communication skills in a safe, interactive environment.
        </p>
        <button style={{
          background: 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '14px 32px',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(102,166,255,0.15)',
          transition: 'background 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #89f7fe 0%, #66a6ff 100%)'}
        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)'}
        onClick={onStart}
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
}


function PracticeScreen({ onPlay }) {
  return (
    <div className="App" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        padding: '48px 32px',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 600,
          marginBottom: '18px',
          color: '#2d3a4a',
        }}>Tutorial</h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#4a5a6a',
          marginBottom: '32px'
        }}>
         You will be given a scenario to act out. Click play to start recording your response. After you finish, you will receive feedback on your response and some suggestions.
        </p>
        <button style={{
          background: 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '14px 32px',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(102,166,255,0.15)',
          transition: 'background 0.2s'
        }}
        onClick={onPlay}
        >
          Begin
        </button>
      </div>
    </div>
  );
}

function RecordingScreen({ onReturnHome }) {
  const scenarios = [
    "Scenario 1: It's the first day of school and your professor asks you to introduce yourself to the class.",
    "Scenario 2: You're sick with a stomach bug and need to make a doctor's appointment. The receptionist picks up the phone: 'Hello, thank you for calling Dr. Abbie's office. How can I assist you today?'",
    "Scenario 3: You ordered a burger with no pickles. Your server sets down your plate with extra pickles and walks away. What do you say?"
  ];
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [blink, setBlink] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Blinking effect using interval
  React.useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => {
        setBlink(prev => !prev);
      }, 600);
    }
    return () => clearInterval(interval);
  }, [recording]);

  const handleRecording = async () => {
    if (!recording) {
      setStartTime(Date.now());
      setRecording(true);
      setTranscript('');
      setFeedback('');
    } else {
      setRecording(false);
      setLoading(true);
      const duration = (Date.now() - startTime) / 1000;
      const scenario = scenarios[scenarioIdx];
      try {
        const result = await recordTranscribeFeedback(duration, scenario);
        setTranscript(result.transcript || '');
        setFeedback(result.feedback || '');
      } catch (err) {
        setFeedback('Error getting feedback.');
      }
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (scenarioIdx < scenarios.length - 1) {
      setScenarioIdx(scenarioIdx + 1);
      setTranscript('');
      setFeedback('');
    } else {
      if (typeof onReturnHome === 'function') {
        onReturnHome();
      }
    }
  };

  const handleRedo = () => {
    setTranscript('');
    setFeedback('');
  };

  return (
    <div className="App" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      fontFamily: 'Segoe UI, Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        borderRadius: '32px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
        padding: '64px 48px',
        maxWidth: '700px',
        width: '90%',
        minHeight: '420px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1 style={{
          fontSize: '1.6em',
          fontWeight: 700,
          marginBottom: '18px',
          color: '#2d3a4a',
          letterSpacing: '1px'
        }}>Socialemedy</h1>
        <h2 style={{
          fontSize: '1.4rem',
          fontWeight: 600,
          marginTop: '8px',
          marginBottom: '12px',
          color: '#2d3a4a',
        }}>Lets Practice!</h2>
        <div style={{
          fontSize: '2rem',
          color: '#222',
          fontWeight: 700,
          marginBottom: '32px',
          marginTop: '12px',
          maxWidth: '800px',
          lineHeight: 1.3,
          textAlign: 'center',
        }}>
          {scenarios[scenarioIdx]}
        </div>
        <button
          onClick={handleRecording}
          style={{
            background: recording && blink
              ? 'linear-gradient(90deg, #ff6a6a 0%, #ffb86c 100%)'
              : 'linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '18px 40px',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(102,166,255,0.18)',
            transition: 'background 0.2s',
            animation: recording ? 'blinker 1s linear infinite' : 'none',
            marginTop: '16px'
          }}
        >
          {recording ? '⏹️ Stop Recording...' : ' ▶️ Start Recording'}
        </button>
        {loading && <p style={{marginTop: '24px'}}>Processing...</p>}
        {transcript && (
          <div style={{marginTop: '32px'}}>
            <h3>Transcript:</h3>
            <p>{transcript}</p>
          </div>
        )}
        {transcript && feedback && (
          <div style={{marginTop: '32px'}}>
            <h3>Feedback:</h3>
            <p>{feedback}</p>
            <div style={{marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center'}}>
              <button onClick={handleRedo} style={{
                background: '#f7b731',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}>Try Again</button>
              <button onClick={handleNext} style={{
                background: '#66a6ff',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: 1
              }}>{scenarioIdx === scenarios.length - 1 ? 'Home' : 'Next'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function App() {
  const [screen, setScreen] = useState('home');

  if (screen === 'home') {
    return <HomeScreen onStart={() => setScreen('practice')} />;
  }
  if (screen === 'practice') {
    return <PracticeScreen onPlay={() => setScreen('recording')} />;
  }
  if (screen === 'recording') {
    return <RecordingScreen onReturnHome={() => setScreen('home')} />;
  }
  return null;
}

export default App;
