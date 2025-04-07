"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

type SlickCarouselProps = {
  images: string[];
};

export default function SlickCarousel({ images }: SlickCarouselProps) {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 2,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out"
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {images.map((image) => (
          <Image
            key={image}
            src={image}
            alt={`Slider image ${image}`}
            width={150}
            height={120}
            className="h-[120px] rounded-xl object-cover p-1"
          />
        ))}
      </Slider>
    </div>
  );
}
