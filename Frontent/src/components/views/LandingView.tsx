import React, { useState, useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';
import Marquee from '../animations/Marquee';
import { ShinyText, GlitchText, ScrambleText } from '../animations';
import { useStockSense } from '../../context/StockSenseContext';

gsap.registerPlugin(ScrollTrigger);
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Shield,
  Box,
  Truck,
  TrendingUp,
  BarChart3,
  Package,
  Zap,
  Star,
  Building2,
  Sliders,
  Play,
  UserCheck,
  Warehouse as WarehouseIcon,
  ShieldCheck,
  Clock,
  ArrowDownLeft,
  ArrowLeftRight,
  Database,
  QrCode,
  Lock,
  User,
  Check
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { setActiveView, showToast, login } = useStockSense();

  const [simulationTab, setSimulationTab] = useState<'inbound' | 'outbound' | 'locations' | 'matrix'>('inbound');
  const [isMockupLoading, setIsMockupLoading] = useState(false);
  const [demoEmail, setDemoEmail] = useState('');
  const dragRef = useRef<Map<HTMLElement, { startX: number; startY: number; isDragging: boolean }>>(new Map());

  // Lenis Smooth Scroll & GSAP ScrollTrigger Animations (Refactored to useGSAP)
  useGSAP(() => {
    // 1. Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Wrap all animations in matchMedia for Reduced Motion support (GSAP 3 Syntax Guard #26)
    let mm = gsap.matchMedia();

    mm.add({
      // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
      isDesktop: "(min-width: 800px)",
      isMobile: "(max-width: 799px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    }, (context) => {
      // context.conditions has a boolean property for each condition defined above
      let { isDesktop, reduceMotion } = context.conditions as any;

      // 1.5. Floating Navbar GSAP Scroll logic
      const showAnim = gsap.from('.floating-nav', { 
        yPercent: -150,
        paused: true,
        duration: 0.3,
        ease: "power2.inOut"
      }).progress(1);
      
      ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          if (self.direction === -1) showAnim.play();
          else if (self.direction === 1) showAnim.reverse();
        }
      });

      // 2. Animate Hero Section Elements
      gsap.fromTo('.hero-animate', 
        { y: reduceMotion ? 0 : 30, opacity: 0 },
        { y: 0, opacity: 1, duration: reduceMotion ? 0.4 : 1.2, stagger: 0.15, ease: 'power3.out' }
      );

      if (!reduceMotion && isDesktop) {
        // 2.5 Awwwards-style Parallax Hero Scroll (Only if no reduced motion & on desktop)
        gsap.to('.hero-video-bg', {
          scale: 1.1,
          opacity: 0,
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });

        gsap.to('.hero-content', {
          y: 150,
          opacity: 0,
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });

        // 3. Horizontal Scroll Pin for Architecture Cards
        let track = document.querySelector(".features-track") as HTMLElement;
        if (track) {
          let getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
          
          gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
            scrollTrigger: {
              trigger: "#features-pin",
              pin: true,
              scrub: 1,
              end: () => `+=${track.scrollWidth}`, // Much longer scroll distance for a smooth, full slide
              invalidateOnRefresh: true
            }
          });
        }
      } else if (isMobile || reduceMotion) {
        // Fallback for mobile/reduced motion: simple fade-in stagger instead of pinning
        gsap.fromTo('.feature-card',
          { opacity: 0, y: reduceMotion ? 0 : 30 },
          { 
            opacity: 1, 
            y: 0,
            duration: 0.8, 
            stagger: 0.1, 
            scrollTrigger: {
              trigger: "#features-pin",
              start: "top 70%"
            }
          }
        );
      }

      // 4. Clean fade-up for Integration Banners
      gsap.fromTo('.integration-card-animate',
        { 
          y: reduceMotion ? 0 : 40, 
          opacity: 0
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: reduceMotion ? 0.4 : 0.8, 
          stagger: 0.12, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#integrations',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 5. Live Simulation Dashboard Mockup Animation
      gsap.fromTo('.mockup-window',
        {
          opacity: 0,
          y: reduceMotion ? 0 : 80,
          scale: reduceMotion ? 1 : 0.95,
          rotateX: reduceMotion ? 0 : 15,
          transformPerspective: 1000
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: reduceMotion ? 0.4 : 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#operations',
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1
          }
        }
      );

      // 5b. Width/Height expand reveal on mockup window
      gsap.fromTo('.mockup-window',
        { 
          width: "0px", 
          height: "0px",
          opacity: 0
        },
        {
          width: "100%", 
          height: "auto",
          opacity: 1,
          duration: 0.8,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: '#operations',
            start: 'top 60%',
          }
        }
      );

      // 6. Integrations Cards Image Reveal (clipPath wipe)
      gsap.to(".integration-image", {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.15,
        scrollTrigger: {
          trigger: "#integrations",
          start: "top 70%",
        }
      });

      // 7. SplitText equivalent animation for Integrations Heading
      gsap.from(".split-word", {
        opacity: 0, 
        y: 40, 
        rotation: 5,
        duration: 0.6, 
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#integrations",
          start: "top 75%",
        }
      });
    });

    return () => {
      lenis.destroy();
      mm.revert(); // Reverts matchMedia animations properly!
    };
  }, []);

  // Run the requested skeleton animation on tab change
  useEffect(() => {
    setIsMockupLoading(true);
    // Reset background before animating to allow re-trigger
    gsap.set(".skeleton-line", { background: "rgba(51, 65, 85, 0.5)" }); // slate-700/50
    
    gsap.to(".skeleton-line", {
      background: "rgba(0,255,102,0.15)",
      backgroundImage: "none",
      stagger: 0.1, 
      duration: 0.3,
      yoyo: true,
      repeat: 5 // repeats for about 3 seconds
    });

    const timer = setTimeout(() => {
      setIsMockupLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [simulationTab]);

  // SVG Text "Draw" Animation (Mimics drawSVG)
  useGSAP(() => {
    const texts = document.querySelectorAll('.draw-text text');
    if (texts.length === 0) return;

    // We use a large dasharray number to cover the text outline length
    gsap.set(texts, { strokeDasharray: 1500, strokeDashoffset: 1500, fill: "transparent" });

    // Footer animation with scroll trigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'footer',
        start: 'top 80%'
      }
    });
    tl.to('.footer-draw text', { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" })
      .to('.footer-draw text', { fill: "rgba(255, 255, 255, 0.03)", duration: 0.8 }, "-=0.3");

    // Logo animation on load
    const logoTl = gsap.timeline();
    logoTl.to('.logo-draw text', { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.5 })
          .to('.logo-draw text', { fill: "#0F172A", duration: 0.8 }, "-=0.3");
  }, []);

  // Draggable effect — ONLY on the 4 warehouse cards
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.warehouse-card');
    const state = dragRef.current;

    const onPointerDown = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      card.setPointerCapture(e.pointerId);
      gsap.killTweensOf(card);
      state.set(card, { startX: e.clientX, startY: e.clientY, isDragging: true });
      card.style.cursor = 'grabbing';
      card.style.zIndex = '50';
      gsap.to(card, { scale: 1.05, boxShadow: '0 25px 60px rgba(0,0,0,0.15)', duration: 0.2 });
    };

    const onPointerMove = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      const s = state.get(card);
      if (!s?.isDragging) return;
      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;
      gsap.set(card, { x: dx, y: dy, rotation: dx * 0.05 });
    };

    const onPointerUp = (e: PointerEvent) => {
      const card = e.currentTarget as HTMLElement;
      const s = state.get(card);
      if (!s?.isDragging) return;
      s.isDragging = false;
      card.style.cursor = 'grab';

      const dx = e.clientX - s.startX;
      const dy = e.clientY - s.startY;

      if (Math.abs(dx) > 100) {
        // Fly away with inertia
        gsap.to(card, {
          x: dx * 3, y: dy * 1.5, opacity: 0, rotation: dx * 0.2, scale: 0.6,
          duration: 0.5, ease: 'power2.out',
          onComplete: () => {
            // Snap back to original position with elastic spring
            gsap.to(card, {
              x: 0, y: 0, opacity: 1, rotation: 0, scale: 1,
              boxShadow: 'none',
              duration: 0.9, ease: 'elastic.out(1, 0.4)',
              delay: 0.2,
              onComplete: () => { card.style.zIndex = ''; }
            });
          }
        });
      } else {
        // Small drag — snap back
        gsap.to(card, {
          x: 0, y: 0, rotation: 0, scale: 1,
          boxShadow: 'none',
          duration: 0.5, ease: 'elastic.out(1, 0.5)',
          onComplete: () => { card.style.zIndex = ''; }
        });
      }
    };

    cards.forEach(card => {
      card.style.cursor = 'grab';
      card.style.touchAction = 'none';
      card.addEventListener('pointerdown', onPointerDown);
      card.addEventListener('pointermove', onPointerMove);
      card.addEventListener('pointerup', onPointerUp);
      card.addEventListener('pointercancel', onPointerUp);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('pointerdown', onPointerDown);
        card.removeEventListener('pointermove', onPointerMove);
        card.removeEventListener('pointerup', onPointerUp);
        card.removeEventListener('pointercancel', onPointerUp);
      });
    };
  }, []);

  // 1-Click Demo Login Handlers
  const handleGoogleSignIn = async () => {
    try {
      showToast('Connecting with Google Workspace SSO...', 'info');
      await login('alex.rivera@invexa.io', 'Admin@123', 'Inventory Manager');
      showToast('Signed in via Google Workspace (Alex Rivera - Manager)', 'success');
      setActiveView('dashboard');
    } catch {
      setActiveView('dashboard');
    }
  };

  const handleAdminDemoLogin = async () => {
    try {
      showToast('Logging in as Enterprise Admin / Inventory Manager...', 'info');
      await login('alex.rivera', 'Admin@123', 'Inventory Manager');
      showToast('Welcome Alex Rivera (Inventory Manager)', 'success');
      setActiveView('dashboard');
    } catch {
      setActiveView('dashboard');
    }
  };

  const handleStaffDemoLogin = async () => {
    try {
      showToast('Logging in as Warehouse Staff / Floor Operator...', 'info');
      await login('staff.operator', 'Operator@123', 'Warehouse Operator');
      showToast('Welcome Priya Sharma (Warehouse Floor Operator)', 'success');
      setActiveView('dashboard');
    } catch {
      setActiveView('dashboard');
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoEmail.trim()) {
      showToast('Please enter your corporate email address', 'warning');
      return;
    }
    showToast(`Thank you! A solution architect will contact ${demoEmail} within 15 minutes.`, 'success');
    setDemoEmail('');
  };

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
      {/* 1. PREMIUM FLOATING NAVBAR */}
      <header className="floating-nav fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-2xl sm:rounded-[2rem] shadow-lg shadow-slate-200/40">
        <div className="px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveView('landing')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-1 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <img src="/invexa_logo.png" alt="INVEXA Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex items-center gap-2 logo-draw draw-text">
              <svg width="90" height="28" viewBox="0 0 90 28" className="overflow-visible">
                <text x="0" y="20" className="text-xl font-black tracking-tight stroke-slate-900 stroke-1" fill="transparent">INVEXA</text>
              </svg>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                ENTERPRISE
              </span>
            </div>
          </div>

          {/* Navigation Links - Sliding Blob Hover */}
          <nav className="nav-blob-container hidden lg:flex items-center p-1 rounded-full bg-slate-100/50 border border-slate-200/50 relative">
            {/* The animated blob */}
            <div className="nav-blob absolute h-[calc(100%-8px)] top-1 rounded-full bg-white shadow-sm border border-slate-200/60 pointer-events-none opacity-0 transition-opacity duration-200" style={{ left: 4, width: 80 }} />
            {['Features', 'Operations', 'Warehouses', 'Integrations'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().split(' ')[0]}`} 
                className="nav-link relative z-10 px-5 py-2 text-[11px] uppercase tracking-wider font-bold text-slate-500 rounded-full transition-colors duration-200 hover:text-slate-900"
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  const nav = target.parentElement;
                  if (!nav) return;
                  const navRect = nav.getBoundingClientRect();
                  const targetRect = target.getBoundingClientRect();
                  const blob = nav.querySelector('.nav-blob') as HTMLElement;
                  if (!blob) return;
                  gsap.to(blob, {
                    left: targetRect.left - navRect.left,
                    width: targetRect.width,
                    duration: 0.4,
                    ease: 'power2.out',
                  });
                  gsap.to(blob, { opacity: 1, duration: 0.15 });
                }}
                onMouseLeave={(e) => {
                  const nav = e.currentTarget.parentElement;
                  if (!nav) return;
                  // Check if we're leaving the nav entirely
                  const related = e.relatedTarget as HTMLElement;
                  if (!nav.contains(related)) {
                    const blob = nav.querySelector('.nav-blob') as HTMLElement;
                    if (blob) gsap.to(blob, { opacity: 0, duration: 0.3 });
                  }
                }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('auth')}
              className="hidden sm:block text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-2 cursor-pointer transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleAdminDemoLogin}
              className="bg-slate-900 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md shadow-slate-900/20"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  y: -2,
                  duration: 0.4,
                  ease: "elastic.out(1, 0.5)"
                });
                gsap.to(e.currentTarget.querySelector('svg'), {
                  x: 3,
                  duration: 0.4,
                  ease: "elastic.out(1, 0.5)"
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  duration: 0.4,
                  ease: "power2.out"
                });
                gsap.to(e.currentTarget.querySelector('svg'), {
                  x: 0,
                  duration: 0.4,
                  ease: "power2.out"
                });
              }}
            >
              <span>Instant Demo</span>
              <ArrowRight className="w-3.5 h-3.5 transition-none" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="hero-section relative min-h-[95vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden bg-slate-950">
        {/* Full Bleed Background Video (Celsius Inspiration) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video-bg absolute inset-0 w-full h-full object-cover z-0 opacity-80 mix-blend-screen"
        >
          <source src="/store-aisle-detection.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlays for Contrast */}
        <div className="absolute inset-0 bg-slate-950/60 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-transparent z-0 opacity-50" />

        <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
          {/* Release Badge */}
          <div
            onClick={() => setActiveView('auth')}
            className="hero-animate opacity-0 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold mb-6 shadow-2xs hover:border-blue-400/60 hover:bg-blue-500/20 transition-all cursor-pointer backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span>ENTERPRISE INVENTORY MATRIX v2.4 RELEASED</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
          </div>

          {/* Main Headline */}
          <h1 className="hero-animate opacity-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto drop-shadow-xl">
            <GlitchText text="Smart Inventory." className="inline-block" /> <br className="sm:hidden" />
            Simple Control. <br />
            <ShinyText
              text="Built for Scale."
              speed={3}
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-300 font-extrabold inline-block mt-2"
            />
          </h1>

          {/* Subtitle */}
          <p className="hero-animate opacity-0 mt-5 text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-md">
            Empower your enterprise supply chain with real-time multi-warehouse balance, zero-drift internal transfers, automated receipts, delivery dispatching, and cryptographic audit logs.
          </p>

          {/* 3 INSTANT DEMO & SSO BUTTONS */}
          <div className="hero-animate opacity-0 mt-8 max-w-3xl mx-auto p-4 sm:p-5 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-3 text-center flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>One-Click Instant Access & Demo Roles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* BUTTON 1: GOOGLE SSO */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 text-white text-xs font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer group"
              >
                {/* Google Multi-Color SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div className="text-left">
                  <span className="block leading-tight font-extrabold text-white">Sign in with Google</span>
                  <span className="block text-[10px] text-slate-400 font-normal">Workspace SSO</span>
                </div>
              </button>

              {/* BUTTON 2: INVENTORY MANAGER */}
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="relative overflow-hidden flex items-center justify-center gap-2.5 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 cursor-pointer animate-border-beam [--duration:4s]"
              >
                <Shield className="w-4 h-4 text-blue-200 shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="leading-tight font-extrabold text-white">Inventory Manager</span>
                    <span className="px-1.5 py-0.2 bg-white/20 text-white text-[9px] font-bold rounded">MANAGER</span>
                  </div>
                  <span className="block text-[10px] text-blue-100 font-normal">Incoming & Outgoing Stock</span>
                </div>
              </button>

              {/* BUTTON 3: WAREHOUSE STAFF */}
              <button
                type="button"
                onClick={handleStaffDemoLogin}
                className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md shadow-slate-900/20 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="leading-tight font-extrabold text-white">Warehouse Staff</span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 text-[9px] font-bold rounded">STAFF</span>
                  </div>
                  <span className="block text-[10px] text-slate-300 font-normal">Transfers, Picking & Counting</span>
                </div>
              </button>
            </div>
          </div>

          {/* Trust points */}
          <div className="hero-animate opacity-0 mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Demo Access
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Sub-Second Stock Sync
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Enterprise Role Permissions
            </span>
          </div>

          {/* 3. HERO SHOWCASE MOCKUP CARD */}
          <div className="mt-12 max-w-6xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-950 group">
            {/* Background Warehouse Video with Overlay */}
            <div className="h-[380px] sm:h-[480px] lg:h-[540px] relative flex flex-col justify-between p-4 sm:p-6 lg:p-8">
              {/* Background Video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
              >
                <source src="/worker-zone-detection.mp4" type="video/mp4" />
              </video>
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-950/40 backdrop-blur-[2px] z-10" />

              {/* Top Floating Status Tags on Photo */}
              <div className="relative z-20 flex items-center justify-between text-xs font-bold text-white">
                <span className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  📍 WAREHOUSE 01: MAIN MATRIX (WH-001)
                </span>
                <span className="px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-slate-200 font-mono text-[11px]">
                  894 ACTIVE SKUS | TEMP 18.5°C
                </span>
              </div>

              {/* Center Floating Glassmorphic ERP Monitor Card */}
              <div className="relative z-20 max-w-4xl mx-auto w-full bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/40 text-slate-900 text-left">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span className="ml-2 text-xs font-extrabold text-slate-800">
                      INVEXA Core v2.4 — Live System Monitor
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      WH-001 (MAIN HUB)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    SYSTEM ACCURACY: 99.98%
                  </span>
                </div>

                {/* 4 KPI Metric Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Inbound Receipts</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      14 <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Today</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Dock verification queue</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Internal Transfers</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      29 <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">Active</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Multi-rack rebalancing</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Delivery Orders</div>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      112 <span className="text-xs font-semibold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">Moving</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Outbound dispatch bays</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Stock Drift Variance</div>
                    <div className="text-xl font-extrabold text-emerald-600 mt-0.5">0.00%</div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[99.98%]" />
                    </div>
                  </div>
                </div>

                {/* Mini Transfer Log Table Preview */}
                <div className="overflow-hidden rounded-xl border border-slate-200 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100/80 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Reference</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3">From / To Location</th>
                        <th className="py-2 px-3">Qty</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-[11px] font-medium bg-white">
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">WH-001-TRF-882</td>
                        <td className="py-2 px-3"><span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">Transfer</span></td>
                        <td className="py-2 px-3">Rack A ➔ Production Floor</td>
                        <td className="py-2 px-3 font-mono">450 Units</td>
                        <td className="py-2 px-3 text-right"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">In Transit</span></td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-bold text-slate-900">WH-001-REC-019</td>
                        <td className="py-2 px-3"><span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">Receiving</span></td>
                        <td className="py-2 px-3">Vendor Dock 1 ➔ Staging B</td>
                        <td className="py-2 px-3 font-mono">1,200 Units</td>
                        <td className="py-2 px-3 text-right"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Ready</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Warehouse Location Badge */}
              <div className="relative z-20 text-center text-[10px] tracking-widest uppercase text-slate-400 font-bold">
                TRUSTED BY 2,500+ ENTERPRISE DISTRIBUTION CENTERS & LOGISTICS NETWORKS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CLIENT LOGO TRUST BANNER */}
      <section className="py-8 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-6">
            TRUSTED BY 2,500+ ENTERPRISE DISTRIBUTION CENTERS & LOGISTICS NETWORKS
          </div>
          <Marquee pauseOnHover className="[--duration:30s] opacity-85 text-slate-300 font-bold text-sm sm:text-base tracking-wider mt-4">
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity mx-4">
              <Zap className="w-5 h-5 text-blue-400" /> AEROLOGIX
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity mx-4">
              <Building2 className="w-5 h-5 text-sky-400" /> MULTIWAY WH
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity mx-4">
              <Package className="w-5 h-5 text-indigo-400" /> GAMBA GLOBAL
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity mx-4">
              <Truck className="w-5 h-5 text-emerald-400" /> TRANS-GLOBAL
            </span>
            <span className="flex items-center gap-2 hover:opacity-100 transition-opacity mx-4">
              <Sliders className="w-5 h-5 text-purple-400" /> KINETIC SUPPLY
            </span>
          </Marquee>
        </div>
      </section>

      {/* 5. SECTION 1: ARCHITECTURE / MODULE CARDS (Pinned Horizontal Scroll) */}
      <section id="features-pin" className="h-screen bg-white flex flex-col justify-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full mb-10 shrink-0">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
            ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Multi-Zone Warehouse Orchestration
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Eliminate stock discrepancies, unmanaged internal moves, and synchronize stores with physical rack locations using native three-state automation.
          </p>
        </div>

        {/* Horizontal Track Container */}
        <div className="features-track flex gap-6 px-4 sm:px-20 w-max items-center">
          {/* Card 01 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  <WarehouseIcon className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 01</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Warehousing Rack Hierarchy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Structure multi-warehouses into Zone, Rack, Shelf, and Bin. Auto-generate spatial 2D barcodes for instant handheld scanner mapping.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-all">
                <span>WH-STRUCTURE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 02 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-5 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-2xs">
                  <Box className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 02</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Inbound Receipts (WH-IN)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Direct vendor dock management with rapid 3-step stock verification. Draft ➔ Ready ➔ Done. Single-click batch reception & QA level release.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-all">
                <span>RECEIVING DOCK</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 03 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-2xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 03</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delivery Orders (WH-OUT)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automate picking lists, batch authorization, and stock reservation. Prevent negative stock dispatch before items arrive at outbound loading bays.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-all">
                <span>DISPATCH ENGINE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 04 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 04</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Zero-Drift Stock Matrix</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cryptographic double-entry inventory ledger. Moving physical unit never breaks balance logs or audit history.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-all">
                <span>LEDGER MATRIX</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 05 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 05</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Internal Transfers (INT)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Seamlessly rebalance stock between aisles and zones. Native support for transit staging areas and multi-step transfer routes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-all">
                <span>REBALANCING</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 06 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center mb-5 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-2xs">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 06</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Replenishment</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Define Min/Max stock rules per warehouse. Auto-trigger purchase drafts when available stock drops below threshold levels.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-orange-600 group-hover:translate-x-1 transition-all">
                <span>REPLENISHMENT ENGINE</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 07 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center mb-5 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 07</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Advanced Valuation</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time FIFO, LIFO, and Average Costing. Instantly compute inventory capital across global networks with zero delays.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-600 group-hover:translate-x-1 transition-all">
                <span>FINANCIAL LOGIC</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

          {/* Card 08 */}
          <div className="feature-card w-full sm:w-[400px] shrink-0 p-8 rounded-2xl bg-white border border-slate-200/90 shadow-lg flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center mb-5 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-2xs">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">MODULE 08</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Live Analytics & Telemetry</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Exportable BI dashboard. Monitor stock drift, picking times, dock delays, and worker efficiency across all locations in one view.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-all">
                <span>REPORTING TELEMETRY</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
      </section>

      {/* 6. SECTION 2: INTERACTIVE LIVE SIMULATION */}
      <section id="operations" className="relative py-24 bg-slate-950 overflow-hidden border-y border-slate-800">
        {/* Dark Video / Image Background Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-slate-950"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-block mb-3 backdrop-blur-sm">
            LIVE SIMULATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            <ScrambleText text="Deep-Dive Into Operational Workflows" />
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Switch between core ERP modules to view simulated live stock, automated reservation rules, and emergency replenishment flows.
          </p>

          {/* Interactive Simulation Tabs */}
          <div className="mt-10 flex flex-wrap justify-center gap-2 p-1.5 bg-slate-200/70 rounded-full max-w-3xl mx-auto text-xs font-bold">
            <button
              onClick={() => setSimulationTab('inbound')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'inbound'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vendor Inbound Queue
            </button>
            <button
              onClick={() => setSimulationTab('outbound')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'outbound'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WH-OUT Delivery
            </button>
            <button
              onClick={() => setSimulationTab('locations')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'locations'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rack & Locations
            </button>
            <button
              onClick={() => setSimulationTab('matrix')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                simulationTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stock Balance Matrix
            </button>
          </div>

          {/* Dynamic Tab Box Content (Mockup Window) */}
          <div className="mockup-window mt-12 max-w-5xl mx-auto bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-slate-700/50 overflow-hidden text-left relative z-10">
            
            {/* Mockup Window Header (Mac OS Style) */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-800/40">
              <div className="flex items-center gap-4">
                {/* OS Dots */}
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                {/* Title & Hub Pill */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">INVEXA Core v2.4 — Live System Monitor</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    WH-001 (MAIN HUB)
                  </span>
                </div>
              </div>
              
              {/* Accuracy Pill */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                SYSTEM ACCURACY: 99.98%
              </div>
            </div>

            {/* Main Content Area */}
            {simulationTab === 'inbound' && (
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Vendor Inbound Queue
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">12 Pending Receiving</span>
                    </h4>
                    <p className="text-xs text-slate-500">Live vendor deliveries undergoing dock scan & QA checks.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('receipts')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Open Inbound Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                        <th className="p-3">Reference ID</th>
                        <th className="p-3">Supplier Partner</th>
                        <th className="p-3">Destination Facility</th>
                        <th className="p-3">Scheduled Date</th>
                        <th className="p-3 text-right">Operation Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {isMockupLoading ? (
                        <>
                          {/* Skeleton Row 1 */}
                          <tr>
                            <td className="p-3"><div className="skeleton-line h-3 w-16 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-40 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-32 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-20 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3 text-right"><div className="skeleton-line h-5 w-24 bg-slate-700/50 rounded-full ml-auto" /></td>
                          </tr>
                          {/* Skeleton Row 2 */}
                          <tr>
                            <td className="p-3"><div className="skeleton-line h-3 w-16 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-36 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-28 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-20 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3 text-right"><div className="skeleton-line h-5 w-20 bg-slate-700/50 rounded-full ml-auto" /></td>
                          </tr>
                          {/* Skeleton Row 3 */}
                          <tr>
                            <td className="p-3"><div className="skeleton-line h-3 w-16 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-48 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-36 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3"><div className="skeleton-line h-3 w-20 bg-slate-700/50 rounded-full" /></td>
                            <td className="p-3 text-right"><div className="skeleton-line h-5 w-24 bg-slate-700/50 rounded-full ml-auto" /></td>
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr className="animate-in fade-in duration-500">
                            <td className="p-3 font-mono font-bold text-blue-400">WH/IN/0001</td>
                            <td className="p-3 font-bold text-slate-200">Tata Steel Industrial Ltd</td>
                            <td className="p-3 text-slate-400">Main Distribution Warehouse</td>
                            <td className="p-3 font-mono text-slate-500">2026-09-27</td>
                            <td className="p-3 text-right"><span className="badge badge-done bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ready for Docking</span></td>
                          </tr>
                          <tr className="animate-in fade-in duration-500 delay-75">
                            <td className="p-3 font-mono font-bold text-blue-400">WH/IN/0002</td>
                            <td className="p-3 font-bold text-slate-200">Foxconn Electronics Component</td>
                            <td className="p-3 text-slate-400">Kalol Production Warehouse</td>
                            <td className="p-3 font-mono text-slate-500">2026-09-28</td>
                            <td className="p-3 text-right"><span className="badge badge-waiting bg-amber-500/10 text-amber-400 border border-amber-500/20">Waiting Inspection</span></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {simulationTab === 'outbound' && (
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Outbound Customer Dispatch
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">8 Dispatching Bays</span>
                    </h4>
                    <p className="text-xs text-slate-500">Pick, pack, weigh, and carrier handover with real-time stock deduction.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('deliveries')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Open Delivery Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold border-b border-slate-200">
                        <th className="p-3">Order Code</th>
                        <th className="p-3">Customer Entity</th>
                        <th className="p-3">Dispatch Facility</th>
                        <th className="p-3">Assigned Carrier</th>
                        <th className="p-3 text-right">Fulfillment Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-600">WH/OUT/0001</td>
                        <td className="p-3 font-bold text-slate-900">Skyline Infrastructure Pvt Ltd</td>
                        <td className="p-3">Main Distribution Warehouse</td>
                        <td className="p-3">BlueDart Logistics (Express Air)</td>
                        <td className="p-3 text-right"><span className="badge badge-done">Stock Deducted</span></td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-indigo-600">WH/OUT/0002</td>
                        <td className="p-3 font-bold text-slate-900">Apex Robotics Assembly</td>
                        <td className="p-3">Express Transit Hub</td>
                        <td className="p-3">Delhivery Surface Cargo</td>
                        <td className="p-3 text-right"><span className="badge badge-ready">Staged at Bay 4</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {simulationTab === 'locations' && (
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Zone & Storage Rack Mapping</h4>
                    <p className="text-xs text-slate-500">Spatial telemetry across aisles, shelves, and heavy-duty staging racks.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('warehouses')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>View All Warehouses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">LOC-001</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">82% Full</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rack A — Heavy Metals</div>
                    <div className="text-[10px] text-slate-500 mt-1">Aisle 01 • Shelf A-01/02</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">LOC-002</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">64% Full</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rack B — Finished Furniture</div>
                    <div className="text-[10px] text-slate-500 mt-1">Aisle 02 • Shelf B-01/03</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-blue-600">LOC-003</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">45% Full</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">Rack C — Electronics & IT</div>
                    <div className="text-[10px] text-slate-500 mt-1">Aisle 03 • Secure Cage C-01</div>
                  </div>
                </div>
              </div>
            )}

            {simulationTab === 'matrix' && (
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Stock Balance Matrix</h4>
                    <p className="text-xs text-slate-500">Real-time breakdown of Total On-Hand, Reserved, and Free Available Stock.</p>
                  </div>
                  <button
                    onClick={() => setActiveView('stock')}
                    className="btn btn-primary text-xs flex items-center gap-1.5"
                  >
                    <span>Inspect Stock Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Total Catalog SKUs</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">12 Items</div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
                    <div className="text-[10px] uppercase font-bold text-blue-700">Total Units in Stock</div>
                    <div className="text-xl font-bold text-blue-700 mt-1">6,493 Units</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200">
                    <div className="text-[10px] uppercase font-bold text-amber-700">Reserved for Orders</div>
                    <div className="text-xl font-bold text-amber-700 mt-1">425 Units</div>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <div className="text-[10px] uppercase font-bold text-emerald-700">Free to Deliver</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">6,068 Units</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. WAREHOUSES & HUBS SHOWCASE */}
      <section id="warehouses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
              FACILITIES NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Synchronized Multi-Hub Operations
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Manage central distribution centers, production warehouses, and cross-dock transit facilities from a single unified control plane.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="warehouse-card card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-001</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Main Distribution Warehouse</h3>
              <p className="text-xs text-slate-500 mt-1">Gandhinagar, Gujarat • Central Hub</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">15,000 m³</span>
              </div>
            </div>

            <div className="warehouse-card card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-002</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Kalol Production Warehouse</h3>
              <p className="text-xs text-slate-500 mt-1">Kalol, Gujarat • Production & Assembly</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">8,500 m³</span>
              </div>
            </div>

            <div className="warehouse-card card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-003</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Express Transit Hub</h3>
              <p className="text-xs text-slate-500 mt-1">Ahmedabad, Gujarat • Cross-Dock</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">5,000 m³</span>
              </div>
            </div>

            <div className="warehouse-card card p-5 hover:border-blue-300 transition-all group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">WH-004</span>
                <span className="badge badge-done">Active</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">Central Staging Facility</h3>
              <p className="text-xs text-slate-500 mt-1">Vadodara, Gujarat • Secure Storage</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity</span>
                <span className="font-bold text-slate-900">4,200 m³</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTEGRATIONS & CONNECTIVITY */}
      <section id="integrations" className="py-20 bg-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-3">
            INTEGRATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex flex-wrap justify-center gap-[0.2em]">
            {["Connects", "With", "Your", "Existing", "Supply", "Chain", "Stack"].map((word, i) => (
              <span key={i} className="split-word inline-block origin-bottom-left">{word}</span>
            ))}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Seamlessly sync orders, carriers, RFID tags, and barcodes with RESTful API webhooks and EDI protocols.
          </p>

          {/* ROW 1: 3 equal cards */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Card 1: Zebra Scanners */}
            <div className="integration-card-animate relative h-[300px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-slate-900 text-white">
              <div 
                className="integration-image absolute inset-0 bg-[url('https://images.unsplash.com/photo-1633174524827-db00a6b7bc74?q=80&w=2096&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-80" />
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Where precision meets Zebra Scanners.</h3>
                  <p className="text-sm text-slate-300 font-medium">Native integration with enterprise handhelds for millimeter-perfect dock accuracy.</p>
                </div>
              </div>
            </div>

            {/* Card 2: SAP & Oracle */}
            <div className="integration-card-animate relative h-[300px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-slate-900 text-white">
              <div 
                className="integration-image absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 backdrop-blur-md">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Data sync with SAP & Oracle.</h3>
                  <p className="text-sm text-slate-300 font-medium">Push and pull financial ledgers and CRM databases securely.</p>
                </div>
              </div>
            </div>

            {/* Card 3: Shopify */}
            <div className="integration-card-animate relative h-[300px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-slate-900 text-white">
              <div 
                className="integration-image absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-lime-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Omnichannel routing with Shopify.</h3>
                  <p className="text-sm text-slate-300 font-medium">Sync inventory across all your e-commerce channels.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: 1 tall + 2 smaller (stacked via nested grid) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Card 4: BlueDart & FedEx (Tall) */}
            <div className="integration-card-animate relative h-[300px] md:h-full md:min-h-[300px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-slate-900 text-white md:row-span-2">
              <div 
                className="integration-image absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c20a9a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-80" />
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Seamless logistics with BlueDart & FedEx.</h3>
                  <p className="text-sm text-slate-300 font-medium">Auto-generate shipping labels and fetch real-time tracking from global carriers.</p>
                </div>
              </div>
            </div>

            {/* Card 5: Google SSO */}
            <div className="integration-card-animate relative h-[280px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-slate-900 text-white">
              <div 
                className="integration-image absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-rose-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Enterprise security via Google SSO.</h3>
                </div>
              </div>
            </div>

            {/* Card 6: REST Webhooks */}
            <div className="integration-card-animate relative h-[280px] rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-slate-900 text-white">
              <div 
                className="integration-image absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700 z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
              <div className="relative z-20 h-full p-8 flex flex-col justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-purple-400">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white mb-2 leading-tight">Real-time events with REST Webhooks.</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="py-20 relative overflow-hidden border-t border-slate-200/80">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/store-aisle-detection.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-blue-50/80 to-slate-100/90 backdrop-blur-sm z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/90 backdrop-blur-md border border-blue-100 shadow-2xl shadow-blue-500/10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 inline-block mb-4">
              ENTERPRISE PLATFORM • INSTANT TRIAL
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Modernize your warehouse operations today.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Connect your ERP, barcode scanners, and freight carriers to the highest-velocity smart inventory ledger.
            </p>

            {/* Email Input Form */}
            <form onSubmit={handleDemoSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                required
                placeholder="Enter your corporate email address..."
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/20 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                Request Live Demo
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-600">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Sign in with Google
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleAdminDemoLogin}
                className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Try Admin Demo
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleStaffDemoLogin}
                className="text-slate-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Try Staff Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. PREMIUM GSAP FOOTER */}
      <footer className="bg-[#0b0c10] text-[#878a94] pt-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16">
            
            {/* Left Brand / Intro */}
            <div className="lg:col-span-5 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-2 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
                <img src="/invexa_logo.png" alt="INVEXA Logo" className="w-full h-full object-contain brightness-0 invert" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                High-velocity enterprise intelligence.
              </h3>
              <p className="text-sm leading-relaxed max-w-sm">
                Real-time stock sync matrix across distribution hubs, production racks, and outbound logistics. Designed for the modern supply chain.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#13141a] border border-white/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                All Systems Operational
              </div>
            </div>

            {/* Right Links */}
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div className="flex flex-col gap-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Platform</div>
                <a href="#features" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Inventory Telemetry
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#operations" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Replenishment Logic
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#warehouses" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Multi-Zone Routing
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#integrations" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Ecosystem
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Resources</div>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Documentation
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  API Reference
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Security Whitepaper
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  System Status
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              <div className="flex flex-col gap-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-2">Company</div>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Careers
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Contact Sales
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-white transition-colors duration-300 relative group w-fit">
                  Trust Center
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between py-6 border-t border-white/10 text-xs font-mono uppercase tracking-widest">
            <p>© {new Date().getFullYear()} INVEXA Core v2.4</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-white transition-colors duration-300">Terms</a>
            </div>
          </div>
        </div>

        {/* Humongous Background Brand Text */}
        <div className="w-full overflow-hidden flex items-end justify-center pointer-events-none select-none relative -mt-6 sm:-mt-10 leading-none footer-draw draw-text">
          <svg className="w-full h-auto text-center overflow-visible" viewBox="0 0 1000 250" preserveAspectRatio="xMidYMid meet">
            <text x="50%" y="80%" textAnchor="middle" className="text-[200px] font-black tracking-tighter stroke-white/[0.1] stroke-2" fill="transparent">
              INVEXA
            </text>
          </svg>
        </div>
      </footer>
    </div>
  );
};
