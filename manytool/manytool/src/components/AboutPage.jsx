import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-6">
    <Helmet><title>About | ManyTool</title></Helmet>
    
    <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">About ManyTool</h1>
    
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
      Welcome to <strong>ManyTool</strong>, your all-in-one digital workspace designed to streamline technical workflows 
      and simplify daily productivity. We understand that in the fast-paced world of software development and 
      content creation, time is your most valuable asset. That is why we have engineered a suite of 
      high-performance utilities that are fast, clean, and optimized for efficiency.
    </p>

    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Why ManyTool?</h2>
    
    <ul className="space-y-6 mb-8 text-gray-600 dark:text-gray-400">
      <li>
        <strong className="text-gray-900 dark:text-white">Developer-Centric Engineering:</strong> Our tools are built with precision, 
        catering specifically to the needs of developers who require reliable, bug-free, and high-speed solutions for tasks 
        like data transformation, string manipulation, and system utilities.
      </li>
      <li>
        <strong className="text-gray-900 dark:text-white">Performance First:</strong> ManyTool operates with a "no-nonsense" 
        philosophy. Everything runs instantly in your browser—no server-side delays, no complex configurations, 
        and no privacy compromises.
      </li>
      <li>
        <strong className="text-gray-900 dark:text-white">Privacy by Design:</strong> Security is at our core. Since all 
        your data processing happens locally within your browser, your sensitive information never leaves your device. 
        We believe that professional tools should be powerful, yet private.
      </li>
      <li>
        <strong className="text-gray-900 dark:text-white">Accessibility & Design:</strong> We have eliminated the clutter. 
        Our interface is minimal, distraction-free, and fully responsive, ensuring that your tools are available 
        whenever you need them, whether you are on a desktop workstation or a mobile device.
      </li>
    </ul>

    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
      At ManyTool, we are committed to constant iteration. We are building a robust ecosystem that grows with the 
      needs of the modern digital community. Whether you are debugging complex strings, generating project boilerplate, 
      or just looking to optimize your workflow, ManyTool is your ultimate companion.
    </p>

    <p className="text-lg font-semibold text-gray-900 dark:text-white mt-6">
      Built with precision, for those who build the future.
    </p>
  </div>
);

export default AboutPage;