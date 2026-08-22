"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";

const instagram = "https://www.instagram.com/hetberkenbos/";
const asset = (name: string) => `${import.meta.env.BASE_URL}${name}`;

const seasons = [
  {
    id: "lente",
    asset: "spring",
    number: "01",
    title: "Alles begint\nopnieuw.",
    lead: "Zacht licht, jong groen en een ontbijt waarvoor je rustig blijft zitten.",
    detail: "De ramen open. Vogels in de berken. Een ochtend zonder planning.",
    note: "Bloesem · Fris · Licht",
  },
  {
    id: "zomer",
    asset: "summer",
    number: "02",
    title: "De dag mag\nlang duren.",
    lead: "Buiten leven, dwalen door West-Friesland en terugkomen wanneer het licht goud wordt.",
    detail: "Een boek in de tuin, een route langs de lintdorpen en nergens haast voor.",
    note: "Buiten · Goud · Vrij",
  },
  {
    id: "herfst",
    asset: "autumn",
    number: "03",
    title: "Binnen wordt\nhet warmer.",
    lead: "Kleur in het bos, iets warms op tafel en de stilte van het land na de zomer.",
    detail: "Lange wandelingen. Modder aan je schoenen. Daarna thuiskomen in het barnhouse.",
    note: "Aards · Warm · Langzaam",
  },
  {
    id: "winter",
    asset: "winter",
    number: "04",
    title: "Stilte krijgt\nalle ruimte.",
    lead: "Heldere lucht, kale takken en een verblijf dat voelt als een kleine wereld van jezelf.",
    detail: "Niets hoeven. Alleen het zachte winterlicht dat door de kamer schuift.",
    note: "Stil · Helder · Dichtbij",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function BookingForm() {
  const today = new Date().toISOString().split("T")[0];

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.open(instagram, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="booking" onSubmit={submit}>
      <label><span>Aankomst</span><input type="date" name="arrival" min={today} aria-label="Aankomstdatum" /></label>
      <label><span>Vertrek</span><input type="date" name="departure" min={today} aria-label="Vertrekdatum" /></label>
      <label><span>Gasten</span><select name="guests" defaultValue="2" aria-label="Aantal gasten"><option value="1">1 gast</option><option value="2">2 gasten</option><option value="3">3 gasten</option><option value="4">4 gasten</option></select></label>
      <button type="submit">Vraag je verblijf aan <Arrow /></button>
    </form>
  );
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [activeSeason, setActiveSeason] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);
  const seasonRefs = useRef<(HTMLElement | null)[]>([]);

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
      { rootMargin: "-33% 0px -33% 0px", threshold: [0.05, 0.3, 0.65] },
    );
    seasonRefs.current.forEach((element) => element && seasonObserver.observe(element));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
      setCompactHeader(window.scrollY > 60);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      revealObserver.disconnect();
      seasonObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <main className={`site season-${activeSeason}`}>
      <div className="progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress})` }} /></div>

      <header className={`${compactHeader ? "compact " : ""}${menuOpen ? "open" : ""}`}>
        <a className="logo" href="#top" aria-label="B&B Het Berkenbos, naar boven"><img src={asset("berkenbos-logo-white.png")} alt="B&B Het Berkenbos" /></a>
        <nav className="main-nav" aria-label="Hoofdnavigatie"><a href="#verblijf">Het verblijf</a><a href="#seizoenen">Vier seizoenen</a><a href="#omgeving">Hauwert</a></nav>
        <a className="nav-book" href="#boeken">Boek je rust <Arrow /></a>
        <button className="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? "Sluit" : "Menu"}<i /></button>
        <div className="mobile-menu" id="mobile-menu" aria-hidden={!menuOpen}><nav><a href="#verblijf" onClick={() => setMenuOpen(false)}>Het verblijf</a><a href="#seizoenen" onClick={() => setMenuOpen(false)}>Vier seizoenen</a><a href="#omgeving" onClick={() => setMenuOpen(false)}>Hauwert</a><a href="#boeken" onClick={() => setMenuOpen(false)}>Boek je rust</a></nav></div>
      </header>

      <section className="hero" id="top">
        <div className="hero-media" style={{ backgroundImage: `url("${asset("hero.jpg")}")` }} aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-kicker"><span>Bed &amp; Barn</span><span>Hauwert · Noord-Holland</span></div>
        <div className="hero-title"><p>Een verblijf in het ritme van buiten</p><h1>Vier seizoenen.<br /><em>Eén plek.</em></h1></div>
        <a className="hero-discover" href="#intro"><span>Ontdek<br />Het Berkenbos</span><i>↓</i></a>
        <div className="hero-booking"><BookingForm /></div>
      </section>

      <section className="intro" id="intro">
        <div className="intro-index">00 / Het gevoel</div>
        <div className="intro-copy" data-reveal>
          <p>Geen groot hotel. Geen vast programma.</p>
          <h2>Een kleine wereld<br />tussen de <em>berken.</em></h2>
          <div><p>Het Berkenbos is een eigen barnhouse in Hauwert, omringd door 3.000 m² groen. Een plek die met ieder seizoen van karakter verandert.</p><a href="#verblijf">Bekijk het verblijf <Arrow /></a></div>
        </div>
        <div className="intro-images" data-reveal>
          <figure><img src={asset("suite.jpg")} alt="Het rustige interieur van het barnhouse" /></figure>
          <figure><img src={asset("breakfast.jpg")} alt="Ontbijt buiten bij Het Berkenbos" /></figure>
          <span>Rust is hier<br />geen luxe maar ritme.</span>
        </div>
      </section>

      <section className="season-journey" id="seizoenen">
        <div className="season-stage" aria-hidden="true">
          <div className="season-sky"><i className="sky spring" /><i className="sky summer" /><i className="sky autumn" /><i className="sky winter" /></div>
          <div className="tree-orbit" style={{ "--orbit-turn": `${activeSeason * -90}deg` } as CSSProperties}>
            <i className="orbit-ring" />
            <i className="orbit-ring orbit-ring-inner" />
            {seasons.map((season, index) => (
              <div
                key={season.id}
                className={`orbit-tree${activeSeason === index ? " active" : ""}`}
                style={{ "--slot-angle": `${index * 90}deg` } as CSSProperties}
              >
                <div className="orbit-tree-inner" style={{ "--upright-turn": `${activeSeason * 90 - index * 90}deg` } as CSSProperties}>
                  <img src={asset(`tree-${season.asset}.png`)} alt="" />
                  <span>{season.number} · {season.id}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="season-weather">
            {seasons.map((season, index) => <div key={season.id} className={`weather weather-${season.asset}${activeSeason === index ? " active" : ""}`}>{Array.from({ length: 14 }).map((_, item) => <i key={item} />)}</div>)}
          </div>
          <div className="tree-caption"><span>Scroll door het jaar</span><span>Vier seizoenen · één berk</span></div>
        </div>

        <nav className="season-nav" aria-label="Kies een seizoen">
          {seasons.map((season, index) => <a key={season.id} href={`#${season.id}`} className={activeSeason === index ? "active" : ""}><span>{season.number}</span>{season.id}</a>)}
        </nav>

        <div className="season-scenes">
          {seasons.map((season, index) => (
            <article key={season.id} id={season.id} className="season-scene" data-season={index} ref={(element) => { seasonRefs.current[index] = element; }}>
              <div className="season-card" data-reveal>
                <div className="season-meta"><span>{season.number} / 04</span><span>{season.note}</span></div>
                <p>{season.lead}</p>
                <h2>{season.title.split("\n").map((line, lineIndex) => <span key={line}>{lineIndex === 1 ? <em>{line}</em> : line}</span>)}</h2>
                <div className="season-bottom"><p>{season.detail}</p><a href="#boeken" aria-label={`Boek een verblijf in de ${season.id}`}>Kom dit seizoen <Arrow /></a></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stay" id="verblijf">
        <div className="stay-heading" data-reveal><span>01 / Het verblijf</span><h2>Gemaakt om<br /><em>langer te blijven.</em></h2><p>Een ruim en warm barnhouse, met alles voor een paar dagen op je eigen tempo.</p></div>
        <div className="stay-visual" data-reveal><img src={asset("suite.jpg")} alt="De ruime slaapkamer van Het Berkenbos" /><div className="stay-stamp"><span>Eigen verblijf</span><strong>2–4</strong><span>gasten</span></div></div>
        <div className="stay-specs">
          <div><span>01</span><p>Vrijstaand<br />barnhouse</p></div><div><span>02</span><p>3.000 m²<br />tuin &amp; bos</p></div><div><span>03</span><p>Ontbijt op<br />eigen tempo</p></div><div><span>04</span><p>Rust in<br />West-Friesland</p></div>
        </div>
      </section>

      <section className="rhythm" id="omgeving">
        <div className="rhythm-intro"><span>02 / Jouw ritme</span><h2>Van eerste licht<br />tot <em>niets meer hoeven.</em></h2></div>
        <div className="rhythm-track">
          <article data-reveal><div className="rhythm-image"><img src={asset("breakfast.jpg")} alt="Een rustig ontbijt buiten" /></div><span>08:12</span><h3>De ochtend</h3><p>Koffie, iets vers en alle tijd om te bedenken wat de dag mag worden.</p></article>
          <article data-reveal><div className="rhythm-image"><img src={asset("hero.jpg")} alt="Het open landschap rond Hauwert" /></div><span>14:36</span><h3>Naar buiten</h3><p>Fietsen langs open land, kleine dorpen en de horizon van West-Friesland.</p></article>
          <article data-reveal><div className="rhythm-image"><img src={asset("suite.jpg")} alt="Terugkomen in het barnhouse" /></div><span>20:41</span><h3>Weer thuis</h3><p>Het laatste licht, een lange avond en een plek die helemaal van jou voelt.</p></article>
        </div>
      </section>

      <section className="quote">
        <span>Een verblijf om te onthouden</span>
        <blockquote data-reveal>“Hier wordt zelfs een lege dag<br /><em>iets bijzonders.</em>”</blockquote>
        <div><span aria-label="Vijf van vijf sterren">★★★★★</span><p>Rustig · Persoonlijk · Midden in het groen</p></div>
      </section>

      <section className="book" id="boeken">
        <div className="book-background" style={{ backgroundImage: `url("${asset("hero.jpg")}")` }} aria-hidden="true" />
        <div className="book-copy" data-reveal><span>Jouw verblijf</span><h2>Wanneer kom jij<br /><em>tot rust?</em></h2><p>Kies je data. Wij nemen daarna persoonlijk contact met je op.</p></div>
        <div className="book-form" data-reveal><BookingForm /><p>Of stuur direct een bericht via <a href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a></p></div>
      </section>

      <footer>
        <div className="footer-top"><img src={asset("berkenbos-logo-white.png")} alt="B&B Het Berkenbos" /><p>Een plek voor alle seizoenen.</p></div>
        <div className="footer-grid"><div><span>Adres</span><p>Hauwert<br />Noord-Holland</p></div><div><span>Volg</span><a href={instagram} target="_blank" rel="noreferrer">Instagram <Arrow /></a></div><div><span>Ontdek</span><a href="#verblijf">Het verblijf</a><a href="#seizoenen">Vier seizoenen</a><a href="#omgeving">De omgeving</a></div><a className="footer-book" href="#boeken">Boek je rust <Arrow /></a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Het Berkenbos</span><span>Bed &amp; Barn · Hauwert</span></div>
      </footer>
    </main>
  );
}
