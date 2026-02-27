import { useEffect, useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  Linkedin,
  ExternalLink,
  FileText,
  ChevronDown,
  Code2,
  Database,
  BarChart3,
  Wrench,
  Brain,
  TestTube,
  TrendingUp,
  Search,
  MapPin,
  Menu,
  X,
  Heart,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface AnimatedEntry {
  isVisible: boolean;
  ref: React.RefObject<HTMLElement>;
}

// ── Custom Hook: Intersection Observer ────────────────────────────────────
function useScrollAnimation(threshold = 0.15): AnimatedEntry {
  const ref = useRef<HTMLElement>(null!);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ── Typing Effect Hook ─────────────────────────────────────────────────────
function useTypingEffect(phrases: string[], typingSpeed = 80, deletingSpeed = 50, pauseDuration = 1800) {
  const [displayText, setDisplayText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayText(isDeleting
          ? currentPhrase.slice(0, displayText.length - 1)
          : currentPhrase.slice(0, displayText.length + 1)
        );
      }, isDeleting ? deletingSpeed : typingSpeed);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

// ── Progress Bar Component ─────────────────────────────────────────────────
function AnimatedProgressBar({ label, value, color = "cyan" }: { label: string; value: number; color?: "cyan" | "teal" }) {
  const { ref, isVisible } = useScrollAnimation();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setWidth(value), 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible, value]);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold" style={{
          color: color === "cyan" ? "oklch(0.72 0.19 198)" : "oklch(0.68 0.22 168)"
        }}>{value}%</span>
      </div>
      <div className="h-2 rounded-full" style={{ background: "oklch(0.22 0.03 250)" }}>
        <div
          className="h-2 rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${width}%`,
            background: color === "cyan"
              ? "linear-gradient(90deg, oklch(0.72 0.19 198), oklch(0.68 0.22 168))"
              : "linear-gradient(90deg, oklch(0.68 0.22 168), oklch(0.72 0.19 198))"
          }}
        />
      </div>
    </div>
  );
}

// ── Section Wrapper ────────────────────────────────────────────────────────
function Section({ children, id, className = "" }: { children: React.ReactNode; id: string; className?: string }) {
  return (
    <section id={id} className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// ── Section Title ──────────────────────────────────────────────────────────
function SectionTitle({ title, subtitle, center = false }: { title: string; subtitle?: string; center?: boolean }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`mb-14 ${center ? "text-center" : ""} ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
    >
      <h2
        className={`text-3xl sm:text-4xl font-display font-bold text-foreground ${center ? "section-heading-center" : "section-heading"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-muted-foreground max-w-2xl" style={{ marginLeft: center ? "auto" : undefined, marginRight: center ? "auto" : undefined }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Animated Card ──────────────────────────────────────────────────────────
function AnimatedCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ animationDelay: `${delay}ms` }}
      className={`${isVisible ? "animate-fade-in-up" : "opacity-0"} ${className}`}
    >
      {children}
    </div>
  );
}

