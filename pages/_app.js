import "../styles/globals.css";
import Footer from "../components/Footer";
import StoreProvider from "../store/store-context";



export default function App({ Component, pageProps }) {
  return (
    <>
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    </>
  );
}
