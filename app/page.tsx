"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

const instagram = "https://www.instagram.com/hetberkenbos/";
const seasons = ["Lente", "Zomer", "Herfst", "Winter"];
const seasonAssets = ["spring", "summer", "autumn", "winter"];
const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

function BookingForm({ compact = false }: { compact?: boolean }) {
  const today = new Date().toISOString().split("T")[0];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(instagram, "_blank", "noopener,noreferrer");
  };

  return (
    <form className={`booking-form ${compact ? "booking-form-compact" : ""}`} onSubmit={submit}>
      <label>
        <span>Aankomst</span>
        <input type="date" name="arrival" min={today} aria-label="Aankomstdatum" />
      </label>
      <label>
        <span>Vertrek</span>
        <input type="date" name="departure" min={today} aria-label="Vertrekdatum" />
      </label>
      <label>
        <span>Gasten</span>
        <select name="guests" defaultValue="2" aria-label="Aantal gasten">
          <option value="1">1 gast</option>
          <option value="2">2 gasten</option>
          <option value="3">3 gasten</option>
          <option value="4">4 gasten</option>
        </select>
      </label>
      <button type="submit">Bekijk beschikbaarheid <span aria-hidden="true">↗</span></button>
    </form>
  );
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [heroOffset, setHeroOffset] = useState(0);
  const [activeSeason, setActiveSeason] = useState(0);
  const [seasonPosition, setSeasonPosition] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerCompact, setHeaderCompact] = useState(false);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const seasonRefs = useRef<(HTMLElement | null)[]>([]);
  const journeyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setHeroOffset(Math.min(window.scrollY * 0.18, 150));
      setHeaderCompact(window.scrollY > 48);
      setShowMobileBooking(window.scrollY > window.innerHeight * 0.78);

      const journey = journeyRef.current;
      if (journey) {
        const focusLine = window.innerHeight * 0.52;
        let position = 0;
        seasonRefs.current.forEach((section, index) => {
          if (!section) return;
          const rect = section.getBoundingClientRect();
          if (focusLine >= rect.top && focusLine <= rect.bottom) {
            const local = Math.max(0, Math.min(1, (focusLine - rect.top) / rect.height));
            const blend = index < seasons.length - 1 ? Math.max(0, Math.min(1, (local - 0.48) / 0.42)) : 0;
            position = index + blend;
          }
        });
        setSeasonPosition(position);
      }
    };
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { revealObserver.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  const treeOpacity = (index: number) => Math.max(0, Math.min(1, 1 - Math.abs(seasonPosition - index)));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveSeason(Number((current.target as HTMLElement).dataset.season));
      },
      { rootMargin: "-34% 0px -34% 0px", threshold: [0.05, 0.3, 0.6] },
    );
    seasonRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <div className="progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>

      <header className={`site-header${menuOpen ? " menu-open" : ""}${headerCompact ? " is-compact" : ""}`}>
        <a className="brand-logo" href="#top" aria-label="Het Berkenbos, naar boven">
          <img src={asset("berkenbos-logo-white.png")} alt="B&B Het Berkenbos" />
        </a>
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          <a href="#overnachten">Overnachten</a><a href="#kamers">Kamers</a><a href="#omgeving">Omgeving</a><a href="#verhaal">Het Berkenbos</a><a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href={instagram} target="_blank" rel="noreferrer">Boek je verblijf <span>↗</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((value) => !value)}>
          <span>{menuOpen ? "Sluiten" : "Menu"}</span><i aria-hidden="true" />
        </button>
        <div className="mobile-nav" id="mobile-nav" aria-hidden={!menuOpen}>
          <nav>
            <a href="#overnachten" onClick={() => setMenuOpen(false)}>Overnachten</a><a href="#kamers" onClick={() => setMenuOpen(false)}>Kamers</a><a href="#omgeving" onClick={() => setMenuOpen(false)}>Omgeving</a><a href="#verhaal" onClick={() => setMenuOpen(false)}>Het Berkenbos</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" style={{ backgroundImage: `url("${asset("hero.jpg")}")`, transform: `translate3d(0, ${heroOffset}px, 0) scale(1.08)` }} aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Bed &amp; Barn · Hauwert</p>
          <h1>Even helemaal <em>weg.</em></h1>
          <p>Overnachten tussen de rust en het groen van Het Berkenbos.</p>
          <div className="hero-actions">
            <a className="button button-light" href="#beschikbaarheid">Bekijk beschikbaarheid <span>↗</span></a>
            <a className="button button-quiet" href="#verhaal">Ontdek Het Berkenbos <span>↓</span></a>
          </div>
        </div>
        <div className="hero-booking" id="beschikbaarheid"><BookingForm /></div>
        <a className="hero-scroll-cue" href="#verhaal"><span>Volg de berk</span><i aria-hidden="true" /></a>
      </section>

      <div
        ref={journeyRef}
        className={`season-journey season-${activeSeason}`}
      >
        <div className="tree-stage" aria-hidden="true">
          <div className="tree-sticky">
            <div className="seasonal-sky">
              <i className="sky-layer sky-spring" />
              <i className="sky-layer sky-summer" />
              <i className="sky-layer sky-autumn" />
              <i className="sky-layer sky-winter" />
            </div>
            <div className="tree-portrait">
              {seasons.map((season, index) => (
                <img
                  key={season}
                  className={activeSeason === index ? "active" : ""}
                  style={{ opacity: treeOpacity(index) }}
                  src={asset(`tree-${seasonAssets[index]}.png`)}
                  alt=""
                />
              ))}
            </div>
            <div className="seasonal-motion">
              {seasonAssets.map((season) => (
                <div className={`season-motion motion-${season}`} key={season}>
                  {Array.from({ length: 10 }).map((_, index) => <i key={index} />)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <nav className="season-rail" aria-label="Ga naar seizoen">
          {seasons.map((season, index) => (
            <a key={season} href={`#season-${seasonAssets[index]}`} className={activeSeason === index ? "active" : ""} aria-label={`Ga naar ${season}`}>
              <i /><span>{season}</span>
            </a>
          ))}
        </nav>

        <section
          id="verhaal"
          className="season-section spring-section"
          data-season="0"
          ref={(el) => { seasonRefs.current[0] = el; }}
        >
          <span className="season-anchor" id="season-spring" />
          <div className="season-copy reveal" data-reveal>
            <p className="eyebrow">Lente · Ontdek Het Berkenbos</p>
            <h2>Wakker worden<br /><em>tussen het groen.</em></h2>
            <p>In Hauwert staat een barnhouse met een tuin van 3.000 m² en een klein bos van zilverberken. Een plek waar de ochtend zacht begint en niets haast heeft.</p>
          </div>
          <div className="spring-gallery" aria-label="Sfeerbeelden van Het Berkenbos">
            <figure className="gallery-main reveal" data-reveal><img src={asset("suite.jpg")} alt="Sfeervol ingerichte kamer" loading="lazy" /><figcaption>Het barnhouse</figcaption></figure>
            <figure className="gallery-small reveal" data-reveal><img src={asset("breakfast.jpg")} alt="Ontbijt met koffie en croissants" loading="lazy" /><figcaption>De ochtend</figcaption></figure>
            <figure className="gallery-wide reveal" data-reveal><img src={asset("hero.jpg")} alt="Groen landschap in de ochtend" loading="lazy" /><figcaption>3.000 m² buiten</figcaption></figure>
          </div>
        </section>

        <section
          id="kamers"
          className="season-section summer-section"
          data-season="1"
          ref={(el) => { seasonRefs.current[1] = el; }}
        >
          <span className="season-anchor" id="season-summer" />
          <div className="summer-heading reveal" data-reveal>
            <p className="eyebrow">Zomer · Overnachten</p>
            <h2>Een plek om<br /><em>tot rust te komen.</em></h2>
          </div>
          <article className="room-feature" id="overnachten">
            <div className="room-image reveal" data-reveal><img src={asset("suite.jpg")} alt="Het lichte barnhouse van Het Berkenbos" loading="lazy" /></div>
            <div className="room-copy reveal" data-reveal>
              <span className="room-number">Het verblijf · 01</span>
              <h3>Het Barnhouse</h3>
              <p>Een warm, eigen verblijf met het groen direct buiten. Helemaal klaar voor een paar rustige dagen in Hauwert.</p>
              <div className="room-meta"><span>Prijs op aanvraag</span><a href={instagram} target="_blank" rel="noreferrer">Bekijk het verblijf ↗</a></div>
            </div>
          </article>

          <div className="inline-booking reveal" id="boeken" data-reveal>
            <div><p className="eyebrow">Direct beschikbaar?</p><h3>Wanneer wil je komen?</h3></div>
            <BookingForm compact />
          </div>
        </section>

        <section
          id="omgeving"
          className="season-section autumn-section"
          data-season="2"
          ref={(el) => { seasonRefs.current[2] = el; }}
        >
          <span className="season-anchor" id="season-autumn" />
          <div className="autumn-intro reveal" data-reveal>
            <p className="eyebrow">Herfst · De omgeving</p>
            <h2>Elk seizoen heeft hier<br /><em>iets bijzonders.</em></h2>
            <p>Ontdek West-Friesland op je eigen tempo — of blijf juist lekker dicht bij huis.</p>
          </div>
          <div className="experiences">
            <article className="experience reveal" data-reveal><span>01</span><div><h3>Naar buiten</h3><p>Wandelen en fietsen langs open land en stille wegen.</p></div></article>
            <article className="experience reveal" data-reveal><span>02</span><div><h3>Om je heen kijken</h3><p>Dorpjes, lokale adressen en het echte Noord-Holland.</p></div></article>
            <article className="experience reveal" data-reveal><span>03</span><div><h3>Nergens heen</h3><p>Een plek in de tuin. Verder hoeft er niets.</p></div></article>
          </div>
          <figure className="autumn-image reveal" data-reveal><img src={asset("hero.jpg")} alt="Het open Noord-Hollandse landschap" loading="lazy" /></figure>
        </section>

        <section
          className="season-section winter-section"
          data-season="3"
          ref={(el) => { seasonRefs.current[3] = el; }}
        >
          <span className="season-anchor" id="season-winter" />
          <div className="review-wrap reveal" data-reveal>
            <p className="eyebrow">Gasten over Het Berkenbos</p>
            <blockquote>“Een heerlijke plek om echt even <em>tot rust te komen.</em>”</blockquote>
            <div className="review-meta"><span aria-label="5 van 5 sterren">★★★★★</span><i>Een verblijf om te onthouden</i></div>
          </div>
        </section>
      </div>

      <section className="closing-section" id="contact">
        <div className="closing-image" style={{ backgroundImage: `linear-gradient(90deg, rgba(9,15,11,.78), rgba(9,15,11,.25)), linear-gradient(0deg, rgba(9,15,11,.58), transparent 50%), url("${asset("hero.jpg")}")` }} aria-hidden="true" />
        <div className="closing-content reveal" data-reveal>
          <p className="eyebrow">Winter · Rust</p>
          <h2>Soms hoef je even<br /><em>helemaal niets.</em></h2>
          <p>Het hele jaar door is Het Berkenbos een plek om weg te zijn — en je toch meteen thuis te voelen.</p>
          <a className="button button-light" href={instagram} target="_blank" rel="noreferrer">Boek je verblijf <span>↗</span></a>
        </div>
        <div className="closing-question">Wanneer kom jij tot rust?</div>
      </section>

      <footer>
        <img src={asset("berkenbos-logo-white.png")} alt="B&B Het Berkenbos" />
        <div><span>Bed &amp; Barn</span><span>Hauwert · Noord-Holland</span><a href={instagram} target="_blank" rel="noreferrer">Instagram ↗</a></div>
        <p>© {new Date().getFullYear()} Het Berkenbos</p>
      </footer>

      <a className={`mobile-booking-bar${showMobileBooking ? " is-visible" : ""}`} href="#boeken">Bekijk beschikbaarheid <span>→</span></a>
    </main>
  );
}
