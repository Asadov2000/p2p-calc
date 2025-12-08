import React from "react";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = "Avatar", size = 40, className }) => {
  return (
    <img
      src={src || "/avatars/default-avatar.svg"}
      alt={alt}
      width={size}
      height={size}
      className={`rounded-full object-cover bg-gray-200 ${className || ""}`}
      loading="lazy"
      draggable={false}
    />
  );
};
