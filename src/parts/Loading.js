import 'stylesheet/Loading.css';

export default function Loading() {
  return (
    <div className='w-full h-full flex justify-center items-center absolute top-0 left-0'>
      <div className='spinner'></div>
    </div>
  );
}
