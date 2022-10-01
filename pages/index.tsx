import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useMoralis } from "react-moralis";
import Header from "../components/Header";
import LotteryEntrance from "../components/LotteryEntrance";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Our smart contract library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntrance />
    </div>
  );
};

export default Home;
