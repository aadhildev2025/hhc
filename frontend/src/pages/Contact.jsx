import { FiMail, FiPhone, FiMapPin, FiInstagram } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../api/client';

const Contact = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
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
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-brand-offwhite">
            {/* Header */}
            <div className="bg-brand-card/30 backdrop-blur-sm py-20 px-6 text-center animate-slide-down border-b border-brand-border">
                <h1 className="text-5xl md:text-6xl font-serif text-brand-dark">Get in Touch</h1>
                <p className="mt-4 text-brand-dark/60 max-w-lg mx-auto">We'd love to hear from you. Whether you have a question about our products or just want to say hi!</p>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Form */}
                    <div className="bg-brand-card backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-lg border border-brand-border animate-slide-up delay-100 lg:order-2">
                        <h3 className="text-2xl font-serif text-brand-dark mb-8">Send us a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-dark/70">Name</label>
                                <input required type="text" className="w-full p-4 bg-brand-offwhite/50 border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-dark/70">Email</label>
                                <input required type="email" className="w-full p-4 bg-brand-offwhite/50 border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-dark/70">Subject</label>
                                <input required type="text" className="w-full p-4 bg-brand-offwhite/50 border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-brand-dark/70">Message</label>
                                <textarea required rows="6" className="w-full p-4 bg-brand-offwhite/50 border border-brand-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink-dark/50 text-brand-dark"></textarea>
                            </div>
                            <button type="submit" className="w-full btn-primary h-16 flex items-center justify-center space-x-3 text-lg font-bold shadow-lg shadow-brand-pink-dark/20">
                                <span>Send Message</span> <FiMail />
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12 animate-slide-up delay-200 lg:order-1">
                        <h2 className="text-4xl font-serif text-brand-dark">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-brand-pink/20 text-brand-pink-dark rounded-full flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                                    <FiMapPin />
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-dark">Our Studio</h4>
                                    <p className="text-brand-dark/60">173/B Madurankuliya Puttalam Sri Lanka</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-brand-blue/20 text-brand-blue-dark rounded-full flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                                    <FiMail />
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-dark">Email Us</h4>
                                    <p className="text-brand-dark/60">hello@homeheartcreation.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-brand-pink/20 text-brand-pink-dark rounded-full flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                                    <FiPhone />
                                </div>
                                <div>
                                    <h4 className="font-bold text-brand-dark">Call Us</h4>
                                    <p className="text-brand-dark/60">+94 76 060 1163</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-12 border-t border-brand-pink/10">
                            <h4 className="font-bold text-brand-dark uppercase tracking-widest text-xs">Follow Our Journey</h4>
                            <div className="flex space-x-6 text-3xl text-brand-blue-dark">
                                <a href="https://www.facebook.com/profile.php?id=61571315741297" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-all duration-300 hover:scale-110"><FaFacebook /></a>
                                <a href="https://www.instagram.com/homeheartcreation/?igsh=Y3RydDRhbmVkdzhv#" target="_blank" rel="noopener noreferrer" className="hover:text-brand-pink-dark transition-all duration-300 hover:scale-110"><FiInstagram /></a>
                                <a href="https://wa.me/94760601163?text=Hello%20HomeHeartCreation" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-all duration-300 hover:scale-110"><FaWhatsapp /></a>
                            </div>
                        </div>

                        {/* Google Maps */}
                        <div className="h-64 rounded-3xl overflow-hidden shadow-lg border border-brand-border">
                            <iframe
                                src="https://maps.google.com/maps?q=7.907996,79.801420&hl=en&z=15&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="HomeHeartCreation Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
