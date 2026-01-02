import Image from 'next/image';
import Link from 'next/link';
interface NavCardProps {
    href: string;
    bgColor: string;
    iconSrc: string;
    altText: string;
    label: string;
}

const NavCard =({ href, bgColor, iconSrc, altText, label }: NavCardProps) => {
    return (
                <Link href={href} className={`hover:scale-110 duration-300 flex justify-start md:justify-center items-center flex-row p-3 h-auto w-full md:flex-col md:h-56 md:w-56 ${bgColor}`}>
                <div className="flex items-center justify-center h-28 w-28 md:w-full shrink-0">
                  <Image
                    src={iconSrc}
                    alt={altText}
                    width={64}
                    height={64}
                    className="object-contain w-auto h-28 max-h-[64px] max-w-[64px]"
                    ></Image>
                </div>
                  <span className="flex-1 text-left font-medium md:text-center leading-tight flex items-center justify-left md:justify-center"  >{label}</span>
                </Link>
    );
};
export default NavCard;