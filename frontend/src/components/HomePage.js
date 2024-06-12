import React from 'react';

const styles = {
  body: {
    fontFamily: 'dosis, sans-serif',
    lineHeight: '1.6',
  },
  main: {
    marginTop: '78px',
  },
  p: {
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: 'normal',
  },
  h1: {
    fontSize: '32px',
    fontWeight: 'bolder',
    marginBottom: '1rem',
    lineHeight: 'normal',
  },
  h2: {
    fontSize: '32px',
    fontWeight: 'bolder',
    textAlign: 'center',
    marginBottom: '36px',
    lineHeight: 'normal',
  },
  section: {
    padding: '26px',
    marginBottom: '100px',
    borderRadius: '40px',
    marginLeft: '20px',
    marginRight: '20px',
  },
  header: {
    backgroundColor: 'white',
    color: 'black',
    padding: '1rem 0',
    textAlign: 'center',
    fontWeight: 'bold',
    boxShadow: '0px 7px 16px rgba(0,0,0,0.07)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 7,
    lineHeight: 'normal',
  },
  headerImg: {
    verticalAlign: 'sub',
  },
  instagram: {
    textAlign: 'center',
  },
  instagramLink: {
    display: 'inline-block',
    overflow: 'hidden',
    textAlign: 'center',
    background: 'url("../../media/homepage/maincolor.png") no-repeat center center/cover',
    padding: '16px 20px',
    borderRadius: '1000px',
    border: '3px solid white',
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    boxShadow: '0px 16px 14px rgba(0,0,0,0.12)',
  },
  instagramImg: {
    verticalAlign: 'sub',
    marginRight: '8px',
  },
  hero: {
    background: 'url("../../media/homepage/photoBAG.jpg") no-repeat center center/cover',
    height: 'calc(95vh - 78px)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: '#fff',
  },
  heroContent: {
    position: 'absolute',
    bottom: '80px',
    backgroundColor: 'white',
    borderRadius: '26px',
    padding: '20px 26px',
    background: 'url("../../media/homepage/maincolor.png") no-repeat center center/cover',
    marginLeft: '20px',
    marginRight: '20px',
  },
  heroH1: {
    marginBottom: '8px',
  },
  heroAfter: {
    content: '""',
    width: '48px',
    height: '48px',
    position: 'absolute',
    top: 'calc(95vh - 24px)',
    backgroundColor: 'green',
    background: 'url("../../media/homepage/icon/arrow_down.svg") no-repeat center',
    backgroundSize: '30px',
    backgroundColor: 'white',
    borderRadius: '10000px',
  },
  emoji: {
    textAlign: 'center',
    fontSize: '32px',
    backgroundColor: 'white',
    display: 'block',
    width: '25%',
    margin: 'auto',
    marginTop: '-50px',
    marginBottom: '42px',
    boxShadow: '0px 7px 16px rgba(0,0,0,0.07)',
    borderRadius: '1000px',
  },
  mission: {
    color: 'white',
    background: 'url("../../media/homepage/maincolor.png") no-repeat center center/cover',
    textAlign: 'center',
  },
  flow: {},
  flowH3: {
    display: 'inline-block',
    padding: '16px 32px',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '1000px',
  },
  flowOlLi: {
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '12px',
    alignItems: 'center',
    margin: '26px 0',
    lineHeight: 'normal',
  },
  missionOlLiP: {
    textAlign: 'left',
  },
};

const HomePage = () => {
  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <img src="../../media/homepage/icon/qr.svg" alt="" style={styles.headerImg} />
        <p>Scanne une boîte pour l'ouvrir</p>
      </header>
      <main style={styles.main}>
        <section className="hero" style={styles.hero}>
          <div className="content" style={styles.heroContent}>
            <h1 style={styles.heroH1}>Les Boîtes à Groove</h1>
            <p>Points de partage de musique entre humains</p>
          </div>
        </section>
        <section className="mission" style={styles.mission}>
          <p className="emoji" style={styles.emoji}>✨</p>
          <h2>Échange des pépites musicales avec les passant·e·s qui t'entourent</h2>
          <div className="flow" style={styles.flow}>
            <h3 style={styles.flowH3}>Comment ça marche ?</h3>
            <ol>
              <li className="step1" style={styles.flowOlLi}>
                <p>Scanne le Qr code de la boite pour l'ouvrir</p>
              </li>
              <li className="step2" style={styles.flowOlLi}>
                <p>Confirme que tu es à côté de la boîte</p>
              </li>
              <li className="step3" style={styles.flowOlLi}>
                <p>Choisis la chanson que tu veux déposer</p>
              </li>
              <li className="step4" style={styles.flowOlLi}>
                <p>Attache une petite phrase à ta chanson</p>
              </li>
              <li className="step5" style={styles.flowOlLi}>
                <p>Écoute la chanson qui a été déposée par la personne précédente et découvre son petit mot</p>
              </li>
            </ol>
          </div>
        </section>
        <section className="instagram" style={styles.instagram}>
          <h2>Suis l'avancée du projet sur Instagram !</h2>
          <a
            href="https://www.instagram.com/lesboitesagroove?igsh=ZmIzZTBybGFxMWUz&utm_source=qr"
            style={styles.instagramLink}
          >
            <img src="media/homepage/icon/insta.svg" alt="" style={styles.instagramImg} /> Notre Instagram
          </a>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
