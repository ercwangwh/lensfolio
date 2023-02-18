import { Menu } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';
// import { Analytics } from '@lib/analytics';
import clsx from 'clsx';
import type { Publication } from 'lens';
import { useHidePublicationMutation } from 'lens';
import { useRouter } from 'next/router';
import type { FC, MouseEvent } from 'react';
// import { PUBLICATION } from 'src/tracking';

interface Props {
  work: Publication;
}

const Delete: FC<Props> = ({ work }) => {
  const { pathname, push } = useRouter();
  const [hidePost] = useHidePublicationMutation({
    onCompleted: () => {
      // Analytics.track(PUBLICATION.DELETE);
      pathname === '/works/[id]' ? push('/') : location.reload();
    }
  });

  return (
    <Menu>
      <Menu.Item
        as="div"
        className={({ active }) =>
          clsx(
            { 'dropdown-active': active },
            'block px-4 py-1.5 text-sm text-red-500 m-2 rounded-lg cursor-pointer'
          )
        }
        onClick={(event: MouseEvent<HTMLDivElement>) => {
          event.stopPropagation();
          if (confirm('Are you sure you want to delete?')) {
            hidePost({
              variables: { request: { publicationId: work?.id } }
            });
          }
        }}
      >
        <div className="flex items-center space-x-2">
          <TrashIcon className="w-4 h-4" />
          <div>Delete</div>
        </div>
      </Menu.Item>
    </Menu>
  );
};

export default Delete;
