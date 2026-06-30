'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

// Internal reusable accordion component for a clean interface
function AccordionItem({ title, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #eaeaea', padding: '16px 0' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#111111' }}>{title}</span>
        <span style={{ fontSize: '18px', color: '#666666', transition: 'transform 0.2s', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          ＋
        </span>
      </button>
      <div
        style={{
          maxHeight: isOpen ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s',
          opacity: isOpen ? 1 : 0,
          paddingTop: isOpen ? '12px' : '0',
          fontSize: '14px',
          color: '#666666',
          lineHeight: '1.5',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function CustomerProfilePage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 16px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
      {/* Top Header Navigation bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px 8px' }}>
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111111', letterSpacing: '-0.02em' }}>Account Profile</h1>
      </div>

      {/* User Meta Info Identity Card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '16px', marginBottom: '32px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#111111', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 600 }}>
          JD
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111111' }}>John Doe</div>
          <div style={{ fontSize: '13px', color: '#666666' }}>brighton.explorer@foodhub.com</div>
        </div>
      </div>

      {/* Help & Support Accordion Section */}
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111111', marginBottom: '8px' }}>Help & Support</h3>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666666' }}>Everything you need to know about navigating your local venue perks.</p>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <AccordionItem title="How do the proximity alert pings work?">
          When walking around Brighton, our system securely utilizes your phone's background geolocation hardware to check if you are within a 400m radius of our active partner venues. If a match is found, an instant overhead discount prompt appears.
        </AccordionItem>

        <AccordionItem title="How do I use NFC Tap to Pay?">
          It's completely frictionless! Simply tap the "NFC Tap Pay" action button directly on any venue signature item lookbook card, then hold your smartphone within a few centimeters of the partner venue's point-of-sale verification scanner to finalize your purchase.
        </AccordionItem>

        <AccordionItem title="Are there any extra transactional costs?">
          No. The price you see listed on our exclusive partner venue menu card is the exact amount you pay at checkout. There are absolutely zero hidden transaction or processing handling fees added to your bill.
        </AccordionItem>
      </div>

    </div>
  );
}