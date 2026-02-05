"use client";

import { useState } from "react";
import {
  HomeModernIcon,
  BeakerIcon,
  UserGroupIcon,
  HeartIcon,
  BoltIcon,
  ArchiveBoxIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { DogIcon, GroupIcon, ShoppingBagIcon } from "lucide-react";

export default function SlideTips() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data: 6 items
  const individualTips = [
    {
      title: "Cool Your Home",
      description:
        "Prepare your home to make it cooler where possible, e.g. installing fans, or shade cloths. For pre-existing fans and air conditioners, make sure they have been serviced and are working well.",
      icon: HomeModernIcon,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Personal Cooling",
      description:
        "Consider buying personal cooling items, such as an ice vest or small fans. Get a cooling bag for water and medications.",
      icon: UserGroupIcon,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Health Management",
      description:
        "Some medical conditions can get worse in extreme heat. Make sure your conditions are well managed and you have a plan in place for when a heatwave or blackout occurs.",
      icon: BeakerIcon,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Emergency Planning",
      description:
        "Plan ahead to make sure you have enough supplies, such as food, water and any medication required.",
      icon: HeartIcon,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Pet Preparedness",
      description:
        "Make a plan for any pets or animals and ensure they have enough food and water and a cool place to shelter during a heatwave or a blackout.",
      icon: DogIcon,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Community Resources",
      description:
        "Investigate public locations in your local area where you could go to stay cool e.g. community centres, libraries, movie theatres",
      icon: ShoppingBagIcon,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  // Logic to chunk data into groups of 3
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(individualTips.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const slides = Array.from({ length: totalSlides }, (_, i) =>
    individualTips.slice(i * itemsPerSlide, i * itemsPerSlide + itemsPerSlide)
  );

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto w-full">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8">
        <div>
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">
            For Residents
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">
            Protect Yourself
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-gray-300 hover:bg-orange-50 hover:border-orange-300 transition-all text-gray-600"
            aria-label="Previous tips"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-gray-300 hover:bg-orange-50 hover:border-orange-300 transition-all text-gray-600"
            aria-label="Next tips"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CAROUSEL WINDOW */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideGroup, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full flex-shrink-0 grid md:grid-cols-3 gap-6"
            >
              {slideGroup.map((tip) => (
                <div
                  key={tip.title}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full"
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${tip.color}`}
                  >
                    <tip.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 bg-orange-500"
                : "w-2 bg-gray-300 hover:bg-orange-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}