import { Grid } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import RequireModal from 'components/popups/Require';
import { REQ_STATUS_DONE } from 'constants/constants';
import Loading from 'parts/Loading';
import { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';
import { setCurrentFolder } from 'redux/slices/curentFolder';
import { getRequire, updateStatus } from 'services/requireController';
import Details from './Details';
import Done from './Done';
import InProgress from './InProgress';
import Todo from './Todo';

function Require() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedRequire, setSelectedRequire] = useState(null);
  // const [requireWaiting, setRequireWaiting] = useState([]);
  // const [requireInProgress, setRequireInProgress] = useState([]);
  // const [requireDone, setRequireDone] = useState([]);

  const [requireData, setRequireData] = useState({
    waiting: [],
    processing: [],
    done: [],
  });

  const handleOpenRequire = () => setOpen(true);
  const handleCloseRequire = () => setOpen(false);

  const handleOpenDetail = () => setOpenDetail(true);
  const handleCloseDetail = () => setOpenDetail(false);

  const handleRequireClick = (require) => {
    setSelectedRequire(require);
    handleOpenDetail();
    dispatch(setCurrentFolder(require.folder));
  };

  const handleUpdateStatus = useMutation({
    mutationFn: (data) => updateStatus(data),
  });

  const handleDrop = (result) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (
      source.droppableId === REQ_STATUS_DONE &&
      destination.droppableId !== REQ_STATUS_DONE
    )
      return;

    if (destination.droppableId === source.droppableId) {
      const reorderedData = [...requireData[source.droppableId]];
      const removedData = reorderedData.splice(source.index, 1)[0];
      reorderedData.splice(destination.index, 0, removedData);

      setRequireData((prev) => ({
        ...prev,
        [destination.droppableId]: reorderedData,
      }));

      handleUpdateStatus.mutate({
        source,
        destination,
        requireId: draggableId,
      });
      return;
    }

    if (type === 'group') {
      const sourceData = [...requireData[source.droppableId]];
      const destinationData = [...requireData[destination.droppableId]];

      const newSourceData = [
        ...requireData[source.droppableId].filter(
          (item) => item._id !== draggableId,
        ),
      ];

      const removedSource = sourceData.splice(source.index, 1)[0];
      destinationData.splice(destination.index, 0, removedSource);

      setRequireData((prev) => ({
        ...prev,
        [source.droppableId]: newSourceData,
        [destination.droppableId]: destinationData,
      }));

      handleUpdateStatus.mutate({
        source,
        destination,
        requireId: draggableId,
      });
    }
  };

  const { isLoading, isFetching } = useQuery({
    queryKey: ['requires'],
    queryFn: async () => {
      const res = await getRequire();

      const { data } = res;

      console.log(data);

      setRequireData((prev) => ({
        ...prev,
        waiting: data.waiting,
        processing: data.processing,
        done: data.done,
      }));
      return res;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {open && <RequireModal open={open} handleClose={handleCloseRequire} />}
      <Details
        open={openDetail}
        handleClose={handleCloseDetail}
        data={selectedRequire}
      />

      <div className='h-[200vh] py-5 px-7 tracking-wide'>
        <div
          className='text-[20px] text-gray-600 font-bold'
          onClick={handleOpenRequire}
        >
          Require
        </div>

        <div className='mt-5'>
          <Grid container spacing={2}>
            <DragDropContext onDragEnd={handleDrop}>
              <Grid item xs={12} sm={6} md={4}>
                <Todo
                  data={requireData.waiting}
                  handleClick={handleRequireClick}
                  isFetching={isFetching}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <InProgress
                  data={requireData.processing}
                  handleClick={handleRequireClick}
                  isFetching={isFetching}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Done
                  data={requireData.done}
                  handleClick={handleRequireClick}
                  isFetching={isFetching}
                />
              </Grid>
            </DragDropContext>
          </Grid>
        </div>
      </div>
    </>
  );
}

export default Require;
