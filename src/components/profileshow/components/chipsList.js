import React from 'react';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';

const findEquivalence = number => {
  let label;

  switch (number) {
    case 1:
      label = 'Woman';
      break;
    case 2:
      label = 'Man';
      break;
    case 3:
      label = 'Cis Woman';
      break;
    case 4:
      label = 'Cis Man';
      break;
    case 5:
      label = 'Trans Woman';
      break;
    case 6:
      label = 'Trans Man';
      break;
    case 7:
      label = 'Non-binary';
      break;
    default:
  }
  return label;
};

const ChipsList = ({ classes, list, type }) => {
  if (list) {
    if (type === 'gender' || type === 'preference') {
      return (
        <Box className={classes.genderChips}>
          {list.map(item => (
            <Chip key={item} label={findEquivalence(item)} />
          ))}
        </Box>
      );
    }
    return (
      <Box className={classes.genderChips}>
        {list.map(item => (
          <Chip key={item} label={item} />
        ))}
      </Box>
    );
  }
};

export default ChipsList;
