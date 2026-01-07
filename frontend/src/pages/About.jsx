import { FiHeart, FiStar, FiTruck, FiLayers } from 'react-icons/fi';
import SEO from '../components/SEO';

const About = () => {
    const values = [
        { icon: <FiHeart />, title: "Handcrafted with Love", desc: "Every piece we offer is touched by human hands, ensuring a level of care and soul that machines simply cannot replicate." },
        { icon: <FiLayers />, title: "Sustainable Quality", desc: "We prioritize natural materials and sustainable practices, creating items that are beautiful for your home and kind to the earth." },
        { icon: <FiStar />, title: "Unique Artistry", desc: "We collaborate with local artisans to bring you one-of-a-kind treasures that add a distinct character to your living spaces." },
        { icon: <FiTruck />, title: "Community Driven", desc: "By choosing HomeHeartCreation, you are directly supporting a community of makers and preserving traditional handicrafts." }
    ];

    return (
        <div className="min-h-screen pt-24 bg-brand-offwhite">
            <SEO
                title="Our Story"
                description="Learn about HomeHeartCreation's journey. From a small home studio in Sri Lanka to a community of artisans crafting soulful home decor."
                url="/about"
            />
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center bg-brand-pink/10 overflow-hidden">
                <div className="absolute inset-0 bg-[url('http://localhost:5000/uploads/about-hero.png')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                <div className="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-6 animate-slide-down">
                    <h1 className="text-5xl md:text-7xl font-serif text-brand-dark leading-tight">Our Story</h1>
                    <p className="text-xl text-brand-dark/70 leading-relaxed font-medium">
                        Turning houses into homes, one handmade treasure at a time.
                    </p>
                    <div className="h-1 w-20 bg-brand-pink-dark mx-auto"></div>
                </div>
            </section>

            {/* Narrative */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center animate-slide-up delay-100">
                <div className="space-y-8">
                    <h2 className="text-4xl font-serif text-brand-dark">Where it all <span className="text-brand-blue-dark">began</span></h2>
                    <div className="space-y-6 text-lg text-brand-dark/70 leading-relaxed">
                        <p>
                            HomeHeartCreation was born out of a simple realization: in a world of mass-produced objects, people yearn for the personal touch. We started in a small home studio, crafting gifts for friends and family.
                        </p>
                        <p>
                            What began as a hobby soon blossomed into a passion project. We saw how a handwoven wall hanging or a hand-poured candle could transform the mood of a room, bringing a sense of calm and comfort.
                        </p>
                        <p>
                            Today, we serve as a bridge between talented local artisans and modern homes. Each product in our shop is selected for its artistry, quality, and the heart behind its creation.
                        </p>
                    </div>
                </div>
                <div className="relative">
                    <img
                        src="http://localhost:5000/uploads/about-workshop.png"
                        alt="Workshop"
                        className="rounded-3xl shadow-2xl"
                    />
                    <div className="absolute -bottom-8 -right-8 bg-brand-pink-dark p-8 rounded-3xl shadow-xl text-white hidden md:block">
                        <p className="text-3xl font-serif font-bold italic">"Crafting warmth since 2025"</p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="bg-brand-card/30 backdrop-blur-sm py-24 animate-slide-up delay-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-serif text-brand-dark">Our Values</h2>
                        <p className="text-brand-dark/60">What drives us every single day.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="bg-brand-card p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 border border-brand-border group">
                                <div className="w-14 h-14 bg-brand-pink/10 rounded-2xl flex items-center justify-center text-2xl text-brand-pink-dark mb-6 group-hover:scale-110 transition-transform">
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-bold text-brand-dark mb-4">{v.title}</h3>
                                <p className="text-sm text-brand-dark/60 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-4xl mx-auto px-6 text-center py-24 space-y-8 animate-slide-up delay-300">
                <h2 className="text-4xl font-serif text-brand-dark">Our Mission</h2>
                <p className="text-2xl text-brand-blue-dark leading-relaxed italic">
                    "To inspire creativity and bring a touch of soulful artistry into every home through sustainable, hand-crafted treasures."
                </p>
                <div className="pt-8 flex justify-center items-center space-x-4">
                    <div className="w-12 h-12 bg-brand-pink/20 rounded-full flex items-center justify-center text-brand-pink-dark text-2xl">
                        <FiHeart />
                    </div>
                    <span className="font-bold text-brand-dark tracking-widest uppercase text-sm">Made with heart</span>
                </div>
            </section>
        </div>
    );
};

export default About;
