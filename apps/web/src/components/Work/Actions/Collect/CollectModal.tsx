import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink';
import { Button } from '@components/UI/Button';
import { Loader } from '@components/UI/Loader';
import { Modal } from '@components/UI/Modal';
import { useAppStore } from 'src/store/app';
import Alert from '@components/UI/Alert';
import { useAppPersistStore } from 'src/store/app';

import dayjs from 'dayjs';
import type { ApprovedAllowanceAmount, Publication } from 'lens';
import { useApprovedModuleAllowanceAmountQuery, usePublicationRevenueQuery } from 'lens';
import type { Dispatch, FC } from 'react';
import React, { useEffect, useState } from 'react';
import type { LensfolioCollectModule } from 'utils';
// import { Analytics, TRACK } from 'utils';
import nFormatter from '@lib/nFormatter';
// import { formatNumber } from 'utils/functions/formatNumber';
import { shortenAddress } from '@lib/shortenAddress';

import { useBalance } from 'wagmi';

import BalanceAlert from './BalanceAlert';
import PermissionAlert from './PermissionAlert';

interface Props {
  showModal: boolean;
  setShowModal: Dispatch<boolean>;
  work: Publication;
  collecting: boolean;
  fetchingCollectModule: boolean;
  collectModule: LensfolioCollectModule;
  collectNow: () => void;
}

const CollectModal: FC<Props> = ({
  showModal,
  setShowModal,
  work,
  collectNow,
  collecting,
  collectModule,
  fetchingCollectModule
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profileId = useAppPersistStore((state) => state.profileId);

  const [isAllowed, setIsAllowed] = useState(true);
  const [haveEnoughBalance, setHaveEnoughBalance] = useState(false);
  const isMembershipActive = work.profile?.followModule?.__typename === 'FeeFollowModuleSettings';
  const isFreeCollect = work.collectModule.__typename === 'FreeCollectModuleSettings';

  // useEffect(() => {
  //   Analytics.track(TRACK.COLLECT.OPEN);
  // }, []);

  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: currentProfile?.ownedBy,
    token: collectModule?.amount?.asset?.address,
    formatUnits: collectModule?.amount?.asset?.decimals,
    watch: Boolean(collectModule?.amount),
    enabled: Boolean(collectModule?.amount)
  });

  const { data: revenueData } = usePublicationRevenueQuery({
    variables: {
      request: {
        publicationId: work?.id
      }
    },
    skip: !work?.id
  });

  const {
    loading: allowanceLoading,
    data: allowanceData,
    refetch: refetchAllowance
  } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: {
        currencies: collectModule?.amount?.asset?.address,
        followModules: [],
        collectModules: [collectModule?.type],
        referenceModules: []
      }
    },
    skip: !collectModule?.amount?.asset?.address || !profileId,
    onCompleted: (data) => {
      setIsAllowed(data?.approvedModuleAllowanceAmount[0]?.allowance !== '0x00');
    }
  });

  useEffect(() => {
    if (
      balanceData &&
      collectModule?.amount &&
      parseFloat(balanceData?.formatted) < parseFloat(collectModule?.amount?.value)
    )
      setHaveEnoughBalance(false);
    else setHaveEnoughBalance(true);
    if (collectModule?.amount?.asset?.address && profileId) {
      refetchAllowance();
    }
  }, [
    balanceData,
    collectModule,
    collectModule?.amount?.value,
    collectModule?.amount,
    refetchAllowance,
    profileId
  ]);
  // console.log('fetchingCollectModule', fetchingCollectModule);
  return (
    <Modal
      title="Collect Work"
      // panelClassName="max-w-md"
      size="lg"
      onClose={() => setShowModal(false)}
      show={showModal}
    >
      <div className=" p-5 py-5">
        {!fetchingCollectModule && !allowanceLoading ? (
          <>
            <div className="flex flex-col mb-3">
              <span className="text-sm">Total Collects</span>
              <span className="space-x-1">
                <span className="text-lg">{nFormatter(work?.stats.totalAmountOfCollects)}</span>
              </span>
            </div>
            {collectModule?.amount ? (
              <div className="flex flex-col mb-3">
                <span className="text-sm">Price</span>
                <span className="space-x-1">
                  <span className="text-2xl font-semibold">{collectModule?.amount?.value}</span>
                  <span>{collectModule?.amount?.asset.symbol}</span>
                </span>
              </div>
            ) : null}
            {collectModule?.recipient ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Recipient</span>
                <AddressExplorerLink address={collectModule?.recipient}>
                  <span className="text-lg">{shortenAddress(collectModule?.recipient)}</span>
                </AddressExplorerLink>
              </div>
            ) : null}
            {revenueData?.publicationRevenue ? (
              <div className="flex flex-col mb-3">
                <span className="text-xs">Revenue</span>
                <span className="space-x-1">
                  <span className="text-2xl font-semibold">
                    {revenueData?.publicationRevenue?.revenue?.total?.value ?? 0}
                  </span>
                  <span>{collectModule?.amount?.asset.symbol}</span>
                </span>
              </div>
            ) : null}
            {collectModule?.endTimestamp ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Ends At</span>
                <span className="text-lg">
                  {dayjs(collectModule.endTimestamp).format('MMMM DD, YYYY')} at{' '}
                  {dayjs(collectModule.endTimestamp).format('hh:mm a')}
                </span>
              </div>
            ) : null}
            {collectModule?.referralFee ? (
              <div className="flex flex-col mb-3">
                <span className="mb-0.5 text-sm">Referral Fee</span>
                <span className="text-lg">{collectModule.referralFee} %</span>
              </div>
            ) : null}
            <div className="flex justify-end space-x-2">
              {isAllowed ? (
                collectModule?.followerOnly && !work.profile.isFollowedByMe ? (
                  <div className="flex-1">
                    <Alert variant="warning">
                      <div className="flex px-2">
                        Only {isMembershipActive ? 'Members' : 'Subscribers'} can collect this publication
                      </div>
                    </Alert>
                  </div>
                ) : balanceLoading && !haveEnoughBalance ? (
                  <div className="flex justify-center w-full py-2">
                    <Loader />
                  </div>
                ) : haveEnoughBalance ? (
                  <Button disabled={collecting} onClick={() => collectNow()}>
                    {isFreeCollect ? 'Collect for free' : 'Collect Now'}
                  </Button>
                ) : (
                  <BalanceAlert collectModule={collectModule} />
                )
              ) : (
                <PermissionAlert
                  isAllowed={isAllowed}
                  setIsAllowed={setIsAllowed}
                  allowanceModule={allowanceData?.approvedModuleAllowanceAmount[0] as ApprovedAllowanceAmount}
                />
              )}
            </div>
          </>
        ) : (
          <div className="py-6">
            <Loader />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CollectModal;
