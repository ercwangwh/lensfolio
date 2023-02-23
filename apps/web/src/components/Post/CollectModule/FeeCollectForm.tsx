import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import type { Erc20 } from 'lens';
import type { Dispatch, FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CollectModuleType, LensfolioWorks } from 'utils';
import { WMATIC_TOKEN_ADDRESS } from 'utils';
import { z } from 'zod';
import { getCollectModule } from '@lib/getCollectModule';

interface Props {
  uploadedWork: LensfolioWorks;
  setCollectType: (data: CollectModuleType) => void;
  // setShowModal: Dispatch<boolean>;
  enabledCurrencies: { enabledModuleCurrencies: Array<Erc20> };
}

const formSchema = z.object({
  currency: z.string(),
  amount: z.string().min(1, { message: 'Invalid amount' }),
  collectLimit: z.string().min(1, { message: 'Invalid collect limit' }),
  referralPercent: z
    .number()
    .max(100, { message: 'Percentage should be 0 to 100' })
    .nonnegative({ message: 'Should to greater than or equal to zero' })
});
export type FormData = z.infer<typeof formSchema>;

const FeeCollectForm: FC<Props> = ({ uploadedWork, setCollectType, enabledCurrencies }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    unregister,
    setError
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      referralPercent: Number(uploadedWork.collectModule.referralFee || 0),
      currency: uploadedWork.collectModule.amount?.currency ?? WMATIC_TOKEN_ADDRESS,
      amount: uploadedWork.collectModule.amount?.value,
      collectLimit: uploadedWork.collectModule.collectLimit || '1'
    }
  });
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setShowCollectModuleModal = useGlobalModalStateStore((state) => state.setShowCollectModuleModal);
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('WMATIC');

  useEffect(() => {
    if (
      uploadedWork.collectModule.isLimitedFeeCollect ||
      uploadedWork.collectModule.isLimitedTimeFeeCollect
    ) {
      register('collectLimit');
    } else {
      unregister('collectLimit');
    }
  }, [uploadedWork.collectModule, register, unregister]);

  const getCurrencySymbol = (currencies: Erc20[], address: string) => {
    return currencies.find((c) => c.address === address)?.symbol as string;
  };

  const onSubmit = (data: FormData) => {
    const amount = Number(data.amount);
    if (amount === 0) {
      return setError('amount', { message: 'Amount should be greater than 0' });
    }
    if (Number(data.collectLimit) === 0) {
      return setError('collectLimit', {
        message: 'Collect limit should be greater than 0'
      });
    }
    setCollectType({
      amount: {
        currency: data.currency,
        value: amount.toString()
      },
      referralFee: data.referralPercent,
      recipient: currentProfile?.ownedBy,
      collectLimit: data.collectLimit
    });
    setShowCollectModuleModal(false);
    console.log('Upload Collect Module:', uploadedWork.collectModule);
    console.log('Upload Collect Module:', getCollectModule(uploadedWork.collectModule));
  };

  return (
    <form className="space-y-3">
      {uploadedWork.collectModule.isLimitedFeeCollect ||
      uploadedWork.collectModule.isLimitedTimeFeeCollect ? (
        <div>
          <Input
            type="number"
            label="Total Collectables"
            placeholder="3"
            min="1"
            autoComplete="off"
            validationError={errors.collectLimit?.message}
            {...register('collectLimit', {
              setValueAs: (v) => String(v)
            })}
          />
        </div>
      ) : null}
      <div>
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">Collect Currency</div>
        </div>
        <select
          autoComplete="off"
          className="bg-white text-sm p-2.5 rounded-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full"
          {...register('currency')}
          value={uploadedWork.collectModule.amount?.currency}
          onChange={(e) => {
            setCollectType({
              amount: { currency: e.target.value, value: '' }
            });
            setSelectedCurrencySymbol(
              getCurrencySymbol(enabledCurrencies.enabledModuleCurrencies, e.target.value)
            );
          }}
        >
          {enabledCurrencies?.enabledModuleCurrencies?.map((currency: Erc20) => (
            <option key={currency.address} value={currency.address}>
              {currency.symbol}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Input
          type="number"
          label="Price of each collect"
          placeholder="1.5"
          min="0"
          autoComplete="off"
          max="100000"
          suffix={selectedCurrencySymbol}
          validationError={errors.amount?.message}
          {...register('amount', {
            setValueAs: (v) => String(v)
          })}
        />
      </div>
      <div>
        <Input
          label="Referral Percentage"
          type="number"
          placeholder="2"
          suffix="%"
          {...register('referralPercent', { valueAsNumber: true })}
          validationError={errors.referralPercent?.message}
        />
        <span className="text-xs opacity-60">
          Percent of collect revenue can be shared with anyone who mirrors this work.
        </span>
      </div>
      <div className="flex justify-end">
        <Button type="button" onClick={() => handleSubmit(onSubmit)()}>
          Set Collect Type
        </Button>
      </div>
    </form>
  );
};

export default FeeCollectForm;
