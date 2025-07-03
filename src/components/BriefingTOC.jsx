import React from 'react';

const BriefingTOC = ({ sections, activeId }) => {
  const scrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // height of sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="sticky top-32 hidden lg:block">
        <h4 className="font-bold text-white mb-4 text-right">في هذه الصفحة</h4>
        <ul className="space-y-2 border-r-2 border-gray-700">
            {sections.map(section => (
                <li key={section.id}>
                    <a 
                        href={`#${section.id}`}
                        onClick={(e) => scrollTo(e, section.id)}
                        className={`block text-right pr-4 py-1 border-r-4 -mr-0.5 transition-all duration-200 ${
                            activeId === section.id
                                ? 'border-blue-400 text-blue-300 font-semibold'
                                : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                    >
                        {section.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default BriefingTOC; 