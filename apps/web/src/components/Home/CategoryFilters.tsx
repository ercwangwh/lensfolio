import React, { FC, useEffect, useState } from 'react';
import useHorizontalScroll from '@utils/hooks/useHorizantalScroll';
import { useProfileInterestsQuery } from 'lens';
import { Button } from '@components/UI/Button';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const CategoryFilters: FC = () => {
  const [scrollX, setScrollX] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);

  const { data, loading } = useProfileInterestsQuery();
  const scrollRef = useHorizontalScroll();
  const sectionOffsetWidth = scrollRef.current?.offsetWidth ?? 1000;
  const scrollOffset = sectionOffsetWidth / 1.2;

  useEffect(() => {
    if (scrollRef.current && scrollRef?.current?.scrollWidth === scrollRef?.current?.offsetWidth) {
      setScrollEnd(true);
    } else {
      setScrollEnd(false);
    }
  }, [scrollRef]);
  const slide = (shift: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += shift;
      setScrollX(scrollX + shift);
      if (
        Math.floor(scrollRef.current.scrollWidth - scrollRef.current.scrollLeft) <=
        scrollRef.current.offsetWidth
      ) {
        setScrollEnd(true);
      } else {
        setScrollEnd(false);
      }
    }
  };
  return (
    <div
      ref={scrollRef}
      className="mx-auto flex relative items-center scroll-smooth overflow-x-auto touch-pan-x mt-4 mb-8 space-x-2 no-scrollbar ultrawide:max-w-[110rem]"
    >
      {
        <div className="bg-white sticky left-0 top-0 px-2">
          <Button
            className="hidden border-none md:block sticky left-0 focus:outline-none bg-opacity-10 hover:bg-opacity-25 backdrop-blur-xl rounded-full p-2"
            onClick={() => slide(-scrollOffset)}
            light
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
        </div>
      }
      <Button
        variant={'secondary'}
        size="lg"
        className="px-3.5 bg-gray-100 border-none capitalize py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-full whitespace-nowrap"
        outline
      >
        All
      </Button>
      {data?.profileInterests.map((interest) => {
        return (
          <Button
            key={interest}
            variant={'secondary'}
            size="lg"
            className="px-3.5 bg-gray-100 capitalize py-1 text-xs border-none border-gray-200 dark:border-gray-700 rounded-full whitespace-nowrap"
            outline
          >
            {interest.toLowerCase()}
          </Button>
        );
      })}
      {
        <div className=" bg-white sticky right-0 bottom-0 px-2">
          <Button
            className="border-none hidden md:block sticky right-0 focus:outline-none bg-opacity-10 hover:bg-opacity-25 backdrop-blur-xl rounded-full p-2"
            onClick={() => slide(scrollOffset)}
            outline
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      }
    </div>
  );
};

export default CategoryFilters;
