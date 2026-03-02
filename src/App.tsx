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
  User as UserIcon,
  Heart,
  LogOut,
  Check,
  AlertCircle
} from 'lucide-react';
import { auth, db, googleProvider } from './firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User as FirebaseUser // Aliased Firebase User type
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import { div } from 'motion/react-client';

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
          <span className="font-display text-primary font-bold text-xl tracking-tighter">ROYAL <span style={{ color: "white" }}>TACOS</span></span>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
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
                  <UserIcon className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={onLoginClick}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary border border-primary text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-transparent hover:text-primary transition-colors"
                >
                  LOGIN
                </motion.button>
                <motion.button
                  onClick={onLoginClick}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-transparent border border-primary text-primary px-6 py-2 rounded-full font-bold text-sm hover:bg-primary hover:text-white transition-colors"
                >
                  REGISTER
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:p-2 lg:hidden">
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
            className="lg:hidden bg-dark border-t border-white/5 overflow-hidden flex flex-col h-screen"
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
          src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=1920&h=1080&auto=format&fit=crop"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
        >
          <h1 className="text-6xl md:text-[7rem] lg:text-9xl font-black leading-[0.85]">
            <span className="text-primary">Flavor Worth</span> <br />
            Coming Back
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl"
        >
          <p className="text-base md:text-lg text-white/60 mb-10 leading-relaxed">
            Experience the authentic taste of Sefrou. Premium ingredients, bold flavors, and the royal treatment you deserve.
          </p>

          <div className="flex flex-col md:flex-row gap-4">
            <a href="#reservation" className="w-full md:w-auto bg-primary text-dark px-8 py-4 rounded-full font-black text-sm md:text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3 orange-glow whitespace-nowrap">
              BOOK TABLE <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#menu" className="w-full md:w-auto bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-black text-sm md:text-lg hover:bg-white/10 transition-colors flex items-center justify-center whitespace-nowrap">
              CHECK MENU
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
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative">
          <motion.div style={{ y: imgY, scale: imgScale }}>
            <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=400&h=600&auto=format&fit=crop" alt="Restaurant Vibe" className="rounded-[40px] w-full h-80 object-cover mt-12" referrerPolicy="no-referrer" />
          </motion.div>
          <motion.div className="hidden lg:block" style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]), scale: imgScale }}>
            <img src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=400&h=600&auto=format&fit=crop" alt="Food Prep" className="rounded-[40px] w-full h-80 object-cover" referrerPolicy="no-referrer" />
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
      icon: <UserIcon className="w-8 h-8" />,
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
          <h2 className="text-4xl md:text-6xl font-display font-light mb-4">We Provide Elegant Service</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
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
    { id: 1, name: "Royal Tacos", price: 35, desc: "Our signature taco with double meat and secret sauce.", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 2, name: "Tacos Royal", price: 40, desc: "The ultimate taco experience with extra cheese.", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 3, name: "Tiramisu", price: 15, desc: "Homemade Italian delight. Best in town.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 4, name: "Panini Mixte", price: 25, desc: "Grilled to perfection with fresh fillings.", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 5, name: "Royal Burger", price: 30, desc: "Juicy beef patty with caramelized onions.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 6, name: "Gratin", price: 45, desc: "Creamy, cheesy, and absolutely delicious.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&h=400&auto=format&fit=crop" },
  ];

  return (
    <section id="menu" className="py-32 bg-dark-lighter">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Our Menu</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-none">ROYAL <br /> <span className="text-stroke">SELECTION</span></h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-8 mb-16">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-dark border border-white/5"
            >
              <div className="relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full max-h-[250px] object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => onToggleSave(item.id)}
                  className={`absolute top-4 right-4 p-2 cursor-pointer rounded-full backdrop-blur-md transition-all ${savedItems.includes(item.id) ? 'bg-primary text-dark' : 'bg-black/40 text-white hover:bg-primary/20'}`}
                >
                  <Heart className={`w-4 h-4 ${savedItems.includes(item.id) ? 'fill-dark' : ''}`} />
                </button>
              </div>
              <div className="p-4 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-1">
                  <h3 className="text-base md:text-2xl w-full">{item.name}</h3>
                  <span className="flex justify-end w-full text-primary font-black text-sm md:text-xl whitespace-nowrap">{item.price} MAD</span>
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
          <button className="bg-white/5 border border-white/10 px-10 py-5 whitespace-nowrap rounded-full font-black text-lg hover:bg-primary hover:text-dark transition-all flex items-center gap-3">
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
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1920&h=1080&auto=format&fit=crop" alt="Reservation Background" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
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
            className="bg-black/50 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
          >
            <h3 className="lg:hidden text-2xl text-white uppercase mb-8 text-center">Reserve Your Table</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Full Name</label>
                <input type="text" placeholder="Joe Doe" className="w-full  border border-white/30 rounded-lg px-4 py-3 outline-none focus:border-primary" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Email Address</label>
                <input type="email" placeholder="contact@royaltacos.com" className="w-full border border-white/30 rounded-lg px-4 py-3 outline-none focus:border-primary" />
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="space-y-2 w-full">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Date</label>
                  <input type="date" className="w-full bg-dark/5 border border-white/50 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                </div>
                <div className="space-y-2 w-full">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Time</label>
                  <input type="time" className="w-full bg-dark/5 border border-white/50 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Number of Guests</label>
                <select name="guests" id="guests" className="w-full border border-white/50 rounded-xl px-4 py-3 outline-none focus:border-primary">
                  <option value="1" className="bg-dark">1</option>
                  <option value="2" className="bg-dark">2</option>
                  <option value="3" className="bg-dark">3</option>
                  <option value="4" className="bg-dark">4</option>
                  <option value="5+" className="bg-dark">5+</option>
                </select>
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
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
      name: "Daniel L.",
      role: "Culinary Enthusiast",
      text: "Every bite was a masterpiece. You can taste the passion and precision in every dish. Absolutely worth it.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&auto=format&fit=crop"
    },
    {
      name: "Eva R.",
      role: "Lifestyle Blogger",
      text: "Exceptional service, world-class flavors, and a setting that makes you feel like royalty. My new favorite dining destination.",
      rating: 5,
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop"
    }
  ];

  return (
    <section id="reviews" className="py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between mb-20 gap-8">
          <h2 className="text-5xl md:text-6xl font-display font-light lg:mb-4">Praise from <br /> Our Patrons</h2>
          <p className="text-white/40 text-sm max-w-xs lg:text-right">Real voices. Honest praise. Unforgettable moments shared at our table.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col p-8 md:p-10 rounded-2xl bg-white/5 border border-white/10 lg:w-1/3 relative group hover:bg-white/[0.08] transition-all"
            >
              <div className="flex items-center gap-4 mb-8">
                <img src={r.img} alt={r.name} className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-lg">{r.name}</h4>
                  <p className="text-xs text-primary uppercase tracking-widest">{r.role}</p>
                </div>
              </div>
              <div className="flex flex-col h-full justify-between">
                <p className="text-white/70 leading-relaxed mb-6">"{r.text}"</p>
                <div className="flex gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                  ))}
                </div>
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

          <div className="rounded-2xl overflow-hidden border border-white/10 h-[500px] shadow-2xl">
            <iframe
              src="https://maps.google.com/maps?q=Snack%20Royal%20Tacos,%20Sefrou&t=&z=15&ie=UTF8&iwloc=&output=embed"
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
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

          <div className="md:w-[150%] lg:w-full">
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
          <p>© 2026 Royal Tacos. All rights reserved.</p>
          <p>made by <strong>Said Fateh</strong></p>
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
  savedItems,
  user,
  userGender
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  savedItems: number[];
  user: FirebaseUser | null;
  userGender: string;
}) => {
  const menuItems: MenuItem[] = [
    { id: 1, name: "Royal Tacos", price: 35, desc: "Our signature taco with double meat and secret sauce.", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 2, name: "Tacos Royal", price: 40, desc: "The ultimate taco experience with extra cheese.", img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 3, name: "Tiramisu", price: 15, desc: "Homemade Italian delight. Best in town.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 4, name: "Panini Mixte", price: 25, desc: "Grilled to perfection with fresh fillings.", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 5, name: "Royal Burger", price: 30, desc: "Juicy beef patty with caramelized onions.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=400&auto=format&fit=crop" },
    { id: 6, name: "Gratin", price: 45, desc: "Creamy, cheesy, and absolutely delicious.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&h=400&auto=format&fit=crop" },
  ];

  const savedMeals = menuItems.filter(item => savedItems.includes(item.id));

  const ProfileIcon = () => (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userGender === 'female' ? 'bg-pink-500/20' : 'bg-primary/20'
      }`}>
      {userGender === 'female' ? (
        <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
          <path d="M12 13v8" />
          <path d="M9 18h6" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="5" />
          <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
      )}
    </div>
  );

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
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-dark-lighter z-[70] shadow-2xl flex flex-col text-white border-l border-white/5"
          >
            {/* Profile Header */}
            <div className="p-8 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-4">
                <ProfileIcon />
                <div>
                  <h3 className="font-bold text-lg">{user?.displayName || 'Royal Guest'}</h3>
                  <p className="text-xs text-white/40">{user?.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight className="w-6 h-6" /></button>
            </div>

            {/* Saved Items */}
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Saved Meals</h4>
              <div className="space-y-3">
                {savedMeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-white/20">
                    <Heart className="w-12 h-12 mb-3" />
                    <p className="text-sm font-bold uppercase">No saved items</p>
                  </div>
                ) : (
                  savedMeals.map(item => (
                    <div key={item.id} className="flex gap-3 items-center bg-white/5 p-3 rounded-xl">
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1">
                        <span className="text-sm font-bold">{item.name}</span>
                        <p className="text-xs text-primary font-bold">{item.price} MAD</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Logout */}
            <div className="p-8 pb-[calc(2rem+8px)] border-t border-white/5">
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 p-4 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-bold uppercase tracking-widest text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Log Out
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
  onLogin,
  onGoogleSignIn,
  onEmailSignIn,
  onEmailSignUp,
  onError
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onGoogleSignIn: () => void;
  onEmailSignIn: (email: string, pass: string) => void;
  onEmailSignUp: (email: string, pass: string, name: string, gender: string) => void;
  onError: (message: string) => void;
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onEmailSignIn(email, password);
    } else {
      if (password !== confirmPassword) {
        onError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        onError('Password must be at least 6 characters.');
        return;
      }
      onEmailSignUp(email, password, name, gender);
    }
  };

  const inputClass = "w-full bg-dark border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-primary transition-colors text-white text-sm";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/80 backdrop-blur-md z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto w-[90%] max-w-4xl h-fit max-h-[90vh] bg-dark rounded-[32px] z-[90] overflow-hidden flex shadow-2xl border border-white/5"
          >
            <div className="hidden md:block md:w-1/2 relative">
              <img src="https://picsum.photos/seed/auth-vibe/800/1000" alt="Auth Vibe" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60" />
              <div className="absolute bottom-12 left-12">
                <h2 className="text-4xl font-black uppercase text-white mb-2">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
                <p className="text-white/60">{isLogin ? 'Sign in to continue your royal journey.' : 'Create your account and start ordering.'}</p>
              </div>
            </div>

            <div className="w-full md:w-1/2 py-8 px-4 md:p-10 flex flex-col justify-center bg-dark-lighter overflow-y-auto max-h-[90vh]">
              <div className="text-center md:text-left mb-6">
                <h2 className="text-2xl font-black uppercase text-white">{isLogin ? 'Sign In' : 'Create Account'}</h2>
                <p className="text-white/40 text-sm">Enter your details below to proceed.</p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit}>
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />
                {!isLogin && (
                  <>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                    <div>
                      <label className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2 block">Gender</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setGender('male')}
                          className={`flex-1 py-3 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all ${gender === 'male'
                            ? 'bg-primary/20 border-primary text-primary'
                            : 'bg-dark border-white/10 text-white/40 hover:border-white/20'
                            }`}
                        >
                          ♂ Male
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('female')}
                          className={`flex-1 py-3 rounded-xl border text-sm font-bold uppercase tracking-wider transition-all ${gender === 'female'
                            ? 'bg-pink-500/20 border-pink-400 text-pink-400'
                            : 'bg-dark border-white/10 text-white/40 hover:border-white/20'
                            }`}
                        >
                          ♀ Female
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between text-xs text-white/40">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-primary" /> Remember me
                    </label>
                    <button type="button" className="hover:text-primary transition-colors">Forgot password?</button>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-6">
                  <button type="submit" className="w-full bg-primary text-dark py-3.5 rounded-full font-black text-base hover:scale-[1.02] transition-transform orange-glow">
                    {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                  </button>

                  <div className="flex items-center gap-4 my-1">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-white/20 text-xs font-bold uppercase">OR</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>

                  <button
                    type="button"
                    onClick={onGoogleSignIn}
                    className="w-full bg-white/5 border border-white/10 text-white py-3.5 rounded-full font-bold text-sm hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    CONTINUE WITH GOOGLE
                  </button>
                </div>
              </form>

              <div className="text-center mt-6">
                <button
                  onClick={() => { setIsLogin(!isLogin); setConfirmPassword(''); setGender('male'); }}
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

const Toast = ({
  message,
  type,
  onClose
}: {
  message: string,
  type: 'success' | 'error' | 'info',
  onClose: () => void
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-8 right-8 z-[100] flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl min-w-[300px] max-w-[400px] ${type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
        type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
          'bg-blue-500/10 border-blue-500/20 text-blue-200'
        }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${type === 'error' ? 'bg-red-500/20' :
        type === 'success' ? 'bg-emerald-500/20' :
          'bg-blue-500/20'
        }`}>
        {type === 'error' ? <X className="w-5 h-5" /> :
          type === 'success' ? <Check className="w-5 h-5" /> :
            <AlertCircle className="w-5 h-5" />}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors opacity-40 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userGender, setUserGender] = useState<string>('male');
  const [notifications, setNotifications] = useState<{ id: string; message: string; type: 'success' | 'error' | 'info' }[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Block sync effect from writing empty data while we load from Firestore
        setIsInitialLoad(true);
        setUser(firebaseUser);
        setIsLoggedIn(true);

        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setCart(data.cart || []);
            setSavedItems(data.savedItems || []);
            setUserGender(data.gender || 'male');
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
        // Now allow sync effect to run
        setIsInitialLoad(false);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setCart([]);
        setSavedItems([]);
        setIsInitialLoad(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync Data to Firestore
  useEffect(() => {
    if (user && !isInitialLoad) {
      const syncData = async () => {
        await setDoc(doc(db, 'users', user.uid), {
          cart,
          savedItems,
          email: user.email,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      };

      const timeoutId = setTimeout(syncData, 1000); // Debounce sync
      return () => clearTimeout(timeoutId);
    }
  }, [cart, savedItems, user, isInitialLoad]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsAuthModalOpen(false);
      addNotification("Welcome to Royal Tacos!", "success");
    } catch (error) {
      console.error("Google Sign In Error:", error);
      const message = error instanceof FirebaseError ? error.message : "Failed to sign in with Google.";
      addNotification(message, "error");
    }
  };

  const handleEmailSignIn = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthModalOpen(false);
      addNotification("Successfully signed in!", "success");
    } catch (error) {
      console.error("Email Sign In Error:", error);
      let message = "Invalid email or password.";
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') message = "Account not found.";
        else if (error.code === 'auth/wrong-password') message = "Incorrect password.";
        else message = error.message;
      }
      addNotification(message, "error");
    }
  };

  const handleEmailSignUp = async (email: string, pass: string, name: string, gender: string) => {
    try {
      console.log('Attempting sign up with email:', email);
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      console.log('Firebase Auth user created:', res.user.uid);
      await setDoc(doc(db, 'users', res.user.uid), {
        name,
        email,
        gender,
        cart: [],
        savedItems: [],
        createdAt: new Date().toISOString()
      });
      setUserGender(gender);
      setIsAuthModalOpen(false);
      addNotification("Account created successfully!", "success");
    } catch (error: any) {
      console.error("Sign Up Error:", error);
      console.error("Error code:", error?.code);
      console.error("Error message:", error?.message);
      let message = "Failed to create account.";
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') message = "This email is already registered. Try signing in instead.";
        else if (error.code === 'auth/weak-password') message = "Password should be at least 6 characters.";
        else if (error.code === 'auth/invalid-email') message = "Please enter a valid email address.";
        else message = error.message;
      }
      addNotification(message, "error");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setIsProfileOpen(false);
    addNotification("Logged out successfully.", "info");
  };

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
        onLogout={logout}
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
        onLogout={logout}
        savedItems={savedItems}
        user={user}
        userGender={userGender}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => setIsLoggedIn(true)}
        onGoogleSignIn={handleGoogleSignIn}
        onEmailSignIn={handleEmailSignIn}
        onEmailSignUp={handleEmailSignUp}
        onError={(msg) => addNotification(msg, 'error')}
      />

      {/* Notifications */}
      <div className="fixed top-0 right-0 p-8 space-y-4 pointer-events-none z-[100]">
        <AnimatePresence>
          {notifications.map((n) => (
            <div key={n.id} className="pointer-events-auto">
              <Toast
                message={n.message}
                type={n.type}
                onClose={() => removeNotification(n.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,0,0.05),transparent_70%)]" />
      </div>
    </div>
  );
}
