import { Button, Chip, FormGroup } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import {
  getInformation,
  updateInformation,
} from 'services/informationController';

import { renderPermission } from 'utils/helpers/Helper';

import { TextInput } from 'components/CustomInput';
import EditableAvatar from 'components/EditableAvatar';
import ImageCropper from 'components/ImageCropper';
import { useCallback, useState } from 'react';
import {
  convertBlobUrlToFile,
  getCroppedImg,
  readFile,
} from 'utils/image-crop';
import { MdEdit, MdSave } from 'react-icons/md';
import { uploadImage } from 'services/gcController';
import ErrorToast from 'components/toasts/ErrorToast';
import SuccessToast from 'components/toasts/SuccessToast';
import { useDispatch } from 'react-redux';
import { loadUser } from 'redux/slices/user';

const InfoField = ({ label, children, labelPos }) => {
  return (
    <div className={`flex items-${labelPos ?? 'center'} my-3`}>
      <label className='text-[13px] text-black text-opacity-80 font-sans h-fit mr-4'>
        {label}:
      </label>
      {children}
    </div>
  );
};

function AccountSetting() {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { id } = useSelector((state) => state.user);

  const [name, setName] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['information'],
    queryFn: async () => {
      const res = await getInformation(id);

      if (res.success) {
        setName(res.data.name);
      }

      return res;
    },
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 3000,
  });

  // crop image
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);

      setImageSrc({
        src: imageDataUrl,
        data: file,
      });
    }
  };

  const handleCropImage = async () => {
    const croppedImageUrl = await getCroppedImg(
      imageSrc?.src,
      croppedAreaPixels,
    );

    setCroppedImage(croppedImageUrl);
  };

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleUploadImage = useCallback(async () => {
    try {
      const croppedImageData = await convertBlobUrlToFile(
        croppedImage,
        imageSrc?.data?.name,
      );

      const formData = new FormData();
      formData.append('image', croppedImageData);

      const { data } = await uploadImage(formData);

      return data?.url;
    } catch (error) {
      console.log(error);
      ErrorToast({ message: 'Upload image failed' });
    }
  }, [croppedImage, imageSrc?.data?.name]);

  const handleSave = useMutation({
    mutationFn: async () => {
      let imageUrl = user?.data?.image;

      if (croppedImage) {
        imageUrl = await handleUploadImage();
      }

      const body = {
        ...user?.data,
        name: name || user?.data?.name,
        image: imageUrl,
      };

      return await updateInformation(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['information']);
      dispatch(loadUser());

      SuccessToast({ message: 'Update image successfully' });

      setCroppedImage(null);
      setCroppedAreaPixels(null);
      setImageSrc(null);
    },
    onError: (error) => {
      console.log(error);
      ErrorToast({ message: 'Upload image failed' });
    },
  });

  const handleTextImageClick = useCallback(async () => {
    if (!croppedImage) {
      return document.getElementById('avatar-button').click();
    }

    return handleSave.mutate();
  }, [croppedImage, handleSave]);

  return (
    <div className='flex h-full'>
      <div className='flex-[2_2_0%] px-5 py-3 h-full'>
        <div className='flex flex-col justify-between h-full'>
          <FormGroup>
            <TextInput
              label='Name'
              placeholder='Vui lòng nhập tên'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              label='Email'
              placeholder='Vui lòng nhập email'
              value={user?.data?.email || ''}
              readOnly
            />
            <InfoField label='Role'>
              <div className='text-black text-opacity-80'>
                <Chip
                  label={
                    renderPermission[user?.data?.account_id?.permission]?.label
                  }
                  color={
                    renderPermission[user?.data?.account_id?.permission]?.color
                  }
                />
              </div>
            </InfoField>
            {user?.data?.major && (
              <InfoField label='Major'>
                <div className='text-black text-opacity-80'>
                  <Chip
                    label={user?.data?.major?.name}
                    color={
                      renderPermission[user?.data?.account_id?.permission]
                        ?.color
                    }
                  />
                </div>
              </InfoField>
            )}
            {user?.data?.specialization?.length > 0 && (
              <InfoField label='Specialization' labelPos='start'>
                <div className='text-black text-opacity-80 flex gap-1'>
                  {user?.data?.specialization?.map((item) => (
                    <Chip
                      key={item._id}
                      label={item.name}
                      color={
                        renderPermission[user?.data?.account_id?.permission]
                          ?.color
                      }
                    />
                  ))}
                </div>
              </InfoField>
            )}
            {user?.data?.class?.length > 0 && (
              <InfoField label='Class'>
                <div className='text-black text-opacity-80'>
                  {user?.data?.class?.map((item) => (
                    <Chip
                      key={item._id}
                      label={item.name}
                      color={
                        renderPermission[user?.data?.account_id?.permission]
                          ?.color
                      }
                    />
                  ))}
                </div>
              </InfoField>
            )}
          </FormGroup>
          <Button
            variant='contained'
            color='error'
            size='small'
            sx={{ textTransform: 'none', width: 'fit-content' }}
            endIcon={<MdSave size={20} />}
            onClick={() => handleSave.mutate()}
          >
            Save
          </Button>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex flex-col items-center h-full mt-5'>
          <ImageCropper
            imageSrc={imageSrc?.src}
            croppedImage={croppedImage}
            handleChangeImage={handleImageChange}
            handleCropImage={handleCropImage}
            handleCropComplete={handleCropComplete}
          >
            <EditableAvatar
              image={croppedImage ? croppedImage : user?.data?.image}
              width={150}
              height={150}
            />
          </ImageCropper>
          <span
            className='flex justify-center items-center text-[13px] text-gray-500 italic mt-1 cursor-pointer'
            onClick={handleTextImageClick}
          >
            Click to change avatar
            <MdEdit className='ml-1' />
          </span>
        </div>
      </div>
    </div>
  );
}

export default AccountSetting;
