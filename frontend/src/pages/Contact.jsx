import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiSend } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../api/client';
import SEO from '../components/SEO';

const Contact = () => {
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        const formData = {
            name: e.target[0].value,
            email: e.target[1].value,
            subject: e.target[2].value,
            message: e.target[3].value,
        };
        try {
            await api.post('/messages', formData);
            toast.success('Message sent! We will get back to you soon.');
            e.target.reset();
        } catch (err) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const contactCards = [
        { icon: <FiMapPin />, label: 'Our Studio', value: '173/B Madurankuliya, Puttalam, Sri Lanka', color: 'var(--brand-rose)' },
        { icon: <FiMail />, label: 'Email Us', value: 'hello@homeheartcreation.com', color: 'var(--brand-sage)', href: 'mailto:hello@homeheartcreation.com' },
        { icon: <FiPhone />, label: 'Call Us', value: '+94 76 060 1163', color: 'var(--brand-rose)', href: 'tel:+94760601163' },
    ];

    return (
        <div style={{ background: 'var(--brand-cream)', paddingTop: '5rem' }}>
            <SEO title="Contact Us" description="Have questions? Get in touch with HomeHeartCreation." url="/contact" />

            {/* HEADER */}
            <div className="py-16 px-6 text-center" style={{ background: 'var(--brand-linen)', borderBottom: '1px solid var(--brand-border)' }}>
                <div className="max-w-xl mx-auto animate-slide-down">
                    <span className="section-label">Get in Touch</span>
                    <h1 className="section-title mt-3" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>We'd Love to Hear<br />From You</h1>
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
                        Whether you have a question about our products or want a custom order — we're here for you!
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* FORM */}
                    <div className="animate-slide-up delay-100 lg:order-2">
                        <div className="glass-card p-8 md:p-10 rounded-3xl">
                            <h3 className="font-serif font-semibold text-2xl mb-8" style={{ color: 'var(--brand-dark)' }}>Send Us a Message</h3>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {[
                                    { label: 'Your Name', type: 'text', placeholder: 'John Doe' },
                                    { label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                                    { label: 'Subject', type: 'text', placeholder: 'Custom order inquiry…' },
                                ].map((field, i) => (
                                    <div key={i}>
                                        <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>{field.label}</label>
                                        <input required type={field.type} placeholder={field.placeholder} className="input-base w-full" />
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--brand-muted)' }}>Message</label>
                                    <textarea required rows={5} placeholder="Tell us how we can help…" className="input-base w-full resize-none" />
                                </div>
                                <button type="submit" disabled={sending}
                                    className="btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                                    {sending ? 'Sending…' : <><FiSend size={16} /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="space-y-10 animate-slide-up delay-200 lg:order-1">
                        <div className="space-y-4">
                            {contactCards.map((c, i) => (
                                <a key={i} href={c.href || '#'} className={`flex items-start gap-5 p-5 rounded-2xl border transition-all duration-200 group ${c.href ? 'cursor-pointer' : ''}`}
                                    style={{ background: 'var(--brand-card-bg)', borderColor: 'var(--brand-border)' }}
                                    onMouseEnter={e => { if (c.href) { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.boxShadow = `0 8px 24px rgba(28,20,16,0.08)`; } }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.boxShadow = ''; }}>
                                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background: `${c.color}18`, color: c.color }}>{c.icon}</div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--brand-muted)' }}>{c.label}</p>
                                        <p className="text-sm font-medium" style={{ color: 'var(--brand-dark)' }}>{c.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Social */}
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--brand-muted)' }}>Follow Our Journey</p>
                            <div className="flex gap-3">
                                {[
                                    { icon: <FaFacebook size={20} />, href: 'https://www.facebook.com/share/1Besh5q7ZA/?mibextid=wwXIfr', hover: '#1877F2', label: 'Facebook' },
                                    { icon: <FiInstagram size={20} />, href: 'https://www.instagram.com/homeheartcreation/', hover: 'var(--brand-rose)', label: 'Instagram' },
                                    { icon: <FaWhatsapp size={20} />, href: 'https://wa.me/94760601163?text=Hello%20HomeHeartCreation', hover: '#25D366', label: 'WhatsApp' },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 px-5 py-3 rounded-xl border font-medium text-sm transition-all duration-200"
                                        style={{ borderColor: 'var(--brand-border)', color: 'var(--brand-dark)', background: 'var(--brand-card-bg)' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = s.hover; e.currentTarget.style.color = s.hover; e.currentTarget.style.background = `${s.hover}10`; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.color = 'var(--brand-dark)'; e.currentTarget.style.background = 'var(--brand-card-bg)'; }}>
                                        {s.icon} {s.label}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Map */}
                        <div className="rounded-2xl overflow-hidden border" style={{ height: '240px', borderColor: 'var(--brand-border)' }}>
                            <iframe src="https://maps.google.com/maps?q=7.907996,79.801420&hl=en&z=15&output=embed"
                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade" title="HomeHeartCreation Location" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
