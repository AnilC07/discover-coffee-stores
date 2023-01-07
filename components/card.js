import Image from "next/image";
import Link from "next/link";
import React from "react";
import cls from 'classnames'

import styles from "./card.module.css";

const Card = (props) => {

  return (
    <Link className={styles.cardLink} href={props.href}>
      <div className={cls("glass", styles.container)}>
      {/* <div className={ styles.container}> */}
        <div className={styles.cardHeaderWrapper}>
          <h2 className={styles.cardHeader}>{props.name}</h2>
        </div>
        <Image
          className={styles.cardImage}
          src={props.imgUrl}
          alt="une image"
          width={260}
          height={160}
        />
      </div>
    </Link>
  );
};

export default Card;
