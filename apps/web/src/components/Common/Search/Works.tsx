import type { Publication } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import nFormatter from '@lib/nFormatter';
// import { formatNumber } from 'utils/functions/formatNumber';

// import { BanknotesIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
// import LikeOutline from '../Icons/LikeOutline';

interface Props {
  results: Publication[];
  loading: boolean;
  clearSearch: () => void;
}

const Works: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <>
      {results?.map((result) => (
        <div
          onClick={() => clearSearch()}
          key={result.id}
          className="relative cursor-default select-none pl-3 pr-4 hover:bg-gray-100 dark:hover:bg-gray-900"
          role="button"
        >
          <Link
            href={`/works/${result?.id}`}
            key={result?.id}
            className="flex flex-col justify-center space-y-1 rounded-xl py-2"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <p className="line-clamp-1 truncate text-base">{result?.metadata?.name}</p>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <HeartIcon className="h-3 w-3" />
                <span>{nFormatter(result.stats.totalUpvotes)}</span>
              </span>
            </span>
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">No results found.</div>
      )}
    </>
  );
};

export default Works;
