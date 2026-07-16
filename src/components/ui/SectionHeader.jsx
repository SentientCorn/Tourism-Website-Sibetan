import React from 'react';

const SectionHeader = ({ pillText, title, description }) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      {pillText && (
        <div className="inline-block bg-accent-light text-accent font-jakarta text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">
          {pillText}
        </div>
      )}
      <h2 className="font-poppins text-4xl md:text-5xl font-bold text-brand mb-6">
        {title}
      </h2>
      <p className="font-jakarta text-content-main md:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default SectionHeader;