// ── Navigation ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "volunteer", label: "Volunteer" },
  { id: "languages", label: "Languages" },
  { id: "contact", label: "Contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = NAV_LINKS.map(({ id }) => id);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const scrollPos = window.scrollY + 80;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "oklch(0.13 0.02 250 / 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.72 0.19 198 / 0.12)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
           {/* Logo */}
          <button
            type="button"
            onClick={() => scrollTo("home")}
            className="font-display font-bold text-lg gradient-text"
          >
            VA<span className="text-foreground">.</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeSection === link.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={activeSection === link.id ? { color: "oklch(0.72 0.19 198)" } : undefined}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden py-4 px-4"
          style={{ background: "oklch(0.13 0.02 250 / 0.98)", backdropFilter: "blur(16px)" }}
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg mb-1 transition-all"
              style={activeSection === link.id
                ? { color: "oklch(0.72 0.19 198)", background: "oklch(0.72 0.19 198 / 0.08)" }
                : { color: "oklch(0.72 0.04 240)" }
              }
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────
function HeroSection() {
  const typedText = useTypingEffect([
    "Digital Marketing Executive",
    "SEO Specialist",
    "GMB Optimization Expert",
    "Data Analytics Enthusiast",
  ]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-bg.dim_1600x900.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, oklch(0.10 0.025 250 / 0.92), oklch(0.12 0.02 260 / 0.88), oklch(0.10 0.015 230 / 0.92))"
          }}
        />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      {/* Floating ambient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.72 0.19 198 / 0.06)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: "oklch(0.68 0.22 168 / 0.06)" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Profile Photo */}
        <div className="animate-fade-in-up delay-100 opacity-0-start mb-8 flex justify-center">
          <div
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full glow-ring"
            style={{ border: "3px solid oklch(0.72 0.19 198)" }}
          >
            <img
              src="/assets/uploads/WhatsApp-Image-2026-02-27-at-2.25.11-PM-1.jpeg"
              alt="Valipi Akhil"
              className="w-full h-full rounded-full object-cover"
              style={{ objectPosition: "center center" }}
            />
            {/* Rotating ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                border: "2px dashed oklch(0.72 0.19 198 / 0.35)",
                animation: "spin 20s linear infinite",
                margin: "-8px"
              }}
            />
          </div>
        </div>

        {/* Name */}
        <div className="animate-fade-in-up delay-200 opacity-0-start">
          <h1 className="text-5xl sm:text-7xl font-display font-extrabold tracking-tight mb-3">
            <span className="text-foreground">Valipi </span>
            <span className="gradient-text">Akhil</span>
          </h1>
        </div>

        {/* Typing Effect */}
        <div className="animate-fade-in-up delay-300 opacity-0-start mb-4">
          <p
            className="text-lg sm:text-2xl font-medium typing-cursor"
            style={{ color: "oklch(0.72 0.19 198)", minHeight: "2rem" }}
          >
            {typedText}
          </p>
        </div>

        {/* Brief */}
        <div className="animate-fade-in-up delay-400 opacity-0-start mb-10">
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            MCA Graduate · Digital Growth Specialist · 1 Year Experience in SEO & GMB Optimization
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-500 opacity-0-start flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://drive.google.com/file/d/1EQc58kB-IFNSJ-DIxE_6_u0aRzBogwZO/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-glow-cyan"
            style={{
              background: "linear-gradient(135deg, oklch(0.72 0.19 198), oklch(0.68 0.22 168))",
              color: "oklch(0.10 0.02 250)",
              boxShadow: "0 0 20px oklch(0.72 0.19 198 / 0.3)"
            }}
          >
            <FileText size={18} />
            View Resume
          </a>
          <a
            href="https://www.linkedin.com/in/valipi-akhil-4925b424a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
            style={{
              background: "transparent",
              border: "2px solid oklch(0.72 0.19 198 / 0.6)",
              color: "oklch(0.72 0.19 198)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "oklch(0.72 0.19 198 / 0.1)";
              e.currentTarget.style.borderColor = "oklch(0.72 0.19 198)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "oklch(0.72 0.19 198 / 0.6)";
            }}
          >
            <Linkedin size={18} />
            LinkedIn Profile
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="animate-fade-in-up delay-700 opacity-0-start mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors animate-scroll-bounce"
          >
            <span className="text-xs">Scroll Down</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ── About Section ──────────────────────────────────────────────────────────
