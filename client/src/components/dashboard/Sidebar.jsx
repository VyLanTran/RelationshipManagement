// import { Link } from 'react-router-dom'

// const Sidebar = () => {
//     return (
//         <div>
//             <button
//                 type="button"
//                 className="text-gray-500 hover:text-gray-600"
//                 data-hs-overlay="#docs-sidebar"
//                 aria-controls="docs-sidebar"
//                 aria-label="Toggle navigation"
//             >
//                 <span className="sr-only">Toggle Navigation</span>
//                 <svg
//                     className="flex-shrink-0 size-4"
//                     width="16"
//                     height="16"
//                     fill="currentColor"
//                     viewBox="0 0 16 16"
//                 >
//                     <path
//                         fill-rule="evenodd"
//                         d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
//                     />
//                 </svg>
//             </button>

//             <div
//                 id="docs-sidebar"
//                 className="hs-overlay [--auto-close:lg] hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300"
//             >
//                 <div className="px-6">
//                     <Link
//                         className="flex-none text-xl font-semibold"
//                         to="#"
//                         aria-label="Brand"
//                     >
//                         Brand
//                     </Link>
//                 </div>
//                 <nav
//                     className="hs-accordion-group p-6 w-full flex flex-col flex-wrap"
//                     data-hs-accordion-always-open
//                 >
//                     <ul className="space-y-1.5">
//                         <li>
//                             <Link
//                                 className="flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                 to="#"
//                             >
//                                 <svg
//                                     className="size-4"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-width="2"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                 >
//                                     <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
//                                     <polyline points="9 22 9 12 15 12 15 22" />
//                                 </svg>
//                                 Dashboard
//                             </Link>
//                         </li>

//                         <li className="hs-accordion" id="users-accordion">
//                             <button
//                                 type="button"
//                                 className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                             >
//                                 <svg
//                                     className="size-4"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-width="2"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                 >
//                                     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                                     <circle cx="9" cy="7" r="4" />
//                                     <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                                     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//                                 </svg>
//                                 Users
//                                 <svg
//                                     className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-width="2"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                 >
//                                     <path d="m18 15-6-6-6 6" />
//                                 </svg>
//                                 <svg
//                                     className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="24"
//                                     height="24"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     stroke-width="2"
//                                     stroke-linecap="round"
//                                     stroke-linejoin="round"
//                                 >
//                                     <path d="m6 9 6 6 6-6" />
//                                 </svg>
//                             </button>

//                             <div
//                                 id="users-accordion"
//                                 className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
//                             >
//                                 <ul
//                                     className="hs-accordion-group ps-3 pt-2"
//                                     data-hs-accordion-always-open
//                                 >
//                                     <li
//                                         className="hs-accordion"
//                                         id="users-accordion-sub-1"
//                                     >
//                                         <button
//                                             type="button"
//                                             className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                         >
//                                             Sub Menu 1
//                                             <svg
//                                                 className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 width="24"
//                                                 height="24"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 stroke-width="2"
//                                                 stroke-linecap="round"
//                                                 stroke-linejoin="round"
//                                             >
//                                                 <path d="m18 15-6-6-6 6" />
//                                             </svg>
//                                             <svg
//                                                 className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 width="24"
//                                                 height="24"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 stroke-width="2"
//                                                 stroke-linecap="round"
//                                                 stroke-linejoin="round"
//                                             >
//                                                 <path d="m6 9 6 6 6-6" />
//                                             </svg>
//                                         </button>

//                                         <div
//                                             id="users-accordion-sub-1"
//                                             className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden"
//                                         >
//                                             <ul className="pt-2 ps-2">
//                                                 <li>
//                                                     <Link
//                                                         className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                                         to="#"
//                                                     >
//                                                         Link 1
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link
//                                                         className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                                         to="#"
//                                                     >
//                                                         Link 2
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link
//                                                         className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                                         to="#"
//                                                     >
//                                                         Link 3
//                                                     </Link>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     </li>
//                                     <li
//                                         className="hs-accordion"
//                                         id="users-accordion-sub-2"
//                                     >
//                                         <button
//                                             type="button"
//                                             className="hs-accordion-toggle hs-accordion-active:text-blue-600 hs-accordion-active:hover:bg-transparent w-full text-start flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                         >
//                                             Sub Menu 2
//                                             <svg
//                                                 className="hs-accordion-active:block ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 width="24"
//                                                 height="24"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 stroke-width="2"
//                                                 stroke-linecap="round"
//                                                 stroke-linejoin="round"
//                                             >
//                                                 <path d="m18 15-6-6-6 6" />
//                                             </svg>
//                                             <svg
//                                                 className="hs-accordion-active:hidden ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 width="24"
//                                                 height="24"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="currentColor"
//                                                 stroke-width="2"
//                                                 stroke-linecap="round"
//                                                 stroke-linejoin="round"
//                                             >
//                                                 <path d="m6 9 6 6 6-6" />
//                                             </svg>
//                                         </button>

//                                         <div
//                                             id="users-accordion-sub-2"
//                                             className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300 hidden ps-2"
//                                         >
//                                             <ul className="pt-2 ps-2">
//                                                 <li>
//                                                     <Link
//                                                         className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                                         to="#"
//                                                     >
//                                                         Link 1
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link
//                                                         className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                                         to="#"
//                                                     >
//                                                         Link 2
//                                                     </Link>
//                                                 </li>
//                                                 <li>
//                                                     <Link
//                                                         className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
//                                                         to="#"
//                                                     >
//                                                         Link 3
//                                                     </Link>
//                                                 </li>
//                                             </ul>
//                                         </div>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//         </div>
//     )
// }

// export default Sidebar
