import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";
import coffeeStoresData from "../data/coffee-stores.json";
import styles from "../../styles/coffee-stores.module.css";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

export async function getStaticProps(staticProps) {
  const params = staticProps.params; // c'est pas des "props mais des "staticprops
  console.log(params);
  const coffeeStore = await fetchCoffeeStores();
  return {
    props: {
      coffeeStore: coffeeStore.find(
        (coffeeStore) => coffeeStore.fsq_id.toString() === params.id
      ),
    },
  };
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores()
  const paths = coffeeStores.map((coffeeStore) => {
    return { params: { id: coffeeStore.fsq_id.toString() } };
  });
  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();

  // Dans le cas où la page est visité pour la premiere fois
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { location,name,imgUrl, categories } = props.coffeeStore;


  const handleUpvoteButton = () => {
    console.log("Upvote");
  };

  // console.log(categories[0].icon.prefix)

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name} coffee shop</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHome}>
            <Link href="/">Back To Home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              // `${categories[0].icon.prefix}${categories[0].icon.suffix}` ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            className={styles.storeImg}
            alt={name}
            width={200}
            height={200}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/pin.svg" width="24" height="24" />
            <p className={styles.text}>{location.formatted_address}</p>
          </div>
          {/* <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width="24" height="24" />
            {/* <p className={styles.text}>{location.neighborhood[0]}</p> 
          </div> */}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>1</p>
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
