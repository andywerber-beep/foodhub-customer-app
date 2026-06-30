'use client';

import React from 'react';
import { Venue } from '@/hooks/useSupabaseData';

interface FloatingPromptProps {
  venue: Venue;
  onClose: () => void;
}

export default function FloatingPrompt({ venue, onClose }: FloatingPromptProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)',
      maxWidth: '400px',
      backgroundColor: '#111111',
      color: '#ffffff',
      padding: '16px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      fontFamily: '-apple-system, sans-serif'
    }}>
      <div style={{ flex: 1, marginRight: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#0066FF', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '0.05em' }}>
          ⚡ Proximity Ping Active
        </div>
        <div style={{ fontSize: '15px', fontWeight: 600 }}>{venue.name} is nearby!</div>
        <div style={{ fontSize: '13px', color: '#aaaaaa', marginTop: '2px' }}>Tap map marker to unlock exclusive lookbook deals.</div>
      </div>
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer', padding: '4px 8px' }}
      >
        ✕
      </button>
    </div>
  );
}