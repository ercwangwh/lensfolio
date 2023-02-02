import TimelineShimmer from '@components/Common/Shimmer/TimelineShimmer';
// import { Loader } from '@components/UIElements/Loader'
// import { NoDataFound } from '@components/UIElements/NoDataFound'
import type { Nft, Profile } from 'lens';
import { useProfileNfTsQuery } from 'lens';
import type { FC } from 'react';
import React from 'react';
// import { useInView } from 'react-cool-inview'
import { POLYGON_CHAIN_ID, SCROLL_ROOT_MARGIN } from 'utils';

import NFTCard from './NFTCard';

type Props = {
  profile: Profile;
};

const CollectedNFTs: FC<Props> = ({ profile }) => {
  const request = {
    limit: 32,
    chainIds: [POLYGON_CHAIN_ID],
    ownerAddress: profile.ownedBy
  };

  const { data, loading, error, fetchMore } = useProfileNfTsQuery({
    variables: {
      request
    }
  });

  const collectedNFTs = data?.nfts?.items as Nft[];
  console.log('profile.ownedBy: ', profile.ownedBy);
  console.log('Collected NFTs: ', data);
  const pageInfo = data?.nfts?.pageInfo;

  // const { observe } = useInView({
  //   rootMargin: SCROLL_ROOT_MARGIN,
  //   onEnter: async () => {
  //     await fetchMore({
  //       variables: {
  //         request: {
  //           ...request,
  //           cursor: pageInfo?.next
  //         }
  //       }
  //     })
  //   }
  // })

  if (loading) return <TimelineShimmer />;

  if (error) console.log('Error', error);

  // if (data?.nfts?.items?.length === 0) {
  //   return <NoDataFound isCenter withImage text="No NFTs found" />
  // }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <div className="grid gap-x-4 2xl:grid-cols-5 md:gap-y-8 gap-y-2 ultrawide:grid-cols-6 laptop:grid-cols-4 md:grid-cols-2 grid-col-1">
            {collectedNFTs?.map((nft: Nft) => (
              <NFTCard key={`${nft.contractAddress}_${nft.tokenId}`} nft={nft} />
            ))}
          </div>
          {/* {pageInfo?.next && collectedNFTs.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )} */}
        </>
      )}
    </div>
  );
};

export default CollectedNFTs;
