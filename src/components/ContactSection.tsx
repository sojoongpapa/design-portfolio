import React, { useState } from 'react';
import { ContactInfo } from '../types/portfolio';
import { Mail, MapPin, Check, Copy, ArrowUpRight } from 'lucide-react';

interface ContactSectionProps {
  contact: ContactInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contact }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (!contact.email) return;
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="contact-container animate-fadeIn">
      <div>
        <span className="section-label">Contact</span>
        <h2 className="contact-headline">
          “{contact.headline || 'THANKS FOR LOOKING. I’D LOVE TO HEAR FROM YOU'}”
        </h2>
        {contact.note && (
          <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 300 }}>
            {contact.note}
          </p>
        )}
      </div>

      <div className="contact-cards-grid">
        {/* Email Card */}
        <div className="contact-box">
          <div>
            <div className="contact-icon-circle">
              <Mail size={20} />
            </div>
            <div className="contact-box-title">Direct Email</div>
            <div className="contact-box-val">{contact.email}</div>
          </div>

          <div className="contact-actions">
            <a href={`mailto:${contact.email}`} className="btn-contact-action">
              <span>Send Message</span>
              <ArrowUpRight size={15} />
            </a>

            <button
              onClick={handleCopyEmail}
              className="btn-copy"
              title="Copy email to clipboard"
              aria-label="Copy email"
            >
              {copied ? <Check size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Location Card */}
        <div className="contact-box">
          <div>
            <div className="contact-icon-circle">
              <MapPin size={20} />
            </div>
            <div className="contact-box-title">Location</div>
            <div className="contact-box-val" style={{ fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.6 }}>
              {contact.address}
            </div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Republic of Korea
          </div>
        </div>
      </div>
    </section>
  );
};
