import React from 'react';

import './AboutMe.css';
import { Helmet } from 'react-helmet';

import DownloadButtonSVG from '../SVG/DownloadButtonSVG';

function AboutMe() {
  return (
    <>
      <Helmet>
        <title>Hochzeitsfotograf Düsseldorf</title>
        <meta
          name="description"
          content="Hochzeitsfotograf mit Leidenschaft. Hochzeitsfotos die Ihre schönsten Momente für die Ewigkeit festhalten.  "
        />
        <link rel="canonical" href="https://liebevollbelichtet.de/Uebermich" />
      </Helmet>
      <div className="wrapper">
        <div className="text">
          <p className="bio">
            Hallo, ich bin Michael, ein kreativer Geist aus dem malerischen
            Tiflis. Dort, umgeben von inspirierenden Landschaften und
            Architektur, begann meine Reise in der Welt der Kunst durch die
            Bildhauerei an der Tifliser Kunstakademie. Schon während des
            Studiums habe ich die Leidenschaft für das Fotografieren entdeckt.
            Diese Leidenschaft hat mich nach Düsseldorf geführt, wo ich
            Fotografie an der Kunstakademie studierte.
            <br />
            <br />
            Ich habe mehrere Jahre Erfahrung in verschiedenen Bereichen der
            Fotografie gesammelt, darunter Kunst- und Werbefotografie, Fashion
            und Hochzeitsfotografie. Doch meine wahre Leidenschaft liegt darin,
            künstlerische Liebesgeschichten zu erzählen.
            <br />
            <br />
            Ich glaube, dass die Fotografie eine einzigartige Möglichkeit
            bietet, Momente und Emotionen für die Ewigkeit festzuhalten. Jede
            Hochzeit, jedes Paar und jede Liebesgeschichte ist einzigartig und
            ich arbeite hart daran, die Persönlichkeit und die Seele der
            Menschen, die ich fotografiere, in meinen Bildern festzuhalten.
            <br />
            <br />
            Meine Arbeit als Fotograf gibt mir die Möglichkeit, meine
            Kreativität auszudrücken und mich mit Menschen zu verbinden. Ich
            liebe es, die Welt durch meine Linse zu betrachten und die Schönheit
            in allem zu finden.
            <br />
            <br />
            Ich hoffe, dass ich mit meinen Bildern nicht nur Erinnerungen
            schaffe, sondern auch Emotionen und Gefühle wecke. Denn das ist es,
            was für mich die Fotografie ausmacht – die Möglichkeit, eine
            Geschichte zu erzählen und Herzen zu berühren.
          </p>
        </div>
        <div className="myPhotoDiv">
          <img
            src="images/MyPortrait.jpg"
            alt="Hochzeitsfotograf"
            className="myPhoto"
          />
        </div>
      </div>
    </>
  );
}

export default AboutMe;
