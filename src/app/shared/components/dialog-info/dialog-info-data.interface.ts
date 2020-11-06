import { DialogInfoTitleEnum } from './dialog-info-title.enum';
import { ErrorTypeEnum } from './../../constants/error-type.enum';

export interface IDialogInfoData {
  errorType: ErrorTypeEnum;
  title: DialogInfoTitleEnum;
  html: any;
}
