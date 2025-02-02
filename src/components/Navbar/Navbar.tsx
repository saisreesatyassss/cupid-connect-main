
'use client'
// export default Navbar;
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react'; 
function NavBar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <div>
      <nav className="w-full bg-transparent fixed top-0 left-0 right-0 z-10">
        <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
          <div>
            <div className="flex items-center justify-between py-3 md:py-0 md:block"> 
              <Link href="/"> 
                   {/* <Logo/> */}
                    <Image
                      src="/Logonav.png"
                      // src="/Logo.jpg"
                      width={200}
                      height={100}
                      alt="Logo"
                      className="focus:border-none active:border-none"
                    /> 
               </Link>
              {/* HAMBURGER BUTTON FOR MOBILE */}
              <div className="md:hidden">
                <button
                  className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                  onClick={() => setNavbar(!navbar)}
                >
                  {navbar ? (
                    <Image src="/close.svg" width={30} height={30} alt="logo" />
                  ) : (
                    <Image
                      src="/hamburger-menu.svg"
                      width={30}
                      height={30}
                      alt="hamburger-menu"
                      className="focus:border-none active:border-none"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <div
              className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                navbar ? 'p-12 md:p-0 block' : 'hidden'
              }`}
            > 
              <ul className="h-screen md:h-auto items-center justify-center md:flex gap-2">
                {/* <li className="  bg-black  text-white py-1.5 px-3 text-center border-b-2 rounded-xl md:border-b-0   hover:bg-blue-900  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="#Main" onClick={() => setNavbar(!navbar)}>
                    Home
                  </Link>
                </li>
                <li className="  bg-black  text-white py-1.5 px-3 text-center border-b-2 rounded-xl md:border-b-0   hover:bg-blue-900  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="#Products" onClick={() => setNavbar(!navbar)}>
                    Products
                  </Link>
                </li>
                <li className="  bg-black  text-white py-1.5 px-3 text-center border-b-2 rounded-xl md:border-b-0   hover:bg-blue-900  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="#SecurityCards" onClick={() => setNavbar(!navbar)}>
                    Solutions
                  </Link>
                </li>
                <li className="  bg-black  text-white py-1.5 px-3 text-center border-b-2 rounded-xl md:border-b-0   hover:bg-blue-900  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="#Main" onClick={() => setNavbar(!navbar)}>
                    Resources
                  </Link>
                </li>
                <li className="  bg-black  text-white py-1.5 px-3 text-center border-b-2 rounded-xl md:border-b-0   hover:bg-blue-900  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="#DetailsInputPage" onClick={() => setNavbar(!navbar)}>
                    Customers
                  </Link>
                </li> */}
                <li className="  bg-black  text-white py-1.5 px-3 text-center border-b-2 rounded-xl md:border-b-0   hover:bg-blue-900  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="/match" onClick={() => setNavbar(!navbar)}>
                    Your Match
                  </Link>
                </li>
                <li className="bg-black   text-white  py-1.5 px-3 text-center  border-b-2 rounded-xl  md:border-b-0  hover:bg-blue-600  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent ">
                  <Link href="/profile" onClick={() => setNavbar(!navbar)}>
                    Profile
                  </Link>   
                </li>
                {/* <li className="bg-black   text-white py-1.5 px-3 text-center  border-b-2 rounded-xl  md:border-b-0  hover:bg-blue-600  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent ">
                  <Link href="#contact" onClick={() => setNavbar(!navbar)}>
                    Watch Demo
                  </Link>
                </li>
                <li className="bg-black  text-white py-1.5 px-3 text-center  border-b-2 rounded-xl  md:border-b-0  hover:bg-blue-600  border-blue-900  md:hover:text-blue-600 md:hover:bg-transparent">
                  <Link href="#projects" onClick={() => setNavbar(!navbar)}>
                    Contact Sales
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;