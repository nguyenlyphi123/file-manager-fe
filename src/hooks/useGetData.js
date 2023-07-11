// import { useState, useEffect, useContext } from 'react';
// import { axiosPrivate } from '../utils/axios';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../contexts/authContext';

// export default function useGetData(url, location) {
//   // auth context
//   const { userLogout } = useContext(AuthContext);

//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   let refreshTokenRequest = null;

//   let isExpired = false;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const response = await axiosPrivate.get(url);

//         if (response.data.success) {
//           setData(response.data.data);
//           setLoading(false);
//         }
//       } catch (error) {
//         // if (error.response.status === 403) {
//         //   refreshTokenRequest = refreshTokenRequest
//         //     ? refreshTokenRequest
//         //     : refreshToken();
//         // }

//         // const isRefreshSuccess = await refreshTokenRequest;

//         // if (!isRefreshSuccess) {
//         //   return navigate('/login', { state: { from: from }, replace: true });
//         // }

//         // fetchData();

//         // refreshTokenRequest = null;
//         if (error?.response?.status === 403) {
//           userLogout();
//         }

//         isExpired = true;
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [isExpired === false]);

//   return { data, error, loading };
// }
