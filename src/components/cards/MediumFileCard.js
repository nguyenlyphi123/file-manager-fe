import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { BsDot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { starFolder } from '../../services/folderController';
import FileIconHelper from '../../utils/helpers/FileIconHelper';
import OptionHelper from '../../utils/helpers/OptionHelper';
import { ThreeDotsDropDown } from '../popups/ModelPopups';
import ErrorToast from '../toasts/SuccessToast';

export default function MediumFileCard({ data, onClick, refetch }) {
  const navigate = useNavigate();

  // handle show threedots dropdown
  const [isModal, setIsModal] = useState(false);

  // handle select option
  const [option, setOption] = useState('');

  const handleSelectOption = (option) => {
    setOption(option);
    setIsModal(true);
  };

  const handleClose = () => {
    setOption('');
    setIsModal(false);
  };

  // delete confirm
  const [isDeleteShow, setIsDeleteShow] = useState(false);

  const handleCancelDelete = () => {
    setIsDeleteShow(false);
  };

  const handleShowDelete = () => {
    setIsDeleteShow(true);
  };

  // star folder
  const handleStarFolder = useMutation({
    mutationFn: (folderId) => starFolder({ id: folderId }),
    onSuccess: () => {
      ErrorToast({ message: 'Folder has been starred successfully' });
      refetch();
    },
    onError: (error) => {
      ErrorToast({
        message: 'Opps! Something went wrong. Please try again later',
      });
    },
  });

  return (
    <>
      <OptionHelper
        type={option}
        handleClose={handleClose}
        data={data}
        open={isModal}
        refetch={refetch}
        deleteShow={isDeleteShow}
        handleCancelDelete={handleCancelDelete}
      />
      <div className='flex-col relative bg-white border rounded-md p-4 cursor-pointer group/card'>
        <div className='absolute top-2 right-2 p-2 flex justify-center items-center group/threedots'>
          <ThreeDotsDropDown
            handleSelectOption={handleSelectOption}
            handleShowDelete={handleShowDelete}
            className='rounded-[50%] h-[18px] text-gray-600'
          />
        </div>

        <div
          onClick={() => {
            onClick({ ...data, href: `/folders/${data._id}` });
            navigate(`/folders/${data._id}`, { state: { folder: data } });
          }}
          className='h-full w-full'
        >
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <FileIconHelper
                className='text-3xl mr-3'
                type={data.type ? data.type : null}
              />

              <div className='relative'>
                <p className='text-[0.9em] text-gray-600 font-semibold'>
                  {data.name}
                </p>

                {data.isStar ? (
                  <AiFillStar className='text-[#8AA3FF] text-xl font-semibold absolute top-0 right-0 translate-x-[35px]' />
                ) : (
                  <AiFillStar
                    className='text-gray-400 text-xl font-semibold absolute top-0 right-0 translate-x-[35px] hidden group-hover/card:block hover/card:text-[#8AA3FF] duration-200'
                    onClick={() => handleStarFolder.mutate(data._id)}
                  />
                )}
              </div>
            </div>

            <div className='mt-2'>
              <p className='flex items-center text-[0.8em] text-gray-400'>
                Today <BsDot className='text-xl' /> 4.5 MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
