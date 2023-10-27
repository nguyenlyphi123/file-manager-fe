import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import EmptyData from 'components/EmptyData';
import LargeCard from 'components/cards/LargeCard';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation } from 'redux/slices/location';
import { search } from 'services/searchController';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import { renderFileTypes } from 'utils/helpers/Helper';

function SearchPage() {
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  const nameParam = searchParams.get('name');

  const { data, isLoading } = useQuery({
    queryKey: ['search', nameParam],
    queryFn: () => search(nameParam),
    retry: 0,
  });

  const { folders, files } = data?.data || { folders: [], files: [] };

  const handleCardSelect = (val) => {
    const data = {
      parent: val.parent_folder ? val.parent_folder._id : '',
      name: val.name,
      _id: val._id,
      href: val.href,
    };
    dispatch(pushLocation(data));
    dispatch(setCurrentFolder(val));
  };

  if (isLoading) return () => <div>Loading...</div>;

  if (files.length === 0 && folders.length === 0) {
    return <EmptyData message={'No folders or files were found'} />;
  }

  return (
    <div className='min-h-[calc(100vh-142px)] tracking-wide relative'>
      <div className='sticky top-0 z-10 pt-2 pb-3 px-7 bg-white border'>
        <div className='text-[18px] text-gray-600 font-semibold mb-3'>
          Search results for keywords "{nameParam}"
        </div>
        <Grid container spacing={2}>
          <Grid item sm={4} md={2}>
            <FormControl fullWidth size='small'>
              <InputLabel>Type</InputLabel>
              <Select
                label='Type'
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 270,
                    },
                  },
                }}
                renderValue={(selected) => (
                  <div className='flex items-center'>
                    <FileIconHelper type={selected} className='w-5 h-5 mr-2' />
                    {selected}
                  </div>
                )}
              >
                {renderFileTypes().map((type) => (
                  <MenuItem key={type} value={type}>
                    <FileIconHelper type={type} className='w-5 h-5 mr-5' />
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item sm={4} md={2}>
            <FormControl fullWidth size='small'>
              <InputLabel>Action</InputLabel>
              <Select
                label='Action'
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 270,
                    },
                  },
                }}
              >
                <MenuItem value='recent-edit'>Recent edit</MenuItem>
                <MenuItem value='recent-open'>Recent open</MenuItem>
                <MenuItem value='recent-create'>Recent create</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <div className='py-5 px-7'>
        {folders?.length > 0 && (
          <>
            <div className='mt-2'>
              <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
                {folders?.map((folder) => (
                  <LargeCard
                    key={folder._id}
                    data={folder}
                    onClick={handleCardSelect}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {files?.length > 0 && (
          <>
            <div className='mt-5'>
              <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
                {files?.map((file) => (
                  <LargeCard key={file._id} data={file} isFolder={false} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
