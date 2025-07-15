import React from 'react';

// By extending React.HTMLAttributes<HTMLDivElement>, we can pass any standard div attributes
// like onClick, onMouseOver, etc. to the Card component.
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
