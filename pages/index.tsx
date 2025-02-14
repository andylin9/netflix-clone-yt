import { getProducts, Product } from "@stripe/firestore-stripe-payments";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Banner from "../components/Banner";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Plans from "../components/Plans";
import Row from "../components/Row";
import useAuth from "../hooks/useAuth";
import useSubscription from "../hooks/useSubscription";
import payments from "../lib/stripe";
import { Movie } from "../typings";
import requests from "../utils/requests";

interface Props {
  netflixOriginals: Movie[];
  trendingNow: Movie[];
  topRated: Movie[];
  actionMovies: Movie[];
  comedyMovies: Movie[];
  horrorMovies: Movie[];
  romanceMovies: Movie[];
  documentaries: Movie[];
  products: Product[];
}

const Home = ({
  netflixOriginals,
  actionMovies,
  comedyMovies,
  documentaries,
  horrorMovies,
  romanceMovies,
  topRated,
  trendingNow,
  products,
}: Props) => {
  console.log(products);
  const { loading, user } = useAuth();
  const showModal = useRecoilValue(modalState);
  const subscription = useSubscription(user);
  console.log(subscription);

  // Error: Rendered more hooks than during the previous render
  // https://stackoverflow.com/questions/55622768/uncaught-invariant-violation-rendered-more-hooks-than-during-the-previous-rende
  // useEffect 必須放在這個組件 return jsx 前面，
  // 如果 useEffect 放在組建返回之後:
  // 第一次渲染組件返回後 useEffect 不會運行，當 loading 或 subscription 狀態改變時，第二次渲染開始， 運行了useEffect 並且發生錯誤。
  // 原因是第一次渲染沒有運行 useEffect 第二次卻運行了 useEffect，讓 react 認為第二次的渲染用的鉤子比第一次多而發生錯誤
  useEffect(() => {
    if (showModal) {
      document.body.style.setProperty("overflow", "hidden", "important");
    } else {
      document.body.style.setProperty("overflow", "overlay", "important");
    }
  }, [showModal]);

  if (loading || subscription === null) return null;

  if (!subscription) return <Plans products={products} />;

  return (
    // bg-gradient-to-b has been set custom backgroundImage at tailwind.config.js theme > extend > backgroundImage
    <div className="relative h-screen bg-gradient-to-b lg:h-[140vh]">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="relative pl-4 pb-24 lg:space-y-24 lg:pl-16">
        <Banner netflixOriginals={netflixOriginals} />
        <section className="md:space-y-24">
          <Row title="Trending Now" movies={trendingNow} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Action Thrillers" movies={actionMovies} />
          {/* My List Component */}
          <Row title="Comedies" movies={comedyMovies} />
          <Row title="Scary Movies" movies={horrorMovies} />
          <Row title="Romance Movies" movies={romanceMovies} />
          <Row title="Documentaries" movies={documentaries} />
        </section>
      </main>
      {showModal && <Modal />}
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const products = await getProducts(payments, {
    includePrices: true,
    activeOnly: true,
  })
    .then((res) => res)
    .catch((error) => console.log(error.message));

  const [
    netflixOriginals,
    trendingNow,
    topRated,
    actionMovies,
    comedyMovies,
    horrorMovies,
    romanceMovies,
    documentaries,
  ] = await Promise.all([
    fetch(requests.fetchNetflixOriginals).then((res) => res.json()),
    fetch(requests.fetchTrending).then((res) => res.json()),
    fetch(requests.fetchTopRated).then((res) => res.json()),
    fetch(requests.fetchActionMovies).then((res) => res.json()),
    fetch(requests.fetchComedyMovies).then((res) => res.json()),
    fetch(requests.fetchHorrorMovies).then((res) => res.json()),
    fetch(requests.fetchRomanceMovies).then((res) => res.json()),
    fetch(requests.fetchDocumentaries).then((res) => res.json()),
  ]);

  return {
    props: {
      netflixOriginals: netflixOriginals.results,
      trendingNow: trendingNow.results,
      topRated: topRated.results,
      actionMovies: actionMovies.results,
      comedyMovies: comedyMovies.results,
      horrorMovies: horrorMovies.results,
      romanceMovies: romanceMovies.results,
      documentaries: documentaries.results,
      products: products,
    },
  };
};
