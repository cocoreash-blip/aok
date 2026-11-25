import { useState, useEffect, useCallback } from "react";
import { useContent } from "./ContentContext.jsx";
import { applyThemeColors, getStoredTheme, applyTheme, toggleTheme } from "./themeUtils.js";
import { supabase } from "./supabaseClient.js";

const METAL_ICONS = {
  Steel: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <rect x="3" y="10" width="18" height="5" rx="1" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
    </svg>
  ),
  Aluminum: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" />
      <path d="M12 22V12" />
      <path d="M4 7l8 5 8-5" />
    </svg>
  ),
  Copper: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h16v6H4zM4 14h16v6H4z" />
      <circle cx="7" cy="7" r="1" />
      <circle cx="7" cy="17" r="1" />
    </svg>
  ),
  "Custom Cutting": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14.5 3.5l6 6-3 3-6-6 3-3zM3 21l9-9M3 21l3-1 2-2" />
    </svg>
  ),
};

function getIcon(name) {
  return METAL_ICONS[name] || METAL_ICONS["Steel"];
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(toggleTheme())}
      className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors"
      style={{
        borderColor: "var(--border-default)",
        color: "var(--nav-text)",
      }}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

function Nav({ content }) {
  const [scrolled, setScrolled] = useState(false);
  const brand = content.brand;
  const primary = content.colors.primary;
  const primaryHover = content.colors.primaryHover;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "none",
        paddingTop: scrolled ? "0.75rem" : "1.25rem",
        paddingBottom: scrolled ? "0.75rem" : "1.25rem",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          {brand?.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="h-10 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <>
              <span
                className="text-2xl font-heading font-700 tracking-tight"
                style={{ color: primary }}
              >
                {brand?.name || "FORGE"}
              </span>
              <span
                className="text-2xl font-heading font-700 tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {brand?.nameSecond || "WELL"}
              </span>
            </>
          )}
        </a>
        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-8 text-sm font-body" style={{ color: "var(--nav-text)" }}>
            <li>
              <a
                href="#products"
                onMouseEnter={(e) => (e.target.style.color = primary)}
                onMouseLeave={(e) => (e.target.style.color = "")}
                className="transition-colors"
              >
                Products
              </a>
            </li>
            <li>
              <a
                href="#specs"
                onMouseEnter={(e) => (e.target.style.color = primary)}
                onMouseLeave={(e) => (e.target.style.color = "")}
                className="transition-colors"
              >
                Specs
              </a>
            </li>
            <li>
              <a
                href="#about"
                onMouseEnter={(e) => (e.target.style.color = primary)}
                onMouseLeave={(e) => (e.target.style.color = "")}
                className="transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                onMouseEnter={(e) => (e.target.style.color = primary)}
                onMouseLeave={(e) => (e.target.style.color = "")}
                className="transition-colors"
              >
                Reviews
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onMouseEnter={(e) => (e.target.style.color = primary)}
                onMouseLeave={(e) => (e.target.style.color = "")}
                className="transition-colors"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="px-5 py-2 font-heading font-600 uppercase tracking-wide text-sm rounded transition-colors duration-200 text-white"
                style={{ backgroundColor: primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = primaryHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = primary)
                }
              >
                Get a Quote
              </a>
            </li>
          </ul>
          <ThemeToggle />
          <a
            href="#contact"
            className="md:hidden px-4 py-2 font-heading font-600 uppercase tracking-wide text-xs rounded text-white"
            style={{ backgroundColor: primary }}
          >
            Quote
          </a>
        </div>
      </nav>
    </header>
  );
}

