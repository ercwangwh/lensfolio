import React, { FC } from "react";

interface NavItemProps {
  name: string;
}

const NavItem = ({ name }: NavItemProps) => {
  return <div>{name}</div>;
};

const NavItems: FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <NavItem name="Home" />
      <NavItem name="Explore" />
    </div>
  );
};

export default NavItems;
