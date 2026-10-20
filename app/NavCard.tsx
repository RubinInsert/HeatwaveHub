import Image from "next/image";
import Link from "next/link";
interface NavCardProps {
  href: string;
  bgColor: string;
  iconSrc: string;
  altText: string;
  label: string;
  /** Brand text colour paired with `bgColor` to keep contrast accessible. */
  textColor?: string;
  /** Extra classes for the icon, e.g. `invert` for white icons on light brand fills. */
  iconClassName?: string;
}

const NavCard = ({
  href,
  bgColor,
  iconSrc,
  altText,
  label,
  textColor = "text-brand-midnight",
  iconClassName = "",
}: NavCardProps) => {
  return (
    <Link
      href={href}
      className={`flex h-auto w-full flex-row items-center justify-start gap-5 p-5 transition duration-300 hover:saturate-150 hover:scale-105 md:h-60 md:w-auto md:flex-1 md:max-w-[17rem] md:flex-col md:justify-center md:p-4 xl:h-64 xl:p-6 ${bgColor} ${textColor}`}
    >
      <div className="flex items-center justify-center h-24 w-24 shrink-0 md:w-full">
        <Image
          src={iconSrc}
          alt={altText}
          width={64}
          height={64}
          unoptimized
          className={`object-contain w-auto h-16 max-h-16 max-w-16 ${iconClassName}`}
        ></Image>
      </div>
      <span className="flex-1 text-left font-bold leading-snug text-base md:text-center md:text-lg xl:text-xl">
        {label}
      </span>
    </Link>
  );
};
export default NavCard;
