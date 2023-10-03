import { Card, CardHeader, Skeleton } from '@mui/material';
import React, { useCallback } from 'react';

export default function ChatListLoading({ repeat }) {
  const renderItem = useCallback(() => {
    const items = [];
    for (let i = 0; i < repeat; i++) {
      items.push(
        <Card key={i} sx={{ my: 0.2, boxShadow: 'none' }}>
          <CardHeader
            avatar={
              <Skeleton
                animation='wave'
                variant='circular'
                height={50}
                width={50}
              />
            }
            title={<Skeleton animation='wave' height={20} />}
            subheader={<Skeleton animation='wave' height={10} />}
            sx={{ my: 0.5 }}
          />
        </Card>,
      );
    }
    return items;
  }, [repeat]);

  return <div className='flex flex-col mt-5'>{renderItem()}</div>;
}
