'use client';

import React from 'react';
import { Venue } from '@/hooks/useSupabaseData';

interface SlideUpCardProps {
  venue: Venue | null;
  onClose: () => void;
  onViewMenu: (venueId: string) => void;
}

export default function SlideUpCard({ venue, onClose, onViewMenu }: SlideUpCardProps) {
  const isOpen = venue !== null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -8px 40px rgba(0, 0, 0, 0.12)',
        transform: `translateY(${isOpen ? '0' : '100%'})`,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 100,
        padding: '24px 20px 34px 20px', // Extra bottom padding to clear mobile safe areas comfortably
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Elegantly styled top grab-bar indicator */}
      <div 
        onClick={onClose}
        style={{
          width: '40px',
          height: '4px',
          backgroundColor: '#e0e0e0',
          borderRadius: '2px',
          margin: '0 auto 20px auto',
          cursor: 'pointer'
        }}
      />

      {venue && (
        <div>
          {/* Header Row containing Venue Name and Close action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>
              {venue.name}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: '#f5f5f7',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#666666'
              }}
            >
              ✕
            </button>
          </div>

          {/* Subtitle Parameter mapping the cuisine type */}
          <div style={{ fontSize: '14px', color: '#666666', fontWeight: 500, marginBottom: '20px', textTransform: 'capitalize' }}>
            {venue.cuisine_type || 'Premium Kitchen'}
          </div>

          {/* Core Call-to-Action to push user into menu view router */}
          <button
            onClick={() => onViewMenu(venue.id)}
            style={{
              width: '100%',
              backgroundColor: '#111111',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#222222')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#111111')}
          >
            View Menu & Offers
          </button>
        </div>
      )}
    </div>
  );
}