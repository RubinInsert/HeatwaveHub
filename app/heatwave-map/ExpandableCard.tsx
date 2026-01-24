"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface ExpandableCardProps {
  bgColor: string;
  iconSrc: string;
  altText: string;
  label: string;
  children: React.ReactNode; // This will hold the "extra" content
}
const HeaderWrapper = ({ isOpen, setIsOpen, children }: any) => (
  <>
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex w-full items-center p-4 gap-4 md:hidden hover:brightness-95"
    >
      {children}
    </button>
    <div className="hidden md:flex items-center p-4 gap-4">{children}</div>
  </>
);
const ExpandableCard = ({
  bgColor,
  iconSrc,
  altText,
  label,
  children,
}: ExpandableCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`transition-all duration-300 ease-in-out border border-gray-100 shadow-sm rounded-xl overflow-hidden h-fit w-full max-w-sm ${
        isOpen ? "ring-2 ring-blue-500 shadow-lg" : ""
      } ${bgColor}`}
    >
      {/* Clickable Header Area */}
      {/* md:cursor-default to disable pointer on larger screens because it default to not retractable */}
      <HeaderWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className="flex items-center justify-center shrink-0 h-16 w-16 bg-white/50 rounded-lg">
          <Image
            src={iconSrc}
            alt={altText}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <span className="flex-1 font-bold text-2xl leading-tight text-gray-800">
          {label}
        </span>

        <ChevronDown
          className={`block md:hidden transition-transform duration-300 text-gray-500 ${isOpen ? "rotate-180" : ""}`}
        />
      </HeaderWrapper>

      {/* Expanded Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 md:max-h-[500px] md:opacity-100"
        }`}
      >
        <div className="p-4 pt-0 text-sm text-gray-700 leading-relaxed border-t border-black/5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ExpandableCard;
