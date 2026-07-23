import React, { useEffect, useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

const InitialLoader: React.FC = () => {
  const { settings, loading } = useSettings();
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // If settings are loaded, check if we should show the loader
    if (!loading) {
      if (settings.loader_enabled === 'false') {
        setShow(false);
      } else {
        // Show for at least 1.5 seconds after load
        const timer = setTimeout(() => {
          setFade(true);
          setTimeout(() => setShow(false), 800);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, settings.loader_enabled]);

  if (!show) return null;

  const hasLogo = !!settings.loader_logo;
  const text = settings.loader_text || 'ITSEC.AZ';

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a0a',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        transition: 'opacity 0.8s ease, visibility 0.8s',
        opacity: fade ? 0 : 1,
        visibility: fade ? 'hidden' : 'visible'
      }}
    >
      {hasLogo ? (
        <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid rgba(59, 130, 246, 0.5)', animation: 'radar 2s infinite ease-out' }}></div>
          <img src={settings.loader_logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', zIndex: 10, animation: 'pulseText 2s infinite' }} />
        </div>
      ) : (
        <div className="loader-container">
          <div className="camera-radar"></div>
          <div className="camera-antenna"></div>
          <div className="camera-body">
            <div className="camera-lens"></div>
          </div>
        </div>
      )}
      
      <div className="camera-line"></div>
      
      <div className="loader-text" style={{ textAlign: 'center', padding: '0 20px', fontSize: '14px', lineHeight: 1.5, marginTop: '30px', fontWeight: 600 }}>
        {text}
      </div>

      <style>{`
        .loader-container { position: relative; width: 80px; height: 80px; }
        .camera-body { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 60px; border: 4px solid #fff; border-radius: 12px; background: #171717; }
        .camera-lens { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 30px; height: 30px; border: 4px solid #3b82f6; border-radius: 50%; background: #000; box-shadow: 0 0 15px #3b82f6; animation: pulseLens 2s infinite ease-in-out; }
        .camera-lens::after { content: ''; position: absolute; top: 4px; left: 4px; width: 6px; height: 6px; background: #fff; border-radius: 50%; }
        .camera-antenna { position: absolute; top: -15px; left: 50%; width: 4px; height: 15px; background: #fff; transform: translateX(-50%); }
        .camera-radar { position: absolute; top: 0; left: 50%; width: 120px; height: 120px; border: 2px solid rgba(59, 130, 246, 0.5); border-radius: 50%; transform: translate(-50%, -50%) scale(0); animation: radar 2s infinite ease-out; }
        .camera-line { width: 150px; height: 2px; background: rgba(255,255,255,0.1); margin-top: 40px; position: relative; overflow: hidden; border-radius: 2px; }
        .camera-line::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: #3b82f6; box-shadow: 0 0 10px #3b82f6; animation: loadingLine 1.5s infinite ease-in-out; }
        @keyframes pulseLens { 0%, 100% { box-shadow: 0 0 10px #3b82f6; } 50% { box-shadow: 0 0 25px #3b82f6, inset 0 0 10px #3b82f6; } }
        @keyframes radar { 0% { transform: translate(-50%, -50%) scale(0); opacity: 1; } 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } }
        @keyframes loadingLine { 100% { left: 100%; } }
        .loader-text { margin-top: 20px; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; letter-spacing: 2px; color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3); animation: pulseText 1.5s infinite; }
        @keyframes pulseText { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default InitialLoader;