function Stat({ value, label, primary }) {
  return (
    <div>
      <div
        className="font-heading font-700 text-2xl md:text-3xl"
        style={{ color: "var(--text-primary)" }}
      >
        {value}
      </div>
      <div className="text-xs font-body uppercase tracking-wide mt-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

function Hero({ content }) {
  const hero = content.hero;
  const primary = content.colors.primary;

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={hero?.image}
          alt="Industrial metal"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--hero-overlay-left), var(--hero-overlay-mid), var(--hero-overlay-right))",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--hero-bottom-fade), transparent 40%, rgba(0,0,0,0.25))",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-20">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
            <span
              className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
              style={{ color: primary }}
            >
              {hero?.eyebrow}
            </span>
          </div>
          <h1
            className="font-heading font-700 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-balance uppercase"
            style={{ color: "var(--text-primary)" }}
          >
            {hero?.titleLine1}
            <span className="block" style={{ color: primary }}>
              {hero?.titleLine2}
            </span>
          </h1>
          <p
            className="mt-6 text-lg font-body font-300 leading-relaxed max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            {hero?.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="px-8 py-3.5 font-heading font-600 uppercase tracking-wide rounded transition-all duration-200 hover:scale-[1.02] text-center text-white"
              style={{ backgroundColor: primary }}
            >
              {hero?.button1Text}
            </a>
            <a
              href="#about"
              className="px-8 py-3.5 border font-heading font-600 uppercase tracking-wide rounded transition-colors duration-200 text-center"
              style={{
                borderColor: "var(--border-default)",
                color: "var(--text-primary)",
              }}
            >
              {hero?.button2Text}
            </a>
          </div>

          {hero?.stats?.length > 0 && (
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {hero.stats.map((s, i) => (
                <Stat key={i} {...s} primary={primary} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 pb-6 flex justify-center">
        <a
          href="#about"
          className="hover:opacity-80 transition-opacity animate-bounce"
          style={{ color: "var(--text-muted)" }}
          aria-label="Scroll down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function About({ content }) {
  const about = content.about;
  const primary = content.colors.primary;

  return (
    <section id="about" className="relative py-24 md:py-32" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="relative">
            <img
              src={about?.image}
              alt="About"
              className="rounded-lg w-full object-cover aspect-[4/3] border"
              style={{ borderColor: "var(--border-subtle)" }}
            />
            <div
              className="absolute -bottom-5 -right-5 px-6 py-4 rounded-lg shadow-xl hidden sm:block text-white"
              style={{ backgroundColor: primary }}
            >
              <div className="font-heading font-700 text-3xl leading-none">
                {about?.badge}
              </div>
              <div className="text-xs uppercase tracking-wide font-600 mt-1">
                {about?.badgeLabel}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10" style={{ backgroundColor: primary }} />
              <span
                className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
                style={{ color: primary }}
              >
                {about?.eyebrow}
              </span>
            </div>
            <h2
              className="font-heading font-700 text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.1] text-balance"
              style={{ color: "var(--text-primary)" }}
            >
              {about?.title}{" "}
              <span style={{ color: primary }}>{about?.titleAccent}</span>
            </h2>
            <p
              className="mt-6 font-body font-300 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {about?.paragraph1}
            </p>
            <p
              className="mt-4 font-body font-300 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {about?.paragraph2}
            </p>

            {about?.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {about.tags.map((tag, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 border rounded text-sm font-body"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {about?.cards?.length > 0 && (
          <div className="mt-20 md:mt-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {about.cards.map((card, i) => (
                <div
                  key={i}
                  className="group p-6 border rounded-lg hover:-translate-y-1 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-subtle)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border-default)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border-subtle)")
                  }
                >
                  <div
                    className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: primary }}
                  >
                    {getIcon(card.name)}
                  </div>
                  <h3
                    className="font-heading font-600 text-lg uppercase"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {card.name}
                  </h3>
                  <p
                    className="mt-2 text-sm font-body leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Products({ content }) {
  const products = content.products;
  const primary = content.colors.primary;

  if (!products?.items?.length) return null;

  return (
    <section id="products" className="relative py-24 md:py-32" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
            <span
              className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
              style={{ color: primary }}
            >
              {products?.eyebrow}
            </span>
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
          </div>
          <h2
            className="font-heading font-700 text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.1] text-balance"
            style={{ color: "var(--text-primary)" }}
          >
            {products?.title}{" "}
            <span style={{ color: primary }}>{products?.titleAccent}</span>
          </h2>
          <p
            className="mt-6 font-body font-300 leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            {products?.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.items.map((item, i) => (
            <div
              key={i}
              className="group border rounded-lg overflow-hidden hover:-translate-y-1 transition-all duration-300"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-subtle)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-default)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border-subtle)")
              }
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <h3
                  className="font-heading font-600 uppercase text-sm tracking-wide"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.name}
                </h3>
                <p
                  className="mt-2 text-sm font-body leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {item.desc}
                </p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-heading font-600 uppercase tracking-wide transition-opacity hover:opacity-80"
                  style={{ color: primary }}
                >
                  Enquire
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Specs({ content }) {
  const specs = content.specs;
  const primary = content.colors.primary;

  if (!specs?.sizes?.length) return null;

  return (
    <section id="specs" className="relative py-24 md:py-32" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
            <span
              className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
              style={{ color: primary }}
            >
              {specs?.eyebrow}
            </span>
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
          </div>
          <h2
            className="font-heading font-700 text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.1] text-balance"
            style={{ color: "var(--text-primary)" }}
          >
            {specs?.title}{" "}
            <span style={{ color: primary }}>{specs?.titleAccent}</span>
          </h2>
          <p
            className="mt-6 font-body font-300 leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            {specs?.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border rounded-lg p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
            <h3
              className="font-heading font-600 uppercase text-sm tracking-wide mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Size Guide
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {specs.sizes.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded border"
                  style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
                >
                  <span
                    className="font-heading font-700 text-lg leading-none flex-shrink-0"
                    style={{ color: primary }}
                  >
                    {s.size}
                  </span>
                  <span
                    className="text-sm font-body leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {s.use}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {specs.chemical?.length > 0 && (
              <div className="border rounded-lg p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <h3
                  className="font-heading font-600 uppercase text-sm tracking-wide mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Chemical Composition
                </h3>
                <table className="w-full text-sm font-body">
                  <tbody>
                    {specs.chemical.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td className="py-2" style={{ color: "var(--text-muted)" }}>{row.property}</td>
                        <td className="py-2 text-right font-mono text-xs" style={{ color: "var(--text-primary)" }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {specs.mechanical?.length > 0 && (
              <div className="border rounded-lg p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
                <h3
                  className="font-heading font-600 uppercase text-sm tracking-wide mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Mechanical Properties
                </h3>
                <table className="w-full text-sm font-body">
                  <tbody>
                    {specs.mechanical.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                        <td className="py-2" style={{ color: "var(--text-muted)" }}>{row.property}</td>
                        <td className="py-2 text-right font-mono text-xs" style={{ color: "var(--text-primary)" }}>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Clients({ content }) {
  const clients = content.clients;
  const primary = content.colors.primary;

  if (!clients?.logos?.length) return null;

  return (
    <section className="relative py-16" style={{ backgroundColor: "var(--bg-base)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
            <span
              className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
              style={{ color: primary }}
            >
              {clients?.eyebrow}
            </span>
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
          </div>
          <h2
            className="font-heading font-700 text-2xl md:text-3xl uppercase leading-[1.1]"
            style={{ color: "var(--text-primary)" }}
          >
            {clients?.title}{" "}
            <span style={{ color: primary }}>{clients?.titleAccent}</span>
          </h2>
          <p
            className="mt-4 font-body font-300 leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            {clients?.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {clients.logos.map((logo, i) => (
            <div
              key={i}
              className="w-32 h-20 flex items-center justify-center border rounded-lg p-3"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
            >
              {logo ? (
                <img
                  src={logo}
                  alt="Client"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-xs font-body" style={{ color: "var(--text-faint)" }}>Logo</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ item, primary }) {
  return (
    <div
      className="p-6 border rounded-lg flex flex-col"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}
    >
      <div className="flex gap-1 mb-4">
        {Array.from({ length: item.rating || 5 }).map((_, j) => (
          <svg key={j} viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: primary }}>
            <path d="M12 2l3 6 6 .9-4.5 4.4 1 6.7L12 17.5 6.5 20l1-6.7L3 8.9 9 8z" />
          </svg>
        ))}
      </div>
      <p className="font-body leading-relaxed flex-1" style={{ color: "var(--text-secondary)" }}>
        "{item.text}"
      </p>
      <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <div
          className="font-heading font-600 text-sm uppercase tracking-wide"
          style={{ color: "var(--text-primary)" }}
        >
          {item.name}
        </div>
        {item.location && (
          <div className="text-xs font-body mt-1" style={{ color: "var(--text-muted)" }}>
            {item.location}
          </div>
        )}
      </div>
    </div>
  );
}

function Testimonials({ content, approvedReviews }) {
  const testimonials = content.testimonials;
  const primary = content.colors.primary;

  const manualItems = testimonials?.items || [];
  const allItems = [...manualItems, ...approvedReviews];

  if (!allItems.length) return null;

  return (
    <section id="testimonials" className="relative py-24 md:py-32" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
            <span
              className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
              style={{ color: primary }}
            >
              {testimonials?.eyebrow}
            </span>
            <span className="h-px w-10" style={{ backgroundColor: primary }} />
          </div>
          <h2
            className="font-heading font-700 text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.1] text-balance"
            style={{ color: "var(--text-primary)" }}
          >
            {testimonials?.title}{" "}
            <span style={{ color: primary }}>{testimonials?.titleAccent}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {allItems.map((item, i) => (
            <ReviewCard key={`rev-${i}`} item={item} primary={primary} />
          ))}
        </div>

        <ReviewForm primary={primary} />
      </div>
    </section>
  );
}

function ReviewForm({ primary }) {
  const [form, setForm] = useState({ name: "", email: "", location: "", rating: 5, text: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "rating" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const { error } = await supabase.from("customer_reviews").insert({
        name: form.name,
        email: form.email || null,
        location: form.location || null,
        rating: form.rating,
        text: form.text,
        is_approved: false,
      });
      if (error) throw error;
      setStatus("submitted");
      setForm({ name: "", email: "", location: "", rating: 5, text: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass = "w-full px-4 py-3 border rounded focus:outline-none focus:ring-1 transition-colors";

  if (status === "submitted") {
    return (
      <div className="max-w-xl mx-auto p-8 border rounded-lg text-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
          style={{ backgroundColor: primary }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-8 h-8">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="font-heading font-600 text-2xl uppercase" style={{ color: "var(--text-primary)" }}>
          Thank You!
        </h3>
        <p className="mt-2 font-body" style={{ color: "var(--text-secondary)" }}>
          Your review has been submitted and will appear on our site after approval.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="max-w-xl mx-auto p-8 border rounded-lg text-center" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto bg-red-500/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-red-400">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
        <h3 className="font-heading font-600 text-2xl uppercase" style={{ color: "var(--text-primary)" }}>
          Something Went Wrong
        </h3>
        <p className="mt-2 font-body" style={{ color: "var(--text-secondary)" }}>
          Your review couldn't be submitted. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="font-heading font-600 text-xl uppercase mb-2" style={{ color: "var(--text-primary)" }}>
          Leave a Review
        </h3>
        <p className="text-sm font-body" style={{ color: "var(--text-muted)" }}>
          Share your experience working with us. Your review will appear after approval.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-subtle)",
                color: "var(--input-text)",
              }}
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
              Location
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-subtle)",
                color: "var(--input-text)",
              }}
              placeholder="Lagos, Nigeria"
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
              Email (optional)
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass}
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-subtle)",
                color: "var(--input-text)",
              }}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className={inputClass}
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--border-subtle)",
                color: "var(--input-text)",
              }}
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Very Good</option>
              <option value={3}>3 Stars - Good</option>
              <option value={2}>2 Stars - Fair</option>
              <option value={1}>1 Star - Poor</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
            Your Review *
          </label>
          <textarea
            name="text"
            required
            rows="4"
            value={form.text}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            style={{
              backgroundColor: "var(--input-bg)",
              borderColor: "var(--border-subtle)",
              color: "var(--input-text)",
            }}
            placeholder="Tell us about your experience..."
          />
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full px-8 py-3.5 font-heading font-600 uppercase tracking-wide rounded transition-all duration-200 hover:scale-[1.01] text-white disabled:opacity-60 disabled:scale-100"
          style={{ backgroundColor: primary }}
        >
          {status === "submitting" ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

function WhatsAppButton({ content }) {
  const wa = content.whatsapp;
  if (!wa?.phoneNumber) return null;

  const href = `https://wa.me/${wa.phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(wa.message || "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.582 0 11.94-5.335 11.944-11.893a11.821 11.821 0 00-3.495-8.453z" />
      </svg>
    </a>
  );
}

function ContactInfo({ label, value, icon, primary }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="w-10 h-10 flex-shrink-0 border rounded-lg flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)", color: primary }}
      >
        <div className="w-5 h-5">{icon}</div>
      </div>
      <div>
        <div className="text-xs font-body uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          {label}
        </div>
        <div className="font-body mt-1" style={{ color: "var(--text-primary)" }}>{value}</div>
      </div>
    </div>
  );
}

function Contact({ content }) {
  const contact = content.contact;
  const primary = content.colors.primary;
  const primaryHover = content.colors.primaryHover;
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Request failed");
      }
      setStatus("sent");
      setForm({ name: "", email: "", company: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const bgColor = contact?.backgroundColor || "#111113";

  return (
    <section
      id="contact"
      className="relative py-24 md:py-32"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to bottom, var(--contact-overlay), transparent)" }}
      />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10" style={{ backgroundColor: primary }} />
              <span
                className="font-heading font-500 uppercase tracking-[0.2em] text-sm"
                style={{ color: primary }}
              >
                {contact?.eyebrow}
              </span>
            </div>
            <h2
              className="font-heading font-700 text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.1] text-balance"
              style={{ color: "var(--text-primary)" }}
            >
              {contact?.title}
            </h2>
            <p
              className="mt-6 font-body font-300 leading-relaxed max-w-md"
              style={{ color: "var(--text-secondary)" }}
            >
              {contact?.description}
            </p>

            <div className="mt-10 space-y-5">
              <ContactInfo
                label="Phone"
                value={contact?.phone}
                primary={primary}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                }
              />
              <ContactInfo
                label="Email"
                value={contact?.email}
                primary={primary}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 5L2 7" />
                  </svg>
                }
              />
              <ContactInfo
                label="Yard & Office"
                value={contact?.address}
                primary={primary}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                }
              />
              <ContactInfo
                label="Hours"
                value={contact?.hours}
                primary={primary}
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="p-8 border rounded-lg" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-subtle)" }}>
            {status === "sent" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: primary }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-8 h-8">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-heading font-600 text-2xl uppercase" style={{ color: "var(--text-primary)" }}>
                  Message Sent
                </h3>
                <p className="mt-2 font-body" style={{ color: "var(--text-secondary)" }}>
                  Thanks for reaching out. We'll get back to you within one business day.
                </p>
              </div>
            ) : status === "error" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-500/20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-red-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M15 9l-6 6M9 9l6 6" />
                  </svg>
                </div>
                <h3 className="font-heading font-600 text-2xl uppercase" style={{ color: "var(--text-primary)" }}>
                  Something Went Wrong
                </h3>
                <p className="mt-2 font-body" style={{ color: "var(--text-secondary)" }}>
                  Your message couldn't be sent. Please try again or call us directly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-1 transition-colors"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--input-text)",
                      "--tw-ring-color": primary,
                    }}
                    placeholder="John Smith"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-1 transition-colors"
                      style={{
                        backgroundColor: "var(--input-bg)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--input-text)",
                        "--tw-ring-color": primary,
                      }}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-1 transition-colors"
                      style={{
                        backgroundColor: "var(--input-bg)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--input-text)",
                        "--tw-ring-color": primary,
                      }}
                      placeholder="Smith Fabrication"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-body mb-2" style={{ color: "var(--text-secondary)" }}>
                    What do you need?
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-1 transition-colors resize-none"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      borderColor: "var(--border-subtle)",
                      color: "var(--input-text)",
                      "--tw-ring-color": primary,
                    }}
                    placeholder="Grade, dimensions, quantity, timeline..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full px-8 py-3.5 font-heading font-600 uppercase tracking-wide rounded transition-all duration-200 hover:scale-[1.01] text-white disabled:opacity-60 disabled:scale-100"
                  style={{ backgroundColor: primary }}
                  onMouseEnter={(e) => {
                    if (status !== "sending") e.currentTarget.style.backgroundColor = primaryHover;
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = primary)}
                >
                  {status === "sending" ? "Sending..." : contact?.buttonText}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ content }) {
  const footer = content.footer;
  const brand = content.brand;
  const primary = content.colors.primary;

  return (
    <footer className="border-t py-12" style={{ backgroundColor: "var(--bg-base)", borderTopColor: "var(--border-subtle)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {brand?.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-8 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <span className="text-xl font-heading font-700 tracking-tight" style={{ color: primary }}>
                    {brand?.name}
                  </span>
                  <span className="text-xl font-heading font-700 tracking-tight" style={{ color: "var(--text-primary)" }}>
                    {brand?.nameSecond}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm font-body max-w-xs" style={{ color: "var(--text-muted)" }}>
              {footer?.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 text-sm font-body">
            <a href="#products" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)" }}>Products</a>
            <a href="#specs" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)" }}>Specs</a>
            <a href="#about" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)" }}>About</a>
            <a href="#testimonials" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)" }}>Reviews</a>
            <a href="#contact" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)" }}>Contact</a>
            <a href="#top" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)" }}>Back to Top</a>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <p className="text-xs font-body" style={{ color: "var(--text-faint)" }}>
            © {new Date().getFullYear()} {footer?.copyright}
          </p>
          <div className="flex gap-4">
            <a href="#" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-faint)" }} aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a href="#" className="transition-opacity hover:opacity-80" style={{ color: "var(--text-faint)" }} aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function useApprovedReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("customer_reviews")
        .select("name, location, rating, text")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    };

    load();

    const channel = supabase
      .channel("approved_reviews_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customer_reviews" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return reviews;
}

export default function PublicSite() {
  const { content, loading } = useContent();
  const approvedReviews = useApprovedReviews();

  useEffect(() => {
    applyThemeColors(content.colors);
  }, [content.colors]);

  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="font-heading text-xl uppercase tracking-widest animate-pulse" style={{ color: "var(--text-muted)" }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: "var(--bg-base)" }}>
      <Nav content={content} />
      <main>
        <Hero content={content} />
        <Products content={content} />
        <About content={content} />
        <Specs content={content} />
        <Testimonials content={content} approvedReviews={approvedReviews} />
        <Clients content={content} />
        <Contact content={content} />
      </main>
      <Footer content={content} />
      <WhatsAppButton content={content} />
    </div>
  );
}
