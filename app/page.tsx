"use client";

import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/instrument-sans";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

const instagram = "https://www.instagram.com/hetberkenbos/";
const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

const seasons = [
  {
    id: "lente",
    asset: "spring",
    number: "01",
    title: "Open",
    lead: "Ramen open. Jong groen. Een ochtend die nergens heen hoeft.",
    note: "Bloesem · zacht licht · frisse lucht",
  },
  {
    id: "zomer",
    asset: "summer",
    number: "02",
    title: "Buiten",
    lead: "Lange dagen in de tuin en pas naar binnen wanneer het licht verdwijnt.",
    note: "Goud · lange avonden · blote voeten",
  },
  {
    id: "herfst",
    asset: "autumn",
    number: "03",
    title: "Warm",
    lead: "Kleur in het bos, iets warms op tafel en alle tijd om binnen te landen.",
    note: "Aards · stil · langzaam",
  },
  {
    id: "winter",
    asset: "winter",
    number: "04",
    title: "Stil",
    lead: "Kale takken, helder licht en een kleine wereld helemaal voor jezelf.",
    note: "Helder · dichtbij · niets hoeven",
  },
];

const moments = [
  { time: "08:12", title: "Langzaam wakker", image: "breakfast.jpg", text: "Vers ontbijt, goede koffie en geen uitchecktijd in je hoofd." },
  { time: "14:36", title: "Naar buiten", image: "garden.jpg", text: "Door Hauwert, langs lintdorpen en over het open West-Friese land." },
  { time: "20:41", title: "Weer thuis", image: "suite.jpg", text: "De deur dicht. Het laatste licht aan. De avond is van jullie." },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function BookingForm({ dark = false }: { dark?: boolean }) {
  const today = new Date().toISOString().split("T")[0];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(instagram, "_blank", "noopener,noreferrer");
  };

  return (
    <form className={`booking${dark ? " booking-dark" : ""}`} onSubmit={submit}>
      <label><span>Aankomst</span><input type="date" name="arrival" min={today} aria-label="Aankomstdatum" /></label>
      <label><span>Vertrek</span><input type="date" name="departure" min={today} aria-label="Vertrekdatum" /></label>
      <label><span>Gasten</span><select name="guests" defaultValue="2" aria-label="Aantal gasten"><option value="1">1 gast</option><option value="2">2 gasten</option><option value="3">3 gasten</option><option value="4">4 gasten</option></select></label>
      <button type="submit"><span>Vraag je verblijf aan</span><Arrow /></button>
    </form>
  );
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [activeSeason, setActiveSeason] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const seasonRefs = useRef<(HTMLElement | null)[]>([]);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const currentSeason = seasons[activeSeason];

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("visible")),
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

    const seasonObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSeason(Number((visible.target as HTMLElement).dataset.season));
      },
      { rootMargin: "-36% 0px -36% 0px", threshold: [0.05, 0.35, 0.7] },
    );
    seasonRefs.current.forEach((element) => element && seasonObserver.observe(element));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setCompactHeader(window.scrollY > 72);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const moveCursor = (event: PointerEvent) => {
      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };
    const cursorOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      cursorRef.current?.classList.toggle("active", Boolean(target?.closest("a, button, figure, .moment")));
    };
    const moveHero = (event: PointerEvent) => {
      const hero = heroRef.current;
      if (!hero) return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      hero.style.setProperty("--hero-x", `${x * 18}px`);
      hero.style.setProperty("--hero-y", `${y * 13}px`);
      hero.style.setProperty("--copy-x", `${x * 12}px`);
      hero.style.setProperty("--copy-y", `${y * 7}px`);
    };
    const resetHero = () => {
      const hero = heroRef.current;
      if (!hero) return;
      hero.style.setProperty("--hero-x", "0px");
      hero.style.setProperty("--hero-y", "0px");
      hero.style.setProperty("--copy-x", "0px");
      hero.style.setProperty("--copy-y", "0px");
    };
    window.addEventListener("pointermove", moveCursor, { passive: true });
    document.addEventListener("pointerover", cursorOver, { passive: true });
    heroRef.current?.addEventListener("pointermove", moveHero, { passive: true });
    heroRef.current?.addEventListener("pointerleave", resetHero);

    return () => {
      revealObserver.disconnect();
      seasonObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", moveCursor);
      document.removeEventListener("pointerover", cursorOver);
      heroRef.current?.removeEventListener("pointermove", moveHero);
      heroRef.current?.removeEventListener("pointerleave", resetHero);
    };
  }, []);

  return (
    <main className={`site season-${activeSeason}`} style={{ "--page-progress": progress } as CSSProperties}>
      <div className="progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>
      <div className="cursor-orb" ref={cursorRef} aria-hidden="true" />

      <header className={`${compactHeader ? "compact " : ""}${menuOpen ? "open" : ""}`}>
        <a className="brand" href="#top" aria-label="B&B Het Berkenbos, naar boven"><img src={asset("berkenbos-logo-white.png")} alt="B&B Het Berkenbos" /></a>
        <div className="nav-cluster">
          <nav className="main-nav" aria-label="Hoofdnavigatie"><a href="#verblijf">Verblijf</a><a href="#seizoenen">Seizoenen</a><a href="#ritme">Hauwert</a></nav>
          <a className="nav-book" href="#boeken">Beschikbaarheid <Arrow /></a>
        </div>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)}><span>{menuOpen ? "Sluit" : "Menu"}</span><i /></button>
        <div className="mobile-menu" id="mobile-menu" aria-hidden={!menuOpen}><nav><a href="#verblijf" onClick={() => setMenuOpen(false)}>Het verblijf</a><a href="#seizoenen" onClick={() => setMenuOpen(false)}>Vier seizoenen</a><a href="#ritme" onClick={() => setMenuOpen(false)}>Hauwert</a><a href="#boeken" onClick={() => setMenuOpen(false)}>Boeken</a></nav></div>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-media" style={{ backgroundImage: `url("${asset("hero.jpg")}")` }} aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-coordinate"><span>52°42&apos;N</span><span>05°06&apos;E</span></div>
        <div className="hero-copy">
          <p>Bed &amp; Barn · Hauwert</p>
          <h1><span>Het</span><strong>Berken</strong><strong>Bos</strong></h1>
        </div>
        <div className="hero-note"><span>Voor twee tot vier gasten</span><p>Een eigen plek tussen bos, tuin en het open land.</p></div>
        <a className="hero-scroll" href="#intro"><span>Begin</span><i>↓</i></a>
      </section>

      <section className="manifesto" id="intro">
        <div className="section-rail"><span>00</span><span>Het Berkenbos</span><span>Hauwert, Noord-Holland</span></div>
        <div className="manifesto-grid">
          <h2 data-reveal>Hier hoef je<br />even helemaal<br /><em>nergens heen.</em></h2>
          <div className="manifesto-copy" data-reveal><p>Geen hotelgang. Geen druk programma. Wel een vrijstaand barnhouse, 3.000 m² groen en het soort stilte dat je pas hoort wanneer je aankomt.</p><a href="#verblijf">Ontdek het verblijf <Arrow /></a></div>
          <figure className="manifesto-image" data-reveal><img src={asset("suite.jpg")} alt="Het rustige interieur van het barnhouse" /><span className="image-hover">Bekijk</span><figcaption><span>Eigen entree</span><span>Eigen ritme</span></figcaption></figure>
          <p className="manifesto-whisper">Binnen warm.<br />Buiten dichtbij.</p>
        </div>
      </section>

      <div className="ticker" aria-hidden="true"><div><span>Buiten begint hier</span><i>✦</i><span>Vier seizoenen</span><i>✦</i><span>Alle tijd</span><i>✦</i><span>Buiten begint hier</span><i>✦</i><span>Vier seizoenen</span><i>✦</i><span>Alle tijd</span><i>✦</i></div></div>

      <section className="season-story" id="seizoenen">
        <div className="season-stage">
          <div className="season-surfaces" aria-hidden="true"><i className="surface spring" /><i className="surface summer" /><i className="surface autumn" /><i className="surface winter" /></div>
          <div className="season-word" aria-hidden="true" key={`word-${activeSeason}`}>{currentSeason.id}</div>
          <div className="season-tree-stack" aria-hidden="true">
            {seasons.map((season, index) => <img key={season.id} className={activeSeason === index ? "active" : ""} src={asset(`tree-${season.asset}.png`)} alt="" />)}
          </div>
          <div className="season-weather" aria-hidden="true">
            {seasons.map((season, index) => <div key={season.id} className={`weather weather-${season.asset}${activeSeason === index ? " active" : ""}`}>{Array.from({ length: 14 }).map((_, item) => <i key={item} />)}</div>)}
          </div>
          <div className="season-index"><span>0{activeSeason + 1}</span><i /><span>04</span></div>
          <div className="season-detail" aria-live="polite" key={`detail-${activeSeason}`}>
            <span>{currentSeason.note}</span>
            <h2>{currentSeason.title}</h2>
            <p>{currentSeason.lead}</p>
            <a href="#boeken">Kom dit seizoen <Arrow /></a>
          </div>
          <nav className="season-nav" aria-label="Kies een seizoen">
            {seasons.map((season, index) => <a key={season.id} href={`#${season.id}`} className={activeSeason === index ? "active" : ""}><span>{season.number}</span>{season.id}</a>)}
          </nav>
          <div className="season-instruction">Scroll door het jaar <span>↓</span></div>
        </div>
        <div className="season-steps">
          {seasons.map((season, index) => <article key={season.id} id={season.id} data-season={index} ref={(element) => { seasonRefs.current[index] = element; }}><span>{season.id}</span></article>)}
        </div>
      </section>

      <section className="residence" id="verblijf">
        <div className="section-rail section-rail-light"><span>01</span><span>Het verblijf</span><span>2–4 gasten</span></div>
        <div className="residence-head" data-reveal><h2>Een huisje<br />dat van jullie<br /><em>voelt.</em></h2><p>Vrijstaand, ruim en warm. Ontworpen om binnen net zo graag te zijn als buiten.</p></div>
        <figure className="residence-image" data-reveal><img src={asset("suite.jpg")} alt="De slaapkamer van B&B Het Berkenbos" /><span className="image-hover image-hover-light">Verblijf</span><div className="image-mark"><span>B&amp;B</span><strong>01</strong><span>Hauwert</span></div></figure>
        <div className="residence-specs">
          <div><span>01</span><p>Vrijstaand<br />barnhouse</p></div>
          <div><span>02</span><p>3.000 m²<br />tuin &amp; bos</p></div>
          <div><span>03</span><p>Ontbijt op<br />eigen tempo</p></div>
          <div><span>04</span><p>Rust in<br />West-Friesland</p></div>
        </div>
      </section>

      <section className="day" id="ritme">
        <div className="section-rail"><span>02</span><span>Een dag hier</span><span>Op jouw tempo</span></div>
        <div className="day-head" data-reveal><h2>Alle tijd<br />van de wereld.</h2><p>Geen checklist. Alleen drie ideeën voor een dag die vanzelf loopt.</p></div>
        <div className="moments">
          {moments.map((moment, index) => <article className="moment" key={moment.time} data-reveal><span className="moment-number">0{index + 1}</span><div><span>{moment.time}</span><h3>{moment.title}</h3></div><figure><img src={asset(moment.image)} alt={moment.title} /></figure><p>{moment.text}</p></article>)}
        </div>
      </section>

      <section className="booking-section" id="boeken">
        <div className="booking-photo" style={{ backgroundImage: `url("${asset("garden.jpg")}")` }} aria-hidden="true" />
        <div className="booking-shade" aria-hidden="true" />
        <div className="booking-copy" data-reveal><span>Jouw verblijf</span><h2>Wanneer wordt<br />dit even<br /><em>van jou?</em></h2><p>Kies je data. We nemen daarna persoonlijk contact met je op.</p></div>
        <div className="booking-panel" data-reveal><BookingForm dark /><p>Of stuur ons direct een bericht via <a href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a></p></div>
      </section>

      <footer>
        <div className="footer-brand"><img src={asset("berkenbos-logo-white.png")} alt="B&B Het Berkenbos" /><p>Vier seizoenen.<br />Eén plek.</p></div>
        <div className="footer-links"><div><span>Adres</span><p>Hauwert<br />Noord-Holland</p></div><div><span>Volg</span><a href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a></div><div><span>Navigeer</span><a href="#verblijf">Verblijf</a><a href="#seizoenen">Seizoenen</a><a href="#boeken">Boeken</a></div></div>
        <a className="footer-cta" href="#boeken"><span>Boek je rust</span><Arrow /></a>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Het Berkenbos</span><span>Bed &amp; Barn · Hauwert</span></div>
      </footer>
    </main>
  );
}
