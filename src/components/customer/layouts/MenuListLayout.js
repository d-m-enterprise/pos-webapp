import Link from "next/link";
import { useRouter } from "next/router";
import { getLayout as getSiteLayout } from "./CustomerSiteLayout";

const ActiveLink = ({ children, href, className }) => {
  const router = useRouter();
  return (
    <Link href={href} scroll={false}>
      <a
        className={`${
          router.pathname === `/customer/${href}`
            ? "text-gray-100 border-gray-800"
            : "text-gray-100 hover:text-gray-400 border-transparent"
        } ${className} block text-base font-bold leading-6 sm:text-lg sm:leading-7 focus:outline-none focus:text-gray-900 whitespace-no-wrap`}
      >
        {children}
      </a>
    </Link>
  );
};

const ArrowLeft = ({ size = 8, color = "#000000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-${size} w-${size} stroke-current text-gray-100 mr-2`}
  >
    <path d="M19 12H6M12 5l-7 7 7 7" />
  </svg>
);

const ShoppingCart = ({ size = 8, color = "#000000" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-${size} w-${size} stroke-current text-gray-100 ml-2`}
  >
    <circle cx="10" cy="20.5" r="1" />
    <circle cx="18" cy="20.5" r="1" />
    <path d="M2.5 2.5h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6l1.6-8.4H7.1" />
  </svg>
);

const MenuListLayout = ({ children }) => {
  return (
    <>
      {children}
      <div className="bottom-0 left-0 z-50 fixed w-screen px-10 py-4 bg-white">
        <div className="grid grid-cols-4 gap-3 ">
          <div className="col-span-2">
            <span className="rounded-xl px-2 py-2 bg-gray-800 flex items-center justify-center font-bold">
              {/* <ArrowLeft /> */}
              <ActiveLink href="/customer/full-menu">All Items</ActiveLink>
            </span>
          </div>
          <div className="col-span-2">
            <span className="rounded-xl px-2 py-2 bg-gray-800 flex items-center justify-center font-bold">
              {/* <p className="text-md text-gray-100">Checkout</p> */}
              <ActiveLink href="/customer/full-menu">Checkout</ActiveLink>
              {/* <ShoppingCart /> */}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export const getLayout = (page) =>
  getSiteLayout(<MenuListLayout>{page}</MenuListLayout>);

export default MenuListLayout;
