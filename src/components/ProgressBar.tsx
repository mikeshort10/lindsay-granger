import React from "react";

type ProgressBarProps = {
  value: number;
  total: number;
  color: string;
  label: string;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  total,
  color,
  label,
}) => {
  const percentage = (value / total) * 100;

  return (
    <div className="my-0">
      <span>{label}</span>
      <div
        className="inline-block w-20 h-2 ml-2 rounded"
        style={{
          background: `linear-gradient(to right, ${color}, ${color} ${percentage}%, white ${percentage}%)`,
        }}
      />
    </div>
  );
};
