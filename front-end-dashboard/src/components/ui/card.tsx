import React from "react";

export const Card: React.FC = ({ children }) => {
  return <div className="bg-gray-800 p-6 rounded-lg shadow-lg">{children}</div>;
};

export const CardContent: React.FC = ({ children }) => {
  return <div className="text-white">{children}</div>;
};
