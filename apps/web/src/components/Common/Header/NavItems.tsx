import Link from 'next/link';
import React, { FC } from 'react';

interface NavItemProps {
  name: string;
}

const NavItem = ({ name }: NavItemProps) => {
  return <div>{name}</div>;
};

const NavItems: FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/">
        <NavItem name="Home" />
      </Link>
      <Link href="/explore">
        <NavItem name="Explore" />
      </Link>
    </div>
  );
};

export default NavItems;
