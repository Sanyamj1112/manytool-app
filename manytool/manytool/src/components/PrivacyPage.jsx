import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto py-12 px-6">
    <Helmet><title>Privacy Policy | ManyTool</title></Helmet>
    
    <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
    
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
      At <strong>ManyTool</strong>, we prioritize the trust and privacy of our users. 
      We adhere to a strict <strong>"Client-Side Only"</strong> data policy to ensure your 
      work remains yours alone.
    </p>

    <ul className="space-y-6 text-gray-600 dark:text-gray-400">
      <li>
        <strong className="text-gray-900 dark:text-white">No Server-Side Storage:</strong> When you use our utilities, 
        all data processing occurs entirely within your own web browser. Your inputs, generated outputs, 
        and configurations are never transmitted to, stored on, or analyzed by our servers.
      </li>
      <li>
        <strong className="text-gray-900 dark:text-white">Complete Data Privacy:</strong> Since we do not store 
        your data, there is no risk of data leakage or unauthorized access. Everything you do on ManyTool 
        remains under your full control.
      </li>
      <li>
        <strong className="text-gray-900 dark:text-white">Transparency:</strong> We do not track your activity, 
        use invasive cookies, or build user profiles. We believe that your work is yours alone, and our 
        role is simply to provide the tools to perform it efficiently.
      </li>
      <li>
        <strong className="text-gray-900 dark:text-white">Updates:</strong> We may update this policy occasionally 
        to reflect improvements in our technology, but our commitment to data privacy remains absolute.
      </li>
    </ul>

    <div className="mt-10 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-cyan-500">
      <p className="text-sm text-gray-700 dark:text-gray-300">
        If you have any questions regarding our privacy practices, feel free to reach out via our connect section.
      </p>
    </div>
  </div>
);

export default PrivacyPage;