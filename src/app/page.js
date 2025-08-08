"use client";
import Banner1 from "@/components/home/Banner1";
import ExpertChoice from "@/components/home/ExpertChoice";
import NewArrivals from "@/components/home/NewArrivals";
import NicheExplorer from "@/components/home/NicheExplorer";
import Trending from "@/components/home/Trending";
import Main from "@/components/shared/layouts/Main";

export default function Home() {
  return (
    <>
      <Main>
        <main className="flex flex-col gap-y-20 w-full">
          <Banner1 />
          <NewArrivals />       
          <ExpertChoice />
          <NicheExplorer />
          <Trending />        
        </main>
      </Main>
    </>
  );
}
