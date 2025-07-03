import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export function FAQItem({ question, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-right"
      >
        <span className="text-xl font-semibold text-white">{question}</span>
        <span className="text-blue-500">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pt-4 text-gray-300 text-right">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
} 