function AboutSection() {
  const leftAnim = useScrollAnimation();
  const rightAnim = useScrollAnimation();

  return (
    <Section id="about" className="relative">
      <SectionTitle title="About Me" />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Photo */}
        <div
          ref={leftAnim.ref as React.RefObject<HTMLDivElement>}
          className={`flex justify-center md:justify-start ${leftAnim.isVisible ? "animate-slide-in-left" : "opacity-0"}`}
        >
          <div className="relative">
            <div
              className="w-64 h-72 sm:w-80 sm:h-96 rounded-2xl overflow-hidden"
              style={{ border: "2px solid oklch(0.72 0.19 198 / 0.3)" }}
            >
              <img
              src="/assets/uploads/WhatsApp-Image-2026-02-27-at-2.25.11-PM-1.jpeg"
              alt="Valipi Akhil"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center center" }}
              />
            </div>
            {/* Decorative element */}
            <div
              className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl -z-10"
              style={{ border: "2px solid oklch(0.68 0.22 168 / 0.25)", borderRadius: "1rem" }}
            />
            {/* Badge */}
            <div
              className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, oklch(0.72 0.19 198), oklch(0.68 0.22 168))",
                color: "oklch(0.10 0.02 250)"
              }}
            >
              1 Year Experience
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          ref={rightAnim.ref as React.RefObject<HTMLDivElement>}
          className={`${rightAnim.isVisible ? "animate-slide-in-right" : "opacity-0"}`}
        >
          <h3 className="text-2xl font-display font-bold mb-4 gradient-text">
            Digital Growth Specialist
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base">
            I'm Akhil, an MCA graduate and digital growth specialist with 1 year of hands-on experience
            in SEO and Google My Business (GMB) optimization. I help businesses improve their online
            visibility, rank higher on search engines, and attract more local customers through
            data-driven strategies.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-8 text-sm sm:text-base">
            My approach combines technical knowledge, analytics, and creative marketing to deliver
            measurable results. I am passionate about continuous learning, digital innovation, and
            building strong online brands. My goal is to help businesses scale smarter in today's
            competitive digital world.
          </p>

          {/* Contact Badges */}
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:9603247489"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 glass-card"
              style={{ color: "oklch(0.72 0.19 198)" }}
            >
              <Phone size={14} /> 9603247489
            </a>
            <a
              href="mailto:Valipiakhil26@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 glass-card"
              style={{ color: "oklch(0.72 0.19 198)" }}
            >
              <Mail size={14} /> Valipiakhil26@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/valipi-akhil-4925b424a"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all hover:scale-105 glass-card"
              style={{ color: "oklch(0.72 0.19 198)" }}
            >
              <Linkedin size={14} /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ── Skills Section ─────────────────────────────────────────────────────────
const skillCards = [
  { icon: "🐍", title: "Python", subtitle: "Programming Language", IconComp: Code2 },
  { icon: "🧪", title: "Manual Testing", subtitle: "Software Testing", IconComp: TestTube },
  { icon: "🗄️", title: "SQL", subtitle: "Database", IconComp: Database },
  { icon: "📊", title: "Power BI", subtitle: "Data Visualization", IconComp: BarChart3 },
  { icon: "🛠️", title: "MS Excel / Office / Google Sheets", subtitle: "Tools", IconComp: Wrench },
  { icon: "🤖", title: "Machine Learning (Basic)", subtitle: "Other", IconComp: Brain },
];

function SkillsSection() {
  return (
    <Section id="skills" className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "oklch(0.14 0.02 250 / 0.5)" }}
      />
      <SectionTitle
        title="Technical Skills"
        subtitle="A blend of technical expertise and digital marketing proficiency."
        center
      />

      {/* Skill Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {skillCards.map((skill, i) => (
          <AnimatedCard
            key={skill.title}
            delay={i * 80}
            className="glass-card p-5 rounded-xl text-center hover:scale-105 transition-transform duration-300 cursor-default"
          >
            <div className="text-3xl mb-3">{skill.icon}</div>
            <h4 className="font-display font-semibold text-sm text-foreground mb-1">{skill.title}</h4>
            <p className="text-xs" style={{ color: "oklch(0.62 0.04 240)" }}>{skill.subtitle}</p>
          </AnimatedCard>
        ))}
      </div>

      {/* Progress bars */}
      <AnimatedCard className="glass-card p-8 rounded-xl">
        <h3 className="text-lg font-display font-bold mb-6 text-foreground flex items-center gap-2">
          <TrendingUp size={18} style={{ color: "oklch(0.72 0.19 198)" }} />
          Digital Marketing Proficiency
        </h3>
        <AnimatedProgressBar label="Digital Marketing" value={85} color="cyan" />
        <AnimatedProgressBar label="SEO Optimization" value={90} color="teal" />
        <AnimatedProgressBar label="GMB Optimization" value={92} color="cyan" />
        <AnimatedProgressBar label="Data Analytics" value={75} color="teal" />
        <AnimatedProgressBar label="Content Strategy" value={78} color="cyan" />
      </AnimatedCard>
    </Section>
  );
}

