import React, { FC } from 'react';
import { Card } from '@components/UI/Card';
import { PublicationMainFocus, PublicationTypes, useProfilePostsQuery } from 'lens';
const Works: FC = () => {
  // const request = {
  //   publicationTypes: [PublicationTypes.Post],
  //   limit: 32,
  //   metadata: { mainContentFocus: [PublicationMainFocus.Image] },
  //   customFilters: LENS_CUSTOM_FILTERS,
  //   profileId: channel?.id
  // };

  // const { data, loading, error, fetchMore } = useProfilePostsQuery({
  //   variables: {
  //     request
  //   },
  //   skip: !channel?.id
  // });

  return (
    <div>
      <Card>
        <div>Image</div>
        <div>Title</div>
        <div>Description</div>
        <div>tags</div>
        <div>like</div>
        <div>comment</div>
      </Card>
    </div>
  );
};

export default Works;
