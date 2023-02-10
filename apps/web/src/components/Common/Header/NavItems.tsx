import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

interface NavItemProps {
  name: string;
}

const NavItem = ({ name }: NavItemProps) => {
  return <div>{name}</div>;
};

const NavItems: FC = () => {
  const router = useRouter();

  return (
    <div className="flex items-center space-x-4 font-medium">
      <img
        className="w-8 h-8 rounded-3xl cursor-pointer"
        height={112}
        width={112}
        src="/logo.svg"
        alt="Logo"
        onClick={() => {
          router.push('/');
        }}
      />
      <button
        onClick={() => {
          router.push('/');
        }}
      >
        <NavItem name="Home" />
      </button>
      <button
        onClick={() => {
          router.push('/explore');
        }}
      >
        <NavItem name="Explore" />
      </button>
      <button
        onClick={() => {
          router.push('/subscription');
        }}
      >
        <NavItem name="Subscription" />
      </button>
    </div>
  );
};

export default NavItems;
