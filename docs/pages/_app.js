import '../styles.scss';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@300;400;500;600;700&display=swap');
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
