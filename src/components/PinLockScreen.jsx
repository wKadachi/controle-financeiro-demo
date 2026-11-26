import React, { useState, useEffect, useRef } from 'react';
import { Lock, Fingerprint, Delete, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PinLockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);
  const [authConfig, setAuthConfig] = useState({ hasGoogleAuth: false, authorizedEmail: 'demo@example.com' });
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const isTrusted = localStorage.getItem('finance_trusted_device');
    if (isTrusted === 'true') {
      onUnlock();
    }

    const lockoutUntil = localStorage.getItem('pin_lockout_until');
    if (lockoutUntil) {
      const remaining = Math.ceil((parseInt(lockoutUntil, 10) - Date.now()) / 1000);
      if (remaining > 0) {
        setIsLockedOut(true);
        setLockoutTimeLeft(remaining);
      }
    }

    // Fetch auth config
    fetch('/api/auth/config')
      .then(res => res.json())
      .then(cfg => {
        setAuthConfig(cfg);
        if (cfg.googleClientId) {
          loadGoogleScript(cfg.googleClientId);
        }
      })
      .catch(() => {});
  }, [onUnlock]);

  const loadGoogleScript = (clientId) => {
    if (window.google?.accounts?.id) {
      renderGoogleBtn(clientId);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => renderGoogleBtn(clientId);
    document.body.appendChild(script);
  };

  const renderGoogleBtn = (clientId) => {
    if (!window.google?.accounts?.id || !googleBtnRef.current) return;
    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'filled_black',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 280,
      });
    } catch (e) {
      console.warn('Google GSI init err:', e);
    }
  };

  const handleGoogleResponse = async (response) => {
    try {
      setErrorMsg('');
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (res.ok && data.authorized) {
        if (rememberDevice) {
          localStorage.setItem('finance_trusted_device', 'true');
        }
        onUnlock();
      } else {
        setErrorMsg(data.error || 'Acesso negado para esta conta Google.');
      }
    } catch (e) {
      setErrorMsg('Erro ao conectar com servidor para validar Google.');
    }
  };

  useEffect(() => {
    let timer = null;
    if (isLockedOut && lockoutTimeLeft > 0) {
      timer = setInterval(() => {
        setLockoutTimeLeft(prev => {
          if (prev <= 1) {
            setIsLockedOut(false);
            localStorage.removeItem('pin_lockout_until');
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLockedOut, lockoutTimeLeft]);

  const handleKeyPress = (num) => {
    if (isLockedOut) return;
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setErrorMsg('');

      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (isLockedOut) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = async (inputPin) => {
    try {
      const res = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: inputPin })
      });
      const data = await res.json();

      if (res.ok && data.authorized) {
        if (rememberDevice) {
          localStorage.setItem('finance_trusted_device', 'true');
        }
        onUnlock();
      } else {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);

        if (nextAttempts >= 3) {
          const lockoutTime = 15 * 60; // 15 minutes
          localStorage.setItem('pin_lockout_until', (Date.now() + lockoutTime * 1000).toString());
          setIsLockedOut(true);
          setLockoutTimeLeft(lockoutTime);
          setErrorMsg('Bloqueado por segurança por 15 minutos.');
        } else {
          setErrorMsg(data.error || `PIN incorreto. Tentativa ${nextAttempts} de 3.`);
        }

        if (navigator.vibrate) navigator.vibrate(200);
        setTimeout(() => setPin(''), 500);
      }
    } catch (e) {
      setErrorMsg('Erro de conexão ao validar PIN.');
      setTimeout(() => setPin(''), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0E] text-[#EFEAFF] p-4 select-none">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Header Icon */}
        <div className="relative mb-5">
          <div className="w-20 h-20 rounded-3xl bg-[#14121B] border border-[#241A30] flex items-center justify-center text-[#EFEAFF] shadow-xl shadow-[#51307A]/20">
            <ShieldCheck className="w-10 h-10 text-[#EFEAFF]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#51307A] flex items-center justify-center text-[#EFEAFF] text-xs font-bold border-2 border-[#0B0B0E]">
            ✓
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-[#EFEAFF] mb-1">Controle Financeiro</h1>
        
        {/* Security badge with user email */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14121B] border border-[#241A30] text-[11px] text-[#EFEAFF]/70 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#51307A] animate-pulse" />
          <span>Restrito: {authConfig.authorizedEmail}</span>
        </div>

        {/* Google Login Section (if configured) */}
        {authConfig.hasGoogleAuth && (
          <div className="w-full flex flex-col items-center mb-6">
            <div ref={googleBtnRef} className="min-h-[44px]" />
            <div className="flex items-center gap-3 w-full my-4">
              <div className="flex-1 h-[1px] bg-[#241A30]" />
              <span className="text-[10px] uppercase font-bold text-[#EFEAFF]/40 tracking-wider">ou digite o pin</span>
              <div className="flex-1 h-[1px] bg-[#241A30]" />
            </div>
          </div>
        )}

        <p className="text-xs text-[#EFEAFF]/60 mb-6">
          {isLockedOut
            ? `Bloqueado: aguarde ${Math.floor(lockoutTimeLeft / 60)}m ${lockoutTimeLeft % 60}s`
            : 'Digite seu PIN de 4 dígitos'}
        </p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-6">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  errorMsg
                    ? 'bg-[#51307A] border border-[#EFEAFF] scale-110'
                    : isFilled
                    ? 'bg-[#51307A] shadow-lg shadow-[#51307A]/70 scale-110'
                    : 'bg-[#14121B] border border-[#241A30]'
                }`}
              />
            );
          })}
        </div>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-[#EFEAFF] bg-[#241A30] px-3 py-1.5 rounded-lg border border-[#51307A]/50 text-xs font-medium mb-6 animate-pulse">
            <AlertCircle className="w-4 h-4 text-[#EFEAFF]" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={isLockedOut}
              className={`h-14 rounded-2xl bg-[#14121B] border border-[#241A30] hover:bg-[#241A30] hover:border-[#51307A] active:scale-95 transition-all text-xl font-bold text-[#EFEAFF] flex items-center justify-center shadow-md ${
                isLockedOut ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              {num}
            </button>
          ))}

          {/* Biometrics */}
          <button
            onClick={() => onUnlock()}
            disabled={isLockedOut}
            className={`h-14 rounded-2xl bg-[#14121B] border border-[#241A30] hover:bg-[#241A30] active:scale-95 transition-all flex items-center justify-center ${
              isLockedOut ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            title="Biometria / Reconhecimento facial"
          >
            <Fingerprint className="w-6 h-6 text-[#EFEAFF]" />
          </button>

          {/* Zero */}
          <button
            onClick={() => handleKeyPress('0')}
            disabled={isLockedOut}
            className={`h-14 rounded-2xl bg-[#14121B] border border-[#241A30] hover:bg-[#241A30] hover:border-[#51307A] active:scale-95 transition-all text-xl font-bold text-[#EFEAFF] flex items-center justify-center shadow-md ${
              isLockedOut ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            0
          </button>

          {/* Backspace */}
          <button
            onClick={handleDelete}
            disabled={isLockedOut}
            className={`h-14 rounded-2xl bg-[#14121B] border border-[#241A30] hover:bg-[#241A30] active:scale-95 transition-all text-[#EFEAFF]/70 flex items-center justify-center ${
              isLockedOut ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            title="Apagar dígito"
          >
            <Delete className="w-5 h-5 text-[#EFEAFF]" />
          </button>
        </div>

        {/* Remember device checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#EFEAFF]/70 hover:text-[#EFEAFF] transition-colors">
          <input
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="w-4 h-4 rounded border-[#241A30] bg-[#14121B] text-[#51307A] focus:ring-[#51307A]"
          />
          <span>Lembrar este dispositivo por 30 dias</span>
        </label>
      </div>
    </div>
  );
}
