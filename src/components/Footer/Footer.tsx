// import React from "react";
// import { FaInstagram } from "react-icons/fa";
// import { FaTwitter } from "react-icons/fa";
// import { FaLinkedin } from "react-icons/fa";
// import { FaYoutube } from "react-icons/fa";
// import Logo from "../Logo";
// import Link from "next/link";
// import Image from 'next/image';

// function Footer() {
//   return (
//     <>
//       <div id="Footer" className=" h-1/2 w-full flex md:flex-row flex-col justify-around items-start p-8" style={{ backgroundColor: "#0B1519" }}>
//         <div className=" ">
//           <ul>
//             <p className="text-white font-bold text-2xl pb-4">Product</p>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               All Products
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Integrations
//             </li>
//  			<p className="text-white font-bold text-2xl pb-4">Solutions</p>

//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               By Use Case
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               By Industry
//             </li>
//           </ul>
//         </div>
//         <div className=" ">
//           <ul>
//             <p className="text-white font-bold text-2xl pb-4">Resources</p>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Blog

//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Case Studies

//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Competitors

//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Data Sheets

//             </li>
//             <li className="text-gray-800  text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Glossary

//             </li>
//             <li className="text-gray-800  text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Infographics


//             </li>
//             <li className="text-gray-800  text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Podcast


//             </li>
//             <li className="text-gray-800  text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Videos


//             </li>
//             <li className="text-gray-800  text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Webinars


//             </li>
//             <li className="text-gray-800  text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Whitepapers


//             </li>
//           </ul>
//         </div>
//         <div className=" ">
//           <ul>
//             <p className="text-white font-bold text-2xl pb-4">Customers</p>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Contact
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Support Portals
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               List Of Charges
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Downloads & Resources
//             </li>
//            <p className="text-white font-bold text-2xl pb-4">Partners</p>

//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Implementation Packages
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Careers
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Contact us
//             </li>
//             <li className="text-gray-800 text-md pb-2 font-semibold hover:text-blue-600 cursor-pointer">
//               Lift Media
//             </li>
//           </ul>
//         </div>
//         <div className="">
//           <ul> 
            
//              <Link href="/"> 
//                    {/* <Logo/> */}
//                     <Image
//                       src="/logo.svg"
//                       width={150}
//                       height={100}
//                       alt="Logo"
//                       className="focus:border-none active:border-none bg-white rounded-3xl "
//                     /> 
//               </Link>
//             <div className="flex gap-6 pb-5 py-10">
//               <FaInstagram className="text-2xl cursor-pointer hover:text-yellow-600" />
//               <FaTwitter className="text-2xl cursor-pointer hover:text-blue-600" />
//               <FaLinkedin className="text-2xl cursor-pointer hover:text-blue-600" />
//               <FaYoutube className="text-2xl cursor-pointer hover:text-red-600" />
//             </div>
//           </ul>
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row justify-center items-center text-center p-5 bg-gray-50" style={{ borderTop: "1px solid #474017", backgroundColor: "#0B1519" }}>
//   <h1 className="text-gray-800 font-semibold md:mr-auto">
//     © 2023 All rights reserved{" "}
//     <span className="hover:text-blue-600 font-semibold cursor-pointer">
//       IRDL{" "}
//     </span>
//   </h1>
//   <div className="text-white flex flex-col md:flex-row justify-center items-center px-10	  ">
//     <span className="hover:text-blue-600 font-semibold cursor-pointer px-5">
//       Terms{" "}
//     </span>
//     <span className="hover:text-blue-600 font-semibold cursor-pointer px-5">
//       Privacy{" "}
//     </span>
//     <span className="hover:text-blue-600 font-semibold cursor-pointer px-5">
//       Cookies{" "}
//     </span>
//   </div>
// </div>

//     </>
//   );
// }

// export default Footer;
