const { useNavigate, createSearchParams } = require('react-router-dom');

const useNavigateParams = () => {
  const navigate = useNavigate();

  return (pathname, params) => {
    const path = {
      pathname,
      search: createSearchParams(params).toString(),
    };
    navigate(path);
  };
};

export default useNavigateParams;
