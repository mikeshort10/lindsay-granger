import React from "react";

export const SettingCard: React.FC = ({ children }) => {
  return (
    <div className="rounded w-1/2 max-w-3xl mx-auto mt-10 bg-gray-800 px-5 py-5 cursor-default">
      {children}
    </div>
  );
};

export const Paragraph: React.FC = ({ children }) => {
  return <p className="pb-8 text-center">{children}</p>;
};
