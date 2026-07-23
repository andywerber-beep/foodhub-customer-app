'use client';

import React, { useState, useEffect } from 'react';

interface NotificationPrePromptProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export default function NotificationPrePrompt({
  onPermissionGranted,
  onPermissionDenied,
}: NotificationPrePromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if the browser supports Notifications
    if (!('Notification' in window)) {
      return;
    }

    // 2. If already granted or denied, do not show the prompt
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return;
    }

    // 3. Check 7-day cooldown from localStorage
    const lastDismissed = localStorage.getItem('pwa_notification_dismissed');
    if (lastDismissed) {
      const daysSince = (Date.now() - parseInt(lastDismissed, 10)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return; // Still within 7-day cooldown
      }
    }

    // Show the card
    setIsVisible(true);
  }, []);

  const handleEnableAlerts = async () => {
    try {
      const permission = await Notification.requestPermission();
      setIsVisible(false);

      if (permission === 'granted') {
        if (onPermissionGranted) onPermissionGranted();
      } else {
        if (onPermissionDenied) onPermissionDenied();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setIsVisible(false);
    }
  };

  const handleMaybeLater = () => {
    // Save current timestamp to trigger 7-day cooldown
    localStorage.setItem('pwa_notification_dismissed', Date.now().toString());
    setIsVisible(false);
    if (onPermissionDenied) onPermissionDenied();
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 32px)',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        border: '1px solid #e5e7eb',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            fontSize: '24px',
            lineHeight: '1',
            padding: '8px',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
          }}
        >
          🔔
        </div>
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: '#111827',
            }}
          >
            Never Miss a Local Deal!
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: '#4b5563',
              lineHeight: '1.4',
            }}
          >
            Get instant lock-screen pings when nearby partner venues drop exclusive offers in town.
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <button
          onClick={handleEnableAlerts}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
          }}
        >
          Enable Deal Alerts
        </button>
        <button
          onClick={handleMaybeLater}
          style={{
            width: '100%',
            padding: '10px 16px',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}