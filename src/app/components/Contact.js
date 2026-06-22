'use client';
import { Phone, Mail, MapPin } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TikTokIcon, WhatsAppIcon } from './Icons';

const contactInfo = [
  { icon: <Phone size={24} />, title: 'Phone', lines: ['+92 319 5403032'] },
  { icon: <Mail size={24} />, title: 'Email', lines: ['forestynexus@gmail.com'] },
  { icon: <MapPin size={24} />, title: 'Address', lines: ['Main Food Street,', 'Islamabad, Pakistan'] },
];

const socials = [
  { icon: <InstagramIcon size={20} />, label: 'Instagram' },
  { icon: <FacebookIcon size={20} />, label: 'Facebook' },
  { icon: <TikTokIcon size={20} />, label: 'TikTok' },
  { icon: <WhatsAppIcon size={20} />, label: 'WhatsApp' },
];

export default function Contact() {
  return (
    <section className="section bg-[#1c1c1c]" id="contact">
      <p className="section-sub">Get In Touch</p>
      <h2 className="section-title">Contact Us</h2>
      <p className="section-desc">Have a question, want to place a bulk order, or just say hi? We&apos;d love to hear from you!</p>

      <div className="contact-grid">
        <div className="contact-info">
          {contactInfo.map((c, i) => (
            <div className="contact-item reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="contact-icon" style={{ color: 'var(--red)' }}>{c.icon}</div>
              <div>
                <h4>{c.title}</h4>
                {c.lines.map((l, j) => <p key={j}>{l}</p>)}
              </div>
            </div>
          ))}
          <div className="social-links">
            {socials.map((s, i) => (
              <div className="social-link" key={i} title={s.label}>{s.icon}</div>
            ))}
          </div>
        </div>

        <div className="contact-map">
          <div style={{
            width: '100%', height: '100%', minHeight: '350px',
            background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            borderRadius: '20px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexDirection: 'column', gap: '15px',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0, opacity: 0.1,
              backgroundImage: 'radial-gradient(circle, var(--yellow) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
            <div style={{ zIndex: 1, color: 'var(--red)' }}><MapPin size={64} fill="var(--red)" fillOpacity={0.2} /></div>
            <div style={{ zIndex: 1, textAlign: 'center' }}>
              <h4 style={{ marginBottom: '5px' }}>FORESTY RESTURANT</h4>
              <p style={{ color: 'rgba(245,245,245,.5)', fontSize: '.85rem' }}>Main Food Street, Islamabad</p>
              <p style={{ color: 'var(--yellow)', fontSize: '.8rem', marginTop: '8px', cursor: 'pointer' }}>Open on Google Maps →</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
