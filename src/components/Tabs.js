import { Box, Tabs as MuiTabs, Tab } from '@mui/material';
import { useState } from 'react';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div className='h-full' hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
};

function Tabs({ menu }) {
  const [tab, setTab] = useState(() => menu[0].value);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, display: 'flex', height: '100%', bgcolor: 'white' }}
    >
      <MuiTabs
        value={tab}
        onChange={handleChange}
        orientation='vertical'
        sx={{ borderRight: 1, borderColor: 'divider', width: '20%' }}
      >
        {menu.map((item, index) => (
          <Tab
            key={index}
            label={item.label}
            value={item.value}
            sx={{
              textTransform: 'none',
              '&:hover': {
                color: '#b0b8ff',
                opacity: 1,
              },
              '&.Mui-selected': {
                color: '#2F40DD',
              },
            }}
          />
        ))}
      </MuiTabs>
      <div className='py-2 px-3 w-full h-full'>
        {menu.map((item, index) => (
          <TabPanel key={index} value={tab} index={item.value}>
            {item.component}
          </TabPanel>
        ))}
      </div>
    </Box>
  );
}

export default Tabs;
