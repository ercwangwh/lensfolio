// import Alert from '@components/Common/Alert'
import Alert from '@components/UI/Alert';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import type { LensfolioCollectModule } from 'utils';
import { IS_MAINNET } from 'utils';

const getUniswapURL = (amount: number, outputCurrency: string): string => {
  return `https://app.uniswap.org/#/swap?exactField=output&exactAmount=${amount}&outputCurrency=${outputCurrency}&chain=${
    IS_MAINNET ? 'polygon' : 'polygon_mumbai'
  }`;
};

interface Props {
  collectModule: LensfolioCollectModule;
}

const BalanceAlert: FC<Props> = ({ collectModule }) => {
  return (
    <div className="flex-1">
      <Alert variant="warning">
        <div className="flex items-center justify-between flex-1 text-sm">
          <span>Not enough {collectModule?.amount?.asset?.symbol} token balance</span>
          <Link
            href={getUniswapURL(
              parseFloat(collectModule?.amount?.value),
              collectModule?.amount?.asset?.address
            )}
            rel="noreferer noreferrer"
            target="_blank"
            className="text-indigo-500"
          >
            Swap
          </Link>
        </div>
      </Alert>
    </div>
  );
};

export default BalanceAlert;
