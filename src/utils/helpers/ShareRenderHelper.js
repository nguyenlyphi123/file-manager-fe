import {
  ClassSelect,
  MemberSelect,
  SpecializeSelect,
} from 'components/popups/Share';
import { CLASS, MEMBER, SPECIALIZATION } from 'constants/constants';

export default function ShareRenderHelper({
  selection,
  specData,
  classData,
  memberData,
  type,
  handleReturn,
  handleSpecSelect,
  handleClassSelect,
  handleMemberSelect,
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
          memberSelected={memberData}
          handleSelect={handleClassSelect}
          handleReturn={handleReturn}
          handleMemberSelect={handleMemberSelect}
          handleMutipleMemberSelect={handleMutipleMemberSelect}
          type={type}
        />
      );

    case MEMBER:
      return (
        <MemberSelect
          data={classData}
          handleReturn={handleReturn}
          memberSelected={memberData}
          handleSelect={handleMemberSelect}
          handleMutipleMemberSelect={handleMutipleMemberSelect}
          type={type}
        />
      );
    default:
      break;
  }
}
