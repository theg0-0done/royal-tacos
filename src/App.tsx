/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { 
  Star, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronRight, 
  Instagram, 
  Facebook, 
  Twitter, 
  Menu as MenuIcon, 
  X, 
  ArrowRight,
  Utensils,
  Truck,
  ShoppingBag,
  Quote,
  ShoppingCart,
  ChevronLeft,
  Plus,
  Minus,
  Trash2,
  User,
  Heart
} from 'lucide-react';

// --- Types ---

interface MenuItem {
  id: number;
  name: string;
  price: number;
  desc: string;
  img: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// --- Components ---

const Navbar = ({ 
  cartCount, 
  onCartClick, 
  isLoggedIn, 
  onLoginClick,
  onProfileClick,
  onLogout
}: { 
  cartCount: number; 
  onCartClick: () => void; 
  isLoggedIn: boolean; 
  onLoginClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'Menu', href: '#menu' },
    { name: 'Reservation', href: '#reservation' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark/90 backdrop-blur-lg py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="font-display font-bold text-xl tracking-tighter">ROYAL <span className="text-primary">TACOS</span></span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest"
            >
              {link.name}
            </motion.a>
          ))}
          
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <button 
                  onClick={onCartClick}
                  className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-dark text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={onProfileClick}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-dark transition-all"
                >
                  <User className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button onClick={onLoginClick} className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Login</button>
                <motion.button
                  onClick={onLoginClick}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary text-dark px-6 py-2 rounded-full font-bold text-sm hover:bg-white transition-colors"
                >
                  REGISTER
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          {isLoggedIn && (
            <button 
              onClick={onCartClick}
              className="relative p-2"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-dark text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <button className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark border-t border-white/5 overflow-hidden flex flex-col h-screen"
          >
            <div className="flex flex-col p-8 gap-8 flex-1">
              {isLoggedIn ? (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-dark font-black">JD</div>
                    <div>
                      <h4 className="font-bold uppercase">John Doe</h4>
                      <p className="text-xs text-white/40">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="h-px bg-white/5 w-full" />
                </div>
              ) : null}

              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-display uppercase tracking-widest hover:text-primary transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="mt-auto pb-20">
                {isLoggedIn ? (
                  <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full py-4 rounded-full border border-red-500/50 text-red-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" /> LOGOUT
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="text-white w-full py-4 rounded-full font-bold border border-white/10 uppercase tracking-widest">LOGIN</button>
                    <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="bg-primary text-dark w-full py-4 rounded-full font-bold uppercase tracking-widest">REGISTER</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Full Hero Image Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/hero-taco/1920/1080" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] mb-6 uppercase">
            SNACK <br />
            <span className="text-primary">ROYAL</span> <br />
            TACOS
          </h1>
          
          <p className="text-base md:text-lg text-white/60 max-w-sm mb-10 leading-relaxed">
            Experience the authentic taste of Sefrou. Premium ingredients, bold flavors, and the royal treatment you deserve.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <a href="#menu" className="w-full md:w-auto bg-primary text-dark px-8 py-4 rounded-full font-black text-sm md:text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3 orange-glow whitespace-nowrap">
              VIEW MENU <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#about" className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-black text-sm md:text-lg hover:bg-white/10 transition-colors flex items-center justify-center whitespace-nowrap">
              OUR STORY
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9]);

  return (
    <section id="about" ref={containerRef} className="py-32 bg-dark-lighter relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <motion.div style={{ y: imgY, scale: imgScale }}>
            <img src="https://picsum.photos/seed/resto1/400/600" alt="Restaurant Vibe" className="rounded-[40px] w-full h-80 object-cover mt-12" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div className="hidden md:block" style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]), scale: imgScale }}>
            <img src="https://picsum.photos/seed/resto2/400/600" alt="Food Prep" className="rounded-[40px] w-full h-80 object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Our Story</span>
          <h2 className="text-5xl md:text-6xl font-black mb-8 uppercase leading-tight">
            THE ROYAL <br /> <span className="text-stroke">EXPERIENCE</span>
          </h2>
          <p className="text-lg text-white/60 mb-8 leading-relaxed">
            Located in the heart of Sefrou, Snack Royal Tacos has been serving the community with passion for years. We believe that fast food doesn't have to mean low quality. Every taco, burger, and panini is crafted with the freshest local ingredients and a secret blend of spices that keeps our customers coming back.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-primary font-black text-3xl mb-1">100%</h4>
              <p className="text-sm uppercase tracking-widest opacity-50">Fresh Ingredients</p>
            </div>
            <div>
              <h4 className="text-primary font-black text-3xl mb-1">FAST</h4>
              <p className="text-sm uppercase tracking-widest opacity-50">Delivery Service</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Delicious Food",
      desc: "Our dishes are full of fresh, bold flavors that you'll love."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Relaxing",
      desc: "Enjoy your meal in a cozy and welcoming for every occasion."
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Friendly Service",
      desc: "Dedicated to ensuring seamless service with available."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fresh Ingredients",
      desc: "We use best freshest ingredients to make every dish perfect."
    }
  ];

  return (
    <section id="features" className="py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Why Choose Us</span>
          <h2 className="text-4xl md:text-6xl font-display font-light mb-4">We Provide Elegant Service <br /> for People</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold mb-2 uppercase tracking-widest">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed max-w-[200px]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Menu = ({ 
  onAddToCart, 
  isLoggedIn, 
  savedItems, 
  onToggleSave 
}: { 
  onAddToCart: (item: MenuItem) => void; 
  isLoggedIn: boolean; 
  savedItems: number[]; 
  onToggleSave: (id: number) => void;
}) => {
  const menuItems: MenuItem[] = [
    { id: 1, name: "Royal Tacos", price: 35, desc: "Our signature taco with double meat and secret sauce.", img: "https://picsum.photos/seed/m1/400/400" },
    { id: 2, name: "Tacos Royal", price: 40, desc: "The ultimate taco experience with extra cheese.", img: "https://picsum.photos/seed/m2/400/400" },
    { id: 3, name: "Tiramisu", price: 15, desc: "Homemade Italian delight. Best in town.", img: "https://picsum.photos/seed/m3/400/400" },
    { id: 4, name: "Panini Mixte", price: 25, desc: "Grilled to perfection with fresh fillings.", img: "https://picsum.photos/seed/m4/400/400" },
    { id: 5, name: "Royal Burger", price: 30, desc: "Juicy beef patty with caramelized onions.", img: "https://picsum.photos/seed/m5/400/400" },
    { id: 6, name: "Gratin", price: 45, desc: "Creamy, cheesy, and absolutely delicious.", img: "https://picsum.photos/seed/m6/400/400" },
  ];

  return (
    <section id="menu" className="py-32 bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Our Menu</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">ROYAL <br /> <span className="text-stroke">SELECTION</span></h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-16">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-[24px] md:rounded-[32px] bg-dark border border-white/5"
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => onToggleSave(item.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${savedItems.includes(item.id) ? 'bg-primary text-dark' : 'bg-black/40 text-white hover:bg-primary/20'}`}
                >
                  <Heart className={`w-5 h-5 ${savedItems.includes(item.id) ? 'fill-dark' : ''}`} />
                </button>
              </div>
              <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-1">
                  <h3 className="text-base md:text-2xl font-black uppercase line-clamp-1">{item.name}</h3>
                  <span className="text-primary font-black text-sm md:text-xl whitespace-nowrap">{item.price} MAD</span>
                </div>
                {isLoggedIn && (
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="w-full py-3 md:py-4 rounded-full bg-white/5 border border-white/10 font-bold uppercase tracking-widest hover:bg-primary hover:text-dark transition-colors text-[10px] md:text-sm"
                  >
                    Add to Order
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-white/5 border border-white/10 px-10 py-5 rounded-full font-black text-lg hover:bg-primary hover:text-dark transition-all flex items-center gap-3">
            DOWNLOAD FULL MENU (PDF) <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

const Reservation = () => {
  return (
    <section id="reservation" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://picsum.photos/seed/reserve/1920/1080" alt="Reservation Background" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 leading-tight">RESERVE <br /> YOUR <span className="text-primary">TABLE</span></h2>
            <p className="text-lg text-white/50 leading-relaxed max-w-md">
              Planning a special event or just a royal dinner? Book your table in advance to ensure the best experience.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[48px] shadow-2xl text-dark"
          >
            <h3 className="text-2xl font-black uppercase mb-8 text-center">Reserve Your Table</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Choose Location</label>
                <select className="w-full bg-dark/5 border border-dark/10 rounded-xl px-4 py-3 outline-none focus:border-primary">
                  <option>Select your preferred dining spot</option>
                  <option>Sefrou Main Branch</option>
                  <option>Outdoor Terrace</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Guests</label>
                <select className="w-full bg-dark/5 border border-dark/10 rounded-xl px-4 py-3 outline-none focus:border-primary">
                  <option>How many seats would you like?</option>
                  <option>1 Person</option>
                  <option>2 People</option>
                  <option>4 People</option>
                  <option>6+ People</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Date</label>
                  <input type="date" className="w-full bg-dark/5 border border-dark/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Time</label>
                  <input type="time" className="w-full bg-dark/5 border border-dark/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                </div>
              </div>
              
              <button className="w-full bg-primary text-dark py-5 rounded-full font-black text-lg hover:scale-[1.02] transition-transform shadow-xl mt-4">
                CONFIRM RESERVATION
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: "Sophia M.",
      role: "Food Critic",
      text: "A truly unforgettable experience. From the ambiance to the plating, everything was flawless. The tasting menu was a journey in itself.",
      rating: 5,
      img: "https://picsum.photos/seed/p1/100/100"
    },
    {
      name: "Daniel L.",
      role: "Culinary Enthusiast",
      text: "Every bite was a masterpiece. You can taste the passion and precision in every dish. Absolutely worth it.",
      rating: 5,
      img: "https://picsum.photos/seed/p2/100/100"
    },
    {
      name: "Eva R.",
      role: "Lifestyle Blogger",
      text: "Exceptional service, world-class flavors, and a setting that makes you feel like royalty. My new favorite dining destination.",
      rating: 5,
      img: "https://picsum.photos/seed/p3/100/100"
    }
  ];

  return (
    <section id="reviews" className="py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h2 className="text-5xl md:text-6xl font-display font-light mb-4">Praise from <br /> Our Patrons</h2>
          </div>
          <p className="text-white/40 text-sm max-w-xs text-right">Real voices. Honest praise. Unforgettable moments shared at our table.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative group hover:bg-white/[0.08] transition-all"
            >
              <div className="flex items-center gap-4 mb-8">
                <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-lg">{r.name}</h4>
                  <p className="text-xs text-primary uppercase tracking-widest">{r.role}</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed mb-6">"{r.text}"</p>
              <div className="flex gap-1">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-12 leading-none">FIND <br /> <span className="text-stroke">US HERE</span></h2>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MapPin />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest mb-1">Address</h4>
                  <p className="text-white/50">Rond point de Sidi Boumediane route el menzel, Boulevard Hassan 2, Sefrou</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest mb-1">Phone</h4>
                  <p className="text-white/50">06 43 04 98 21</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Clock />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest mb-1">Hours</h4>
                  <p className="text-white/50">Closed • Opens 12:30 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="rounded-[48px] overflow-hidden border border-white/10 h-[500px] shadow-2xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3314.44524276322!2d-4.8241342!3d33.8266266!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f9bcf72d6c22f%3A0xbe200c1809eafad7!2sSnack%20Royal%20Tacos!5e0!3m2!1sen!2sma!4v1771932979037!5m2!1sen!2sma" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-display font-black text-dark text-xl">R</div>
              <span className="font-display font-bold text-xl tracking-tighter">ROYAL <span className="text-primary">TACOS</span></span>
            </div>
            <p className="text-white/40 max-w-sm mb-8">
              The best tacos in Sefrou. Quality, taste, and service are our top priorities. Visit us for a royal experience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-dark transition-all"><Instagram /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-dark transition-all"><Facebook /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-dark transition-all"><Twitter /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/40">
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#menu" className="hover:text-primary transition-colors">Our Menu</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#reviews" className="hover:text-primary transition-colors">Reviews</a></li>
            </ul>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="font-bold uppercase tracking-widest mb-6">Send us a message</h4>
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Name" className="bg-white/5 border border-white/10 rounded-full px-6 py-3 outline-none focus:border-primary w-full" />
              <input type="email" placeholder="Email" className="bg-white/5 border border-white/10 rounded-full px-6 py-3 outline-none focus:border-primary w-full" />
              <textarea placeholder="Message" className="bg-white/5 border border-white/10 rounded-[24px] px-6 py-3 outline-none focus:border-primary w-full h-24 resize-none"></textarea>
              <button className="bg-primary text-dark py-3 rounded-full font-bold uppercase tracking-widest hover:scale-[1.02] transition-transform">Send</button>
            </form>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-white/20 text-sm">
          <p>© 2026 Snack Royal Tacos. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CartModal = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-dark-lighter z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">Your Order</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <ShoppingBag className="w-20 h-20 mb-4" />
                  <p className="text-xl font-bold uppercase">Cart is empty</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.img} alt={item.name} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h4 className="font-bold uppercase">{item.name}</h4>
                      <p className="text-primary font-black">{item.price} MAD</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center bg-white/5 rounded-full px-2">
                          <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-primary"><Minus className="w-4 h-4" /></button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-primary"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-white/20 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {items.length > 0 && (
              <div className="p-8 border-t border-white/5 bg-dark">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/40 uppercase tracking-widest">Total Cost</span>
                  <span className="text-3xl font-black text-primary">{total} MAD</span>
                </div>
                <button className="w-full bg-primary text-dark py-5 rounded-full font-black text-lg hover:scale-[1.02] transition-transform orange-glow">
                  CONFIRM ORDER
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ProfileModal = ({ 
  isOpen, 
  onClose, 
  onLogout,
  savedItems 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogout: () => void;
  savedItems: number[];
}) => {
  const menuItems: MenuItem[] = [
    { id: 1, name: "Royal Tacos", price: 35, desc: "Our signature taco with double meat and secret sauce.", img: "https://picsum.photos/seed/m1/400/400" },
    { id: 2, name: "Tacos Royal", price: 40, desc: "The ultimate taco experience with extra cheese.", img: "https://picsum.photos/seed/m2/400/400" },
    { id: 3, name: "Tiramisu", price: 15, desc: "Homemade Italian delight. Best in town.", img: "https://picsum.photos/seed/m3/400/400" },
    { id: 4, name: "Panini Mixte", price: 25, desc: "Grilled to perfection with fresh fillings.", img: "https://picsum.photos/seed/m4/400/400" },
    { id: 5, name: "Royal Burger", price: 30, desc: "Juicy beef patty with caramelized onions.", img: "https://picsum.photos/seed/m5/400/400" },
    { id: 6, name: "Gratin", price: 45, desc: "Creamy, cheesy, and absolutely delicious.", img: "https://picsum.photos/seed/m6/400/400" },
  ];

  const savedMeals = menuItems.filter(item => savedItems.includes(item.id));

  const sidebarLinks = [
    { icon: <MapPin className="w-4 h-4" />, name: 'Home', href: '#' },
    { icon: <User className="w-4 h-4" />, name: 'My Profile', href: '#' },
    { icon: <ShoppingBag className="w-4 h-4" />, name: 'My Vacancy', href: '#' },
    { icon: <Phone className="w-4 h-4" />, name: 'Message', href: '#' },
    { icon: <Star className="w-4 h-4" />, name: 'Subscription', href: '#' },
    { icon: <Clock className="w-4 h-4" />, name: 'Notification', href: '#' },
    { icon: <Utensils className="w-4 h-4" />, name: 'Setting', href: '#' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#1E3A8A] z-[70] shadow-2xl flex flex-col text-white"
          >
            <div className="p-8 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src="https://picsum.photos/seed/alex/100/100" alt="Profile" className="w-12 h-12 rounded-full border-2 border-white/20" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="font-bold text-lg">Alexandra</h3>
                  <p className="text-xs text-white/60">alexandra@royal.com</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 no-scrollbar">
              {sidebarLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="text-white/60 group-hover:text-white">{link.icon}</div>
                  <span className="font-medium">{link.name}</span>
                </a>
              ))}

              <div className="pt-8 px-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Saved Meals</h4>
                <div className="space-y-3">
                  {savedMeals.map(item => (
                    <div key={item.id} className="flex gap-3 items-center bg-white/5 p-2 rounded-xl">
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <span className="text-xs font-bold uppercase">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-8 border-t border-white/10">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const AuthModal = ({ 
  isOpen, 
  onClose, 
  onLogin 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: () => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-[80]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-4xl h-fit bg-dark-lighter border border-white/10 rounded-[48px] z-[90] shadow-2xl overflow-hidden flex flex-col md:flex-row"
          >
            <div className="hidden md:block md:w-1/2 relative">
              <img src="https://picsum.photos/seed/auth-vibe/800/1000" alt="Auth Vibe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12">
                <h2 className="text-4xl font-black uppercase text-white mb-2">Welcome Back</h2>
                <p className="text-white/60">Sign in to continue your royal journey.</p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center bg-dark-lighter">
              <div className="text-center md:text-left mb-10">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-display font-black text-dark text-2xl mb-6 mx-auto md:mx-0">R</div>
                <h2 className="text-3xl font-black uppercase text-white">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                <p className="text-white/40 mt-2">Enter your details below to proceed.</p>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); onClose(); }}>
                {!isLogin && (
                  <input type="text" placeholder="Full Name" className="w-full bg-dark border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white" required />
                )}
                <input type="email" placeholder="Email Address" className="w-full bg-dark border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white" required />
                <input type="password" placeholder="Password" className="w-full bg-dark border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-colors text-white" required />
                
                <div className="flex items-center justify-between text-xs text-white/40">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-primary" /> Remember me
                  </label>
                  <button type="button" className="hover:text-primary transition-colors">Forgot password?</button>
                </div>

                <button className="w-full bg-primary text-dark py-5 rounded-full font-black text-lg hover:scale-[1.02] transition-transform orange-glow mt-4">
                  {isLogin ? 'SIGN IN' : 'SIGN UP'}
                </button>
              </form>
              
              <div className="text-center mt-8">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-bold text-white/40 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  {isLogin ? "New here? Create an account" : "Already have an account? Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<number[]>([]);

  const addToCart = (item: MenuItem) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleSaveItem = (id: number) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setSavedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) => prev.map((i) => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="relative">
      <Navbar 
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)} 
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onLogout={() => { setIsLoggedIn(false); setCart([]); }}
      />
      <Hero />
      <About />
      <Features />
      <Menu 
        onAddToCart={addToCart} 
        isLoggedIn={isLoggedIn} 
        savedItems={savedItems}
        onToggleSave={toggleSaveItem}
      />
      <Reservation />
      <Testimonials />
      <Contact />
      <Footer />
      
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />

      <ProfileModal 
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={() => { setIsLoggedIn(false); setIsProfileOpen(false); setCart([]); }}
        savedItems={savedItems}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => setIsLoggedIn(true)}
      />
      
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.05),transparent_70%)]" />
      </div>
    </div>
  );
}
