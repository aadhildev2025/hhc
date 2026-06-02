import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar, FiTruck, FiLayers } from 'react-icons/fi';
import SEO from '../components/SEO';

const useReveal = () => {
    useEffect(() => {
        const targets = document.querySelectorAll('.reveal');
        const io = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } }),
            { threshold: 0.12 }
        );
        targets.forEach(t => io.observe(t));
        return () => io.disconnect();
    }, []);
};

const About = () => {
    useReveal();

    const values = [
        { icon: <FiHeart />, title: 'Handcrafted with Love', desc: 'Every piece is touched by human hands, ensuring a level of care that machines cannot replicate.' },
        { icon: <FiLayers />, title: 'Sustainable Quality', desc: 'We prioritize natural materials and sustainable practices, creating beautiful eco-friendly items.' },
        { icon: <FiStar />, title: 'Unique Artistry', desc: 'We collaborate with local artisans to bring you one-of-a-kind treasures for your living spaces.' },
        { icon: <FiTruck />, title: 'Community Driven', desc: 'By choosing us, you directly support a community of makers and preserve traditional handicrafts.' },
    ];

    const timeline = [
        { year: '2024', title: 'The Dream Begins', desc: 'Started in a small home studio, crafting gifts for friends and family.' },
        { year: '2025', title: 'Going Online', desc: 'Launched our online store and connected with artisans across Sri Lanka.' },
        { year: '2026', title: 'Growing Community', desc: 'Over 1,000 happy homes served. Expanding our collection every season.' },
    ];

    return (
        <div style={{ background: 'var(--brand-cream)', paddingTop: '5rem' }}>
            <SEO title="Our Story" description="Learn about HomeHeartCreation's journey from a small home studio in Sri Lanka to a community of artisans crafting soulful home decor." url="/about" />

            {/* HERO */}
            <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&q=80&w=1800" alt="About Hero" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'rgba(28,20,16,0.62)' }} />
                <div className="relative z-10 text-center px-6 space-y-5 animate-slide-down max-w-2xl mx-auto">
                    <span className="section-label" style={{ color: 'var(--brand-rose-light)' }}>Who We Are</span>
                    <h1 className="font-serif text-white font-semibold" style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.05 }}>Our Story</h1>
                    <p className="text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>Turning houses into homes, one handmade treasure at a time.</p>
                    <div className="h-px w-16 mx-auto rounded-full" style={{ background: 'var(--brand-rose)' }} />
                </div>
            </section>

            {/* NARRATIVE + TIMELINE */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div className="reveal space-y-6">
                    <span className="section-label">Where It All Began</span>
                    <h2 className="section-title">A Small Studio,<br />A Big <span style={{ color: 'var(--brand-rose)', fontStyle: 'italic' }}>Dream</span></h2>
                    <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--brand-muted)' }}>
                        <p>HomeHeartCreation was born out of a simple realization: in a world of mass-produced objects, people yearn for the personal touch. We started in a small home studio, crafting gifts for friends and family.</p>
                        <p>What began as a hobby soon blossomed into a passion project. We saw how a handwoven wall hanging could transform the mood of a room, bringing calm and comfort.</p>
                        <p>Today, we serve as a bridge between talented local artisans and modern homes. Each product is selected for its artistry, quality, and the heart behind its creation.</p>
                    </div>
                    <Link to="/shop" className="btn-primary inline-flex px-8 mt-2">Explore Our Collection</Link>
                </div>
                <div className="reveal relative">
                    <div className="absolute top-0 bottom-0 left-6 w-px" style={{ background: 'var(--brand-border)' }} />
                    {timeline.map((item, i) => (
                        <div key={i} className="flex gap-6 pb-10 last:pb-0 relative">
                            <div className="shrink-0 mt-1">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 relative text-white font-bold" style={{ background: 'var(--brand-rose)', fontSize: '0.65rem' }}>{item.year}</div>
                            </div>
                            <div className="glass-card p-5 flex-grow">
                                <h4 className="font-serif font-semibold text-base mb-1" style={{ color: 'var(--brand-dark)' }}>{item.title}</h4>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* VALUES */}
            <section className="py-24" style={{ background: 'var(--brand-linen)' }}>
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-14 reveal">
                        <span className="section-label">What Drives Us</span>
                        <h2 className="section-title mt-3">Our Core Values</h2>
                        <div className="divider-rose mx-auto mt-4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="reveal glass-card p-8 rounded-3xl"
                                style={{ animationDelay: `${i * 100}ms`, transition: 'transform 0.3s, box-shadow 0.3s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 48px rgba(28,20,16,0.1)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5" style={{ background: 'rgba(201,123,94,0.1)', color: 'var(--brand-rose)' }}>{v.icon}</div>
                                <h3 className="font-serif font-semibold text-base mb-3" style={{ color: 'var(--brand-dark)' }}>{v.title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--brand-muted)' }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* MISSION */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto reveal space-y-8">
                    <span className="section-label">Our Mission</span>
                    <h2 className="font-serif font-semibold" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--brand-dark)', lineHeight: 1.4 }}>
                        "To inspire creativity and bring a touch of soulful artistry into every home through sustainable, hand-crafted treasures."
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,123,94,0.12)', color: 'var(--brand-rose)' }}><FiHeart /></div>
                        <span className="font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--brand-muted)' }}>Made with Heart</span>
                    </div>
                </div>
            </section>

            {/* GALLERY STRIP */}
            <div className="overflow-hidden pb-8">
                <div className="flex gap-3 px-6 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                    {['photo-1582555172866-f73bb12a2ab3', 'photo-1485955900006-10f4d324d411', 'photo-1511795409834-ef04bbd61622', 'photo-1603006905003-be475563bc59', 'photo-1524758631624-e2822e304c36'].map((id, i) => (
                        <img key={i} src={`https://images.unsplash.com/${id}?w=400&q=80`} alt="" className="h-52 w-64 object-cover rounded-2xl shrink-0 hover:scale-105 transition-transform duration-500" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