// ── Education Section ──────────────────────────────────────────────────────
const educationData = [
  {
    degree: "Master of Computer Applications (MCA)",
    period: "2022 – 2024",
    institution: "Jagan's Institute of Management and Computer Studies",
    location: "Nellore",
    cgpa: "8.0",
    icon: "🎓",
  },
  {
    degree: "Bachelor of Science (B.Sc)",
    period: "2019 – 2022",
    stream: "Maths, Statistics & Computer Science",
    institution: "Jagan's Degree College",
    location: "Nellore",
    cgpa: "7.69",
    icon: "📚",
  },
];

function EducationSection() {
  return (
    <Section id="education">
      <SectionTitle title="Education" />
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px"
          style={{ background: "linear-gradient(180deg, oklch(0.72 0.19 198), oklch(0.68 0.22 168))", marginLeft: "-0.5px" }}
        />

        <div className="space-y-10">
          {educationData.map((edu, i) => (
            <AnimatedCard key={edu.degree} delay={i * 150} className={`relative flex ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center gap-6`}>
              {/* Timeline dot */}
              <div
                className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full border-2 shrink-0 z-10"
                style={{
                  background: "oklch(0.72 0.19 198)",
                  borderColor: "oklch(0.72 0.19 198)",
                  boxShadow: "0 0 12px oklch(0.72 0.19 198 / 0.6)",
                  transform: "translate(-50%, 6px)",
                }}
              />

              {/* Card */}
              <div className={`ml-16 md:ml-0 md:w-5/12 glass-card p-6 rounded-xl ${i % 2 === 0 ? "md:mr-auto md:text-right" : "md:ml-auto"}`}>
                <div className="text-2xl mb-2">{edu.icon}</div>
                <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-1">{edu.degree}</h3>
                {"stream" in edu && (
                  <p className="text-xs mb-2" style={{ color: "oklch(0.72 0.19 198)" }}>({edu.stream})</p>
                )}
                <p className="text-sm text-muted-foreground mb-1">{edu.institution}</p>
                <div className="flex flex-wrap gap-2 mt-3" style={{ justifyContent: i % 2 === 0 ? "flex-end" : "flex-start" }}>
                  <Badge
                    className="text-xs"
                    style={{ background: "oklch(0.72 0.19 198 / 0.12)", color: "oklch(0.72 0.19 198)", border: "1px solid oklch(0.72 0.19 198 / 0.25)" }}
                  >
                    📍 {edu.location}
                  </Badge>
                  <Badge
                    className="text-xs"
                    style={{ background: "oklch(0.68 0.22 168 / 0.12)", color: "oklch(0.68 0.22 168)", border: "1px solid oklch(0.68 0.22 168 / 0.25)" }}
                  >
                    CGPA: {edu.cgpa}
                  </Badge>
                  <Badge
                    className="text-xs"
                    style={{ background: "oklch(0.20 0.025 250)", color: "oklch(0.72 0.04 240)", border: "1px solid oklch(0.28 0.04 250)" }}
                  >
                    {edu.period}
                  </Badge>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── Work Experience Section ────────────────────────────────────────────────
const responsibilities = [
  "Managing and updating Google Business Profiles (GMB) for multiple clients",
  "Handling SEO tasks including keyword updates, posts, service optimization",
  "Coordinating with influencers for brand promotions",
  "Improving brand presence by monitoring reviews, ratings, and customer feedback",
  "Ensuring accurate business information and daily updates",
  "Updating daily posts, services, products",
];

function ExperienceSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Section id="experience" className="relative" >
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "oklch(0.14 0.02 250 / 0.5)" }}
      />
      <SectionTitle title="Work Experience" />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`${isVisible ? "animate-fade-in-up" : "opacity-0"} glass-card p-8 rounded-2xl max-w-3xl mx-auto`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-bold text-xl text-foreground mb-1">
              Digital Marketing Executive / GMB Specialist
            </h3>
            <p className="text-sm" style={{ color: "oklch(0.72 0.19 198)" }}>
              Apprenticeship
            </p>
          </div>
          <Badge
            className="text-xs self-start sm:self-auto whitespace-nowrap"
            style={{ background: "oklch(0.72 0.19 198 / 0.12)", color: "oklch(0.72 0.19 198)", border: "1px solid oklch(0.72 0.19 198 / 0.3)" }}
          >
            Feb 2025 – Feb 2026
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <MapPin size={14} style={{ color: "oklch(0.68 0.22 168)" }} />
          <p className="text-sm text-muted-foreground">Apollo Pharmalogistics Private Limited, Hyderabad</p>
        </div>

        {/* Separator */}
        <div className="h-px mb-6" style={{ background: "oklch(0.72 0.19 198 / 0.15)" }} />

        {/* Responsibilities */}
        <h4 className="text-sm font-semibold mb-4" style={{ color: "oklch(0.72 0.04 240)" }}>Key Responsibilities:</h4>
        <ul className="space-y-3">
          {responsibilities.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "oklch(0.72 0.19 198)", boxShadow: "0 0 6px oklch(0.72 0.19 198 / 0.6)" }}
              />
              {item}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {["SEO", "GMB", "Digital Marketing", "Brand Management", "Content Creation"].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: "oklch(0.20 0.025 250)", color: "oklch(0.72 0.04 240)", border: "1px solid oklch(0.28 0.04 250)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── Services Section ───────────────────────────────────────────────────────
const servicesData = [
  {
    title: "SEO Optimization",
    desc: "Improving search engine rankings through keyword research, on-page optimization, and technical SEO strategies.",
    image: "/assets/generated/service-seo-transparent.dim_400x300.png",
    icon: <Search size={22} />,
  },
  {
    title: "GMB Optimization",
    desc: "Managing and optimizing Google Business Profiles to boost local visibility and attract more customers.",
    image: "/assets/generated/service-gmb-transparent.dim_400x300.png",
    icon: <MapPin size={22} />,
  },
  {
    title: "Digital Marketing",
    desc: "Creating and executing digital marketing campaigns across multiple platforms for maximum reach.",
    image: "/assets/generated/service-marketing-transparent.dim_400x300.png",
    icon: <TrendingUp size={22} />,
  },
  {
    title: "Data Analytics",
    desc: "Analyzing marketing data and generating insights to drive data-driven business decisions.",
    image: "/assets/generated/service-analytics-transparent.dim_400x300.png",
    icon: <BarChart3 size={22} />,
  },
  {
    title: "Brand Management",
    desc: "Building and maintaining strong brand presence through consistent messaging and reputation management.",
    image: "/assets/generated/service-brand-transparent.dim_400x300.png",
    icon: <Brain size={22} />,
  },
  {
    title: "Content Strategy",
    desc: "Developing compelling content strategies that engage audiences and support business growth.",
    image: "/assets/generated/service-content-transparent.dim_400x300.png",
    icon: <FileText size={22} />,
  },
];

function ServicesSection() {
  return (
    <Section id="services">
      <SectionTitle
        title="My Services"
        subtitle="Comprehensive digital marketing solutions to help your business grow online."
        center
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicesData.map((service, i) => (
          <AnimatedCard key={service.title} delay={i * 80} className="service-card glass-card rounded-2xl overflow-hidden cursor-default">
            {/* Image */}
            <div
              className="h-44 relative overflow-hidden"
              style={{ background: "oklch(0.16 0.022 250)" }}
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 60%, oklch(0.18 0.025 250 / 0.8))" }}
              />
            </div>
            {/* Content */}
            <div className="p-6">
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                style={{
                  background: "oklch(0.72 0.19 198 / 0.12)",
                  color: "oklch(0.72 0.19 198)",
                  border: "1px solid oklch(0.72 0.19 198 / 0.2)"
                }}
              >
                {service.icon}
              </div>
              <h3 className="font-display font-bold text-base text-foreground mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </Section>
  );
}

// ── Projects Section ───────────────────────────────────────────────────────
const techChips = ["Python", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "SQL"];

function ProjectsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <Section id="projects" className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "oklch(0.14 0.02 250 / 0.5)" }}
      />
      <SectionTitle title="Projects" />
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={`${isVisible ? "animate-fade-in-up" : "opacity-0"} glass-card p-8 rounded-2xl max-w-4xl mx-auto`}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge
                style={{ background: "oklch(0.72 0.19 198 / 0.12)", color: "oklch(0.72 0.19 198)", border: "1px solid oklch(0.72 0.19 198 / 0.3)" }}
              >
                Data Analytics
              </Badge>
              <Badge
                style={{ background: "oklch(0.68 0.22 168 / 0.12)", color: "oklch(0.68 0.22 168)", border: "1px solid oklch(0.68 0.22 168 / 0.3)" }}
              >
                Machine Learning
              </Badge>
            </div>
            <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground leading-tight">
              📌 Voter Behavior Prediction in Elections Using Data Analytics
            </h3>
          </div>
        </div>

        <div className="h-px mb-6" style={{ background: "oklch(0.72 0.19 198 / 0.15)" }} />

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          This project focuses on analyzing voter behavior patterns using data analytics techniques
          to predict election outcomes. The system collects and processes historical election data,
          demographic information, and socio-economic factors to identify trends and voting preferences.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Various data analysis and machine learning techniques were applied to clean, process, and
          visualize the data for accurate prediction. The project helps in understanding voter sentiment,
          improving campaign strategies, and supporting data-driven political decision-making.
        </p>

        {/* Tech chips */}
        <h4 className="text-xs font-semibold mb-3" style={{ color: "oklch(0.72 0.04 240)" }}>Technologies Used:</h4>
        <div className="flex flex-wrap gap-2">
          {techChips.map((chip) => (
            <span
              key={chip}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{
                background: "oklch(0.72 0.19 198 / 0.08)",
                color: "oklch(0.72 0.19 198)",
                border: "1px solid oklch(0.72 0.19 198 / 0.25)",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── Volunteer Section ──────────────────────────────────────────────────────
const volunteerItems = [
  { icon: "🗳️", text: "Actively participated in webcasting of election proceedings" },
  { icon: "🧹", text: "Swachh Bharat Campaign — Cleanliness and community awareness drive" },
  { icon: "🩸", text: "Organized and participated in Blood Donation Camps" },
  { icon: "🎓", text: "Actively participated in college events as an Organizer" },
];

function VolunteerSection() {
  return (
    <Section id="volunteer">
      <SectionTitle title="Volunteer Experience" />
      <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
        {volunteerItems.map((item, i) => (
          <AnimatedCard
            key={item.text}
            delay={i * 100}
            className="glass-card p-5 rounded-xl flex items-start gap-4 hover:scale-[1.02] transition-transform duration-300"
          >
            <span className="text-3xl shrink-0">{item.icon}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
          </AnimatedCard>
        ))}
      </div>
    </Section>
  );
}

// ── Languages Section ──────────────────────────────────────────────────────
const languagesData = [
  { lang: "Telugu", level: "Native Proficiency", sublabel: "Reading, Writing, Speaking", value: 100, color: "oklch(0.68 0.22 168)" },
  { lang: "English", level: "Proficient", sublabel: "Reading, Writing, Speaking", value: 90, color: "oklch(0.72 0.19 198)" },
  { lang: "Hindi", level: "Basic / Intermediate", sublabel: "Conversational", value: 50, color: "oklch(0.75 0.18 210)" },
];

function LanguageCircle({ lang, level, sublabel, value, color }: { lang: string; level: string; sublabel: string; value: number; color: string }) {
  const { ref, isVisible } = useScrollAnimation();
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (isVisible ? (value / 100) * circumference : circumference);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`glass-card p-8 rounded-2xl text-center ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
    >
      {/* Circular progress */}
      <div className="relative w-28 h-28 mx-auto mb-4">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100" aria-label={`${lang} language proficiency ${value}%`}>
          <circle cx="50" cy="50" r="45" fill="none" stroke="oklch(0.22 0.03 250)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45" fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 1.5s ease-out", filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-display font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <h3 className="font-display font-bold text-lg text-foreground mb-1">{lang}</h3>
      <p className="text-sm font-medium mb-1" style={{ color }}>{level}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

function LanguagesSection() {
  return (
    <Section id="languages" className="relative">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "oklch(0.14 0.02 250 / 0.5)" }}
      />
      <SectionTitle title="Languages" center />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {languagesData.map((lang) => (
          <LanguageCircle key={lang.lang} {...lang} />
        ))}
      </div>
    </Section>
  );
}

// ── Contact Section ────────────────────────────────────────────────────────
function ContactSection() {
  const contactItems = [
    {
      icon: <Phone size={22} />,
      label: "Phone",
      value: "9603247489",
      href: "tel:9603247489",
      display: "+91 9603247489",
    },
    {
      icon: <Mail size={22} />,
      label: "Email",
      value: "Valipiakhil26@gmail.com",
      href: "mailto:Valipiakhil26@gmail.com",
      display: "Valipiakhil26@gmail.com",
    },
    {
      icon: <Linkedin size={22} />,
      label: "LinkedIn",
      value: "valipi-akhil-4925b424a",
      href: "https://www.linkedin.com/in/valipi-akhil-4925b424a",
      display: "linkedin.com/in/valipi-akhil",
      external: true,
    },
  ];

  return (
    <Section id="contact">
      <SectionTitle
        title="I'd Love To Hear From You"
        subtitle="I'm always excited to connect with others who share a passion for data and business insights. Whether you have a project in mind, a question, or just want to discuss data-driven solutions, feel free to reach out. Let's collaborate and turn your data into valuable insights!"
        center
      />

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
        {contactItems.map((item, i) => (
          <AnimatedCard key={item.label} delay={i * 100}>
            <a
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="glass-card p-6 rounded-2xl text-center flex flex-col items-center gap-3 hover:scale-105 transition-all duration-300"
              style={{ textDecoration: "none", display: "flex" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 0 25px oklch(0.72 0.19 198 / 0.2), 0 4px 20px rgba(0,0,0,0.3)";
                e.currentTarget.style.borderColor = "oklch(0.72 0.19 198 / 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "";
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.72 0.19 198 / 0.1)", color: "oklch(0.72 0.19 198)", border: "1px solid oklch(0.72 0.19 198 / 0.2)" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.display}</p>
              </div>
              {item.external && (
                <ExternalLink size={14} style={{ color: "oklch(0.72 0.19 198)" }} />
              )}
            </a>
          </AnimatedCard>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="https://www.linkedin.com/in/valipi-akhil-4925b424a"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, oklch(0.72 0.19 198), oklch(0.68 0.22 168))",
            color: "oklch(0.10 0.02 250)",
            boxShadow: "0 0 20px oklch(0.72 0.19 198 / 0.3)"
          }}
        >
          <Linkedin size={18} />
          Connect on LinkedIn
        </a>
        <a
          href="https://drive.google.com/file/d/1EQc58kB-IFNSJ-DIxE_6_u0aRzBogwZO/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105"
          style={{
            border: "2px solid oklch(0.72 0.19 198 / 0.6)",
            color: "oklch(0.72 0.19 198)",
            background: "transparent"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "oklch(0.72 0.19 198 / 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
          }}
        >
          <FileText size={18} />
          Download Resume
        </a>
      </div>
    </Section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="py-8 px-4 text-center"
      style={{ borderTop: "1px solid oklch(0.72 0.19 198 / 0.12)", background: "oklch(0.11 0.018 250)" }}
    >
      <p className="text-sm text-muted-foreground mb-3">
        © 2026 <span className="gradient-text font-semibold">Valipi Akhil</span>. All rights reserved.
      </p>
      <div className="flex items-center justify-center gap-4 mb-4">
        <a
          href="https://www.linkedin.com/in/valipi-akhil-4925b424a"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-all hover:scale-110"
          style={{ color: "oklch(0.62 0.04 240)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.72 0.19 198)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(0.62 0.04 240)"; }}
        >
          <Linkedin size={20} />
        </a>
        <a
          href="mailto:Valipiakhil26@gmail.com"
          className="transition-all hover:scale-110"
          style={{ color: "oklch(0.62 0.04 240)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "oklch(0.72 0.19 198)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "oklch(0.62 0.04 240)"; }}
        >
          <Mail size={20} />
        </a>
      </div>
      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
        Built with <Heart size={12} style={{ color: "oklch(0.72 0.19 198)" }} fill="oklch(0.72 0.19 198)" /> using{" "}
        <a
          href="https://caffeine.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="gradient-text hover:underline font-medium"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.018 250)" }}>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ExperienceSection />
        <ServicesSection />
        <ProjectsSection />
        <VolunteerSection />
        <LanguagesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
