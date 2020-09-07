import React from "react";

type ButtonProps = React.HTMLProps<HTMLButtonElement> & {
  type?: "reset" | "submit" | "button";
  color: string;
  primary?: true;
  onClick: React.HTMLProps<HTMLButtonElement>["onClick"];
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  color,
  primary,
  ...props
}) => {
  const bg = primary ? color : "white";
  const text = primary ? "white" : color;
  return (
    <button
      className={`${className} bg-${bg} text-${text} border-${text} border-2 px-3 py-2 rounded shadow`}
      {...props}
    >
      {children}
    </button>
  );
};
