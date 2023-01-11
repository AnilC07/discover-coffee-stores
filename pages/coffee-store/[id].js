import { useContext, useState, useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import cls from "classnames";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

import styles from "../../styles/coffee-stores.module.css";
import { StoreContext } from "../../store/store-context";

import { isEmpty } from "../../utils";

export async function getStaticProps(staticProps) {
  const params = staticProps.params; // c'est pas des "props mais des "staticprops

  // Recupere toute les donnees pour eensuite trouver celui qui coorrespond a l'id
  const coffeeStore = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStore.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id;
  });
  return {
    // Retourne en props le coffestroe qui correspond au params
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

// necessaire car c'est une page qui depend dun id
export async function getStaticPaths() {
  // Refais un fetch de tous pour regarder leur id et dire a next de precharger tous ca
  const coffeeStores = await fetchCoffeeStores();
  // Map qui va retourner pour chaque resultat un objet params avec un id
  const paths = coffeeStores.map((coffeeStore) => {
    return { params: { id: coffeeStore.id.toString() } };
  });
  // retourne un objet indiquant les path et le fallback
  return {
    paths,
    fallback: true, // si false, next prendra en compte que les pages indiqué et renverra 404 pour les autres. Si true, il va regarder si la donner existe. si elle existe mais n'est pas renseigner, il va la charger et lajouter, par la suite elle sera deja precharger pour un autre utilisateur. Si malgre tout elle nexiste pas il yaura une erreur
  };
}

const CoffeeStore = (initialProps) => {
  const [coffeeStore, setCoffeeStor] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const router = useRouter();

  const id = router.query.id;

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, address, neighborhood, voting, imgUrl } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          address:address || "",
          neighborhood: neighborhood || "",
          voting: 0,
          imgUrl 
        }),
      });
      const dbCoffeeStore = await response.json();

    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        if (findCoffeeStoreById) {
          setCoffeeStor(findCoffeeStoreById);
          handleCreateCoffeeStore(findCoffeeStoreById);
        }
      }
    }else{
      handleCreateCoffeeStore(initialProps.coffeeStore)
    }
  }, [id,initialProps.CoffeeStore]);

  // Dans le cas où la page est visité pour la premiere fois. affiche le message suivant indiquant a lutilisateur qu'il charge la donnée
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // destructuration de ce qui est retourner par la props de fetchCoffeeStores
  // return {
  //   id: result.fsq_id,
  //   name: result.name,
  //   address: result.location.formatted_address,
  //   imgUrl: photos.length > 0 ? photos[index] : null
  // };
  const { name, address, imgUrl } = coffeeStore;

  const handleUpvoteButton = () => {
    console.log("Upvote");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name} coffee shop</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHome}>
            <Link href="/">🏠Back To Home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            className={styles.storeImg}
            alt=" sdfs"
            width={200}
            height={200}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/pin.svg"
                width="24"
                height="24"
                alt="ggfd"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {/* <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            {/* <p className={styles.text}>{location.neighborhood[0]}</p> 
          </div> */}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="etoile"
            />
            <p className={styles.text}>0</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
