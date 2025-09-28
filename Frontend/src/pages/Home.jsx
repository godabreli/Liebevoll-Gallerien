import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import './Home.css';
import { Diashow } from '../shared/ui-elements/Diashow';

const diashow01Images = [
  'diashowImages/brautpaar-hochzeit-muenset-01-01.jpg',
  'diashowImages/brautpaar-hochzeit-wupertal-01-02.jpg',
  'diashowImages/brautpaar-hochzeit-duesseldorf-medienhafen-01-03.jpg',
  'diashowImages/brautpaar-hochzeit-wupertal-01-04.jpg',
  'diashowImages/brautpaar-hochzeit-muenset-01-05.jpg',
];

const diashow02Images = [
  'diashowImages/chuppa-hochzeit-wupertal-02-01.jpg',
  'diashowImages/brautschuhe-hochzeit-wupertal-02-02.jpg',
  'diashowImages/brautkleid-hochzeit-wupertal-02-03.jpg',
];

const diashow03Images = [
  'diashowImages/brautpaar-hochzeit-muenset-03-01.jpg',
  'diashowImages/brautpaar-hochzeit-muenset-03-02.jpg',
  'diashowImages/brautpaar-hochzeit-muenset-03-03.jpg',
];

const diashow04Images = [
  'diashowImages/brautpaar-hochzeit-koeln-kirche-04-01.jpg',
  'diashowImages/brautpaar-hochzeit-koeln-kirche-04-02.jpg',
  'diashowImages/brautpaar-hochzeit-koeln-kirche-04-03.jpg',
];

