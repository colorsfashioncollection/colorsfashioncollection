import React from "react";
import Container from "../shared/Container";
import { useRouter } from "next/navigation";

const Banner1 = () => {
  const router = useRouter();

  return (
    <Container>
      <div
        className="bg-[#f8f0ea] h-full w-full rounded-primary relative flex flex-col gap-y-8 lg:p-24 pt-8 pb-0 bg-cover"
        style={{ backgroundImage: "url(/assets/home/banner/Banner1.png)" }}
      >
        <article className="flex flex-col justify-start items-end order-1 px-8">
          <div className="flex flex-col gap-y-4 max-w-lg z-20 mr-auto">
            <h1 className="md:text-6xl text-4xl">
              Discover the elegance of fashion
            </h1>
            <p className="flex flex-row gap-x-0.5 items-center text-lg text-black">
              In this season, find your desire
            </p>
            <button
              className="px-8 py-4 border border-black rounded-secondary bg-black hover:bg-black/90 text-white transition-colors drop-shadow w-fit mt-4"
              onClick={() => router.push("http://localhost:3000/products")}
            >
              Find Your style
            </button>
          </div>
        </article>
      </div>
    </Container>
  );
};

export default Banner1;
