import './Impressum.css';

import React from 'react';

const Impressum = () => {
  return (
    <div className="impressum">
      <br />
      <br />
      <br />
      <h5>Impressum</h5>
      <p>
        Angaben gemäß § 5 TMG <br />
        Michael Godabreli
        <br /> Hochzeitsfotografie <br /> Engerstraße 25 <br />
        40235 Düsseldorf
      </p>

      <h5>Kontakt</h5>
      <p>
        Telefon: +491794839729 <br />
        E-Mail: godabreli@gmail.com
      </p>

      <h5>Umsatzsteuer-ID</h5>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        <br />
        13350963820
      </p>
      <h5>Verbraucherstreitbeilegung/Universalschlichtungsstelle</h5>
      <p>
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
        vor einer <br /> Verbraucherschlichtungsstelle teilzunehmen.
      </p>
      <p>
        <br />
        Quelle:
        <br />
        <a href="https://www.e-recht24.de" target="_blank" rel="noreferrer">
          www.e-recht24.de
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </a>
      </p>
    </div>
  );
};

export default Impressum;