const Home = () => {
  const [width, setWidth] = useState();

  useEffect(() => {
    const calcWidth = () => {
      let newWidth;

      if (window.innerWidth > 576) {
        newWidth = window.innerWidth * 0.8;
      } else {
        newWidth = window.innerWidth * 0.97;
      }

      setWidth(newWidth);
    };
    calcWidth();
    window.addEventListener('resize', calcWidth);
    return () => {
      window.removeEventListener('resize', calcWidth);
    };
  }, []);

  const rowWidth = () => {
    if (window.innerWidth < 800) return width;
    if (window.innerWidth < 1100) return width * 0.8;
    return width;
  };

  return (
    <>
      <Helmet>
        <title>Hochzeitsfotograf Düsseldorf & NRW – Liebevoll Belichtet</title>
        <meta
          name="description"
          content="Hochzeitsfotograf Düsseldorf – emotionale, unvergessliche Hochzeitsfotos voller Liebe & Magie. Vertrauen Sie auf 20 Jahre Erfahrung in NRW."
        />
        <link rel="canonical" href="https://liebevollbelichtet.de/" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Liebevoll Belichtet",
              "image": "https://liebevollbelichtet.de/logo.jpg",
              "url": "https://liebevollbelichtet.de",
              "telephone": "+49-179-4839729",
              "address": {
                "@type": "Engerstr. 25",
                "postalCode": "40235",
                "addressLocality": "Düsseldorf",
                "addressRegion": "NRW",
                "addressCountry": "DE"
              },
              "sameAs": [
                "https://www.instagram.com/liebevollbelichtet/"
              ]
            }
          `}
        </script>
      </Helmet>
      <div className="home-wrapper">
        <h1 className="visually-hidden">
          Hochzeitsfotograf Düsseldorf & NRW – Liebevoll Belichtet
        </h1>
        {width && (
          <div className="home-components-wrapper" style={{ width: width }}>
            <div
              className="diashow01-wrapper"
              style={{ width: width, height: width / 1.77 }}
            >
              <Diashow images={diashow01Images} />
            </div>
            <div className="rows-wrapper" style={{ width: width }}>
              <div
                className="row"
                style={{
                  width: rowWidth(),
                }}
              >
                <div
                  className="text-div"
                  style={{
                    width:
                      window.innerWidth < 1100 ? rowWidth() : width * 0.45 - 20,
                    height: 'auto',
                  }}
                >
                  <span className="willkommen">WILLKOMMEN</span>
                  <span className="bei-liebevollbelichtet">
                    BEI LIEBEVOLLBELICHTET: <br /> WO EMOTIONEN
                    <br /> ZUR KUNST WERDEN
                  </span>
                  <p className="description">
                    Hallo und herzlich willkommen! Ich bin Michael, ein
                    leidenschaftlicher Hochzeitsfotograf mit einem Auge für
                    Kunst und einem Herz, das für die Magie von Hochzeiten
                    schlägt. Seit nunmehr zwei Jahrzehnten habe ich die Ehre,
                    unvergessliche Momente in Bildern einzufangen und
                    Geschichten zu erzählen, die ein Leben lang halten.
                  </p>
                </div>
                <div
                  className="diashow02-wrapper"
                  style={{
                    width: window.innerWidth < 1100 ? rowWidth() : width * 0.55,
                    height:
                      window.innerWidth < 1100
                        ? rowWidth() / 1.45
                        : (width * 0.55) / 1.45,
                  }}
                >
                  <Diashow images={diashow02Images} />
                </div>
              </div>
              <span className="spruch">
                GLÜCKLICH ALLEIN IST DIE SEELE, DIE LIEBT!
              </span>
              <div
                className="row reverse"
                style={{
                  width: rowWidth(),
                }}
              >
                <div
                  className="diashow03-wrapper"
                  style={{
                    width:
                      window.innerWidth < 1100 ? rowWidth() : width * 0.5 - 10,
                    height:
                      window.innerWidth < 1100
                        ? rowWidth() * 1.45
                        : (width * 0.5 - 10) * 1.45,
                  }}
                >
                  <Diashow images={diashow03Images} />
                </div>
                <div
                  className="text-div"
                  style={{
                    width:
                      window.innerWidth < 1100 ? rowWidth() : width * 0.5 - 10,
                    height: 'auto',
                    alignItems: 'flex-start',
                  }}
                >
                  <span className="title"> HINTER DER LINSE</span>
                  <p className="description" style={{ marginBottom: '2.5rem' }}>
                    Für mich ist Fotografie weit mehr als nur ein Beruf – es ist
                    eine Leidenschaft, die mich antreibt. Meine Bilder sind der
                    Spiegel meiner Seele, meine Kamera das Werkzeug, um
                    Geschichten zu erzählen, die ohne Worte auskommen. In jedem
                    Hochzeitsmoment finde ich Schönheit und Ausdruckskraft, und
                    ich bin stets auf der Suche nach dem einzigartigen und
                    unverwechselbaren Bild, das Ihre Liebe und Emotionen perfekt
                    einfängt.
                  </p>
                  <span className="title">
                    {' '}
                    KREATIVITÄT KENNT KEINE GRENZEN
                  </span>
                  <p className="description">
                    Meine 20-jährige Erfahrung als Kunst- und Werbefotograf hat
                    meinen Blick auf die Hochzeitsfotografie geprägt. Jedes Paar
                    ist einzigartig, und daher sollte auch jede Hochzeit eine
                    einzigartige Geschichte erzählen. Ich scheue mich nicht
                    davor, kreativ zu sein und neue Wege zu gehen, um Bilder zu
                    schaffen, die Ihre Persönlichkeit und Einzigartigkeit
                    widerspiegeln. Egal, ob es ein romantisches Outdoor-Shooting
                    bei Sonnenuntergang oder ein modernes urbanes Hochzeitsfest
                    ist – ich bin bereit, Ihre Vision zu verwirklichen.
                  </p>
                </div>
              </div>
              <span className="spruch" style={{ width: rowWidth() }}>
                EIN TROPFEN LIEBE IST MEHR ALS EIN OZEAN VERSTAND!
              </span>
              <div
                className="row"
                style={{
                  width: rowWidth(),
                }}
              >
                <div
                  className="text-div"
                  style={{
                    width:
                      window.innerWidth < 1100 ? rowWidth() : width * 0.5 - 10,
                    height: 'auto',
                    alignItems: 'flex-start',
                  }}
                >
                  <span className="title">
                    {' '}
                    UNSERE REISE GEMAINSAM BEGINNEN
                  </span>
                  <p className="description" style={{ marginBottom: '2.5rem' }}>
                    Mein Ziel ist es, nicht nur atemberaubende Fotos zu liefern,
                    sondern auch eine angenehme und entspannte Erfahrung zu
                    schaffen. Ihre Hochzeit ist ein besonderer Tag, und ich
                    möchte sicherstellen, dass Sie jeden Augenblick genießen
                    können, während ich die Magie einfange. Ich schaffe eine
                    Verbindung zu meinen Klienten und lerne ihre Geschichten und
                    Wünsche kennen, um sicherzustellen, dass wir gemeinsam etwas
                    Einzigartiges schaffen.
                  </p>
                  <span className="title"> LASSEN SIE UNS SPRECHEN</span>
                  <p className="description">
                    Wenn Sie nach einem Hochzeitsfotografen suchen, der Ihre
                    Liebe in lebendige Kunst verwandelt, dann sind Sie hier
                    genau richtig. Lassen Sie uns gemeinsam anfangen, Ihre
                    Hochzeitsgeschichte zu planen und zu gestalten. Kontaktieren
                    Sie mich noch heute, um mehr darüber zu erfahren, wie ich
                    Ihre Momente in unvergessliche Erinnerungen verwandeln kann.
                  </p>
                </div>
                <div
                  className="diashow03-wrapper"
                  style={{
                    width:
                      window.innerWidth < 1100 ? rowWidth() : width * 0.5 - 10,
                    height:
                      window.innerWidth < 1100
                        ? rowWidth() * 1.45
                        : (width * 0.5 - 10) * 1.45,
                  }}
                >
                  <Diashow images={diashow04Images} />
                </div>
              </div>
              <span className="spruch" style={{ width: rowWidth() }}>
                IHRE HOCHZEIT IST EIN KUNSTWERK IN ARBEIT, UND ICH FREUE MICH
                DARAUF, EIN TEIL DAVON ZU SEIN.
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
