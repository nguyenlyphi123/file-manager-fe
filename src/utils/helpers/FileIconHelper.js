import React from 'react';

import * as file from 'constants/file';
import {
  BsFileZip,
  BsFiletypeDoc,
  BsFiletypeExe,
  BsFiletypeJpg,
  BsFiletypeMp3,
  BsFiletypeMp4,
  BsFiletypePng,
  BsFiletypePpt,
  BsFiletypeSvg,
  BsFiletypeTxt,
  BsFiletypeXlsx,
  BsFiletypePdf,
  BsFiletypeDocx,
} from 'react-icons/bs';
import { FaFolder } from 'react-icons/fa';

const fileColors = {
  doc: '#599DEF',
  docx: '#599DEF',
  zip: '#7E95C4',
  exe: '#C7E9B0',
  jpg: '#C7E9B0',
  png: '#C7E9B0',
  mp3: '#FD8A8A',
  mp4: '#F74141',
  ppt: '#F25168',
  pdf: '#F25168',
  svg: '#86C8BC',
  txt: '#7E95C4',
  xlsx: '#36C684',
  folder: '#8AA3FF',
};

export default function FileIconHelper({ type, className }) {
  switch (type) {
    case file.DOC:
      return <BsFiletypeDoc color={fileColors.doc} className={className} />;

    case file.DOCX:
      return <BsFiletypeDocx color={fileColors.docx} className={className} />;

    case file.ZIP:
      return <BsFileZip color={fileColors.zip} className={className} />;

    case file.EXE:
      return <BsFiletypeExe color={fileColors.exe} className={className} />;

    case file.JPG:
      return <BsFiletypeJpg color={fileColors.jpg} className={className} />;

    case file.PNG:
      return <BsFiletypePng color={fileColors.png} className={className} />;

    case file.MP3:
      return <BsFiletypeMp3 color={fileColors.mp3} className={className} />;

    case file.MP4:
      return <BsFiletypeMp4 color={fileColors.mp4} className={className} />;

    case file.PPT:
      return <BsFiletypePpt color={fileColors.ppt} className={className} />;

    case file.PDF:
      return <BsFiletypePdf color={fileColors.pdf} className={className} />;

    case file.SVG:
      return <BsFiletypeSvg color={fileColors.svg} className={className} />;

    case file.TXT:
      return <BsFiletypeTxt color={fileColors.txt} className={className} />;

    case file.XLSX:
      return <BsFiletypeXlsx color={fileColors.xlsx} className={className} />;

    default:
      return <FaFolder color={fileColors.folder} className={className} />;
  }
}
