import React from 'react';
import { CLASS, PUPIL, SPECIALIZATION } from 'constants/constants';
import {
  ClassSelect,
  MemberSelect,
  SpecializeSelect,
} from 'components/popups/Share';

export default function ShareRenderHelper({
  selection,
  specData,
  classData,
  pupilData,
  handleReturn,
  handleSpecSelect,
  handleClassSelect,
  handlePupilSelect,
  handleMutipleMemberSelect,
}) {
  switch (selection) {
    case SPECIALIZATION:
      return (
        <SpecializeSelect
          handleSelect={handleSpecSelect}
          handleReturn={handleReturn}
        />
      );

    case CLASS:
      return (
        <ClassSelect
          data={specData}
          handleSelect={handleClassSelect}
          handleReturn={handleReturn}
        />
      );

    case PUPIL:
      return (
        <MemberSelect
          data={classData}
          handleReturn={handleReturn}
          memberSelected={pupilData}
          handleSelect={handlePupilSelect}
          handleMutipleMemberSelect={handleMutipleMemberSelect}
        />
      );
    default:
      break;
  }
}
