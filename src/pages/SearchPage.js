import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import EmptyData from 'components/EmptyData';
import LargeCard from 'components/cards/LargeCard';
import useNavigateParams from 'hooks/useNavigateParams';
import Loading from 'parts/Loading';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setCurrentFolder } from 'redux/slices/curentFolder';
import { pushLocation } from 'redux/slices/location';
import { search } from 'services/searchController';
import FileIconHelper from 'utils/helpers/FileIconHelper';
import { renderFileTypes } from 'utils/helpers/Helper';

function SearchPage() {
  const dispatch = useDispatch();

  const navigate = useNavigateParams();

  const [searchParams] = useSearchParams();

  const nameParam = searchParams.get('name');
  const typeParam = searchParams.get('type');
  const actionParam = searchParams.get('action');

  const { data, isLoading } = useQuery({
    queryKey: ['search', { nameParam, typeParam, actionParam }],
    queryFn: (params) => {
      const {
        nameParam: name,
        typeParam: type,
        actionParam: action,
      } = params.queryKey[1];
      return search({ name, type, action });
    },
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

  const handleSelectSort = (e) => {
    const { name, value } = e.target;
    navigate(`/search`, {
      name: nameParam,
      type: typeParam,
      action: actionParam,
      [name]: value,
    });
  };

  return (
    <div className='min-h-[calc(100vh-142px)] tracking-wide relative'>
      <div className='sticky top-0 z-10 pt-6 pb-4 px-7 bg-white border'>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <div className='text-[18px] text-gray-600 font-semibold mb-4 mt-1'>
              Search results for keywords "{nameParam}"
            </div>
          </Grid>

          <Grid item sm={12} md={6}>
            <Grid container spacing={2} sx={{ justifyContent: 'end' }}>
              <Grid item sm={4} md={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label='Type'
                    name='type'
                    defaultValue='all'
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 270,
                        },
                      },
                    }}
                    renderValue={(selected) => (
                      <div className='flex items-center'>
                        <FileIconHelper
                          type={selected}
                          className='w-5 h-5 mr-2'
                        />
                        {selected}
                      </div>
                    )}
                    onChange={handleSelectSort}
                  >
                    <MenuItem
                      key='all'
                      value='all'
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      All File And Folder
                    </MenuItem>
                    {renderFileTypes().map((type) => (
                      <MenuItem key={type} value={type}>
                        <FileIconHelper type={type} className='w-5 h-5 mr-5' />
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item sm={4} md={4}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Action</InputLabel>
                  <Select
                    label='Action'
                    name='action'
                    defaultValue='lastOpened'
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 270,
                        },
                      },
                    }}
                    onChange={handleSelectSort}
                  >
                    <MenuItem value='lastOpened'>Last Opened</MenuItem>
                    <MenuItem value='createAt'>Recently Created</MenuItem>
                    <MenuItem value='modifiedAt'>Recently Edited</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      {isLoading ? (
        <Loading />
      ) : files.length !== 0 || folders.length !== 0 ? (
        <div className='py-5 px-7'>
          <div className='grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4'>
            {folders?.length > 0 &&
              folders?.map((folder) => (
                <LargeCard
                  key={folder._id}
                  data={folder}
                  onClick={handleCardSelect}
                />
              ))}

            {files?.length > 0 &&
              files?.map((file) => (
                <LargeCard key={file._id} data={file} isFolder={false} />
              ))}
          </div>
        </div>
      ) : (
        <EmptyData message={'No folders or files were found'} />
      )}
    </div>
  );
}

export default SearchPage;
