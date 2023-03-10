import { useContext, useEffect, useState } from "react";

import Head from "next/head";
import Image from "next/image";

import Banner from "../components/Banner";
import Card from "../components/Card";

import styles from "../styles/Home.module.css"

import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";

import { ACTION_TYPES, StoreContext } from "../store/store-context";

// getStaticProps
export async function getStaticProps(context) {
  // fais appel a la fonction pour recuperer tous les lieux
  const coffeeStores = await fetchCoffeeStores();

  // Retourne le resultat en props
  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStores,setCoffeeStores] = useState("")
  const [coffeeStoresError, setCoffeeStoresError] = useState("");

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const response = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=10`)

          const coffeeStores = await response.json()

          // setCoffeeStores(fetchCoffeStores)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORE,
            payload: {
              coffeeStores : coffeeStores.response
            },
          });
          setCoffeeStoresError("");
        } catch (error) {
          setCoffeeStoresError(error);
        }
      }
    }
    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleOnBannerbuttonClick = () => {

    handleTrackLocation();
  };

  return (
    <>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content={`${name} coffee stores`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerbuttonClick}
          buttonText={isFindingLocation ? "Locating" : "View stores nearby"}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && (
          <p>Something went wrong: {coffeeStoresError.message}</p>
        )}
        <div className={styles.heroImage}>
          {/* src width height alt requis par le composant */}
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero-image"
          />
        </div>
        {/* Verifie le contenue du fetch */}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {/* map sur le contenu pour l'afficher dans des cards */}
              {coffeeStores.map((el) => {
                return (
                  <Card
                    key={el.id}
                    className={styles.card}
                    imgUrl={
                      el.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    name={el.name}
                    href={`/coffee-store/${el.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
        

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {/* map sur le contenu pour l'afficher dans des cards */}
              {props.coffeeStores.map((el) => {
                return (
                  <Card
                    key={el.id}
                    className={styles.card}
                    imgUrl={
                      el.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    name={el.name}
                    href={`/coffee-store/${el.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
