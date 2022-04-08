import { Subject } from 'rxjs';
export interface IConfirmationModal {
  destroy$?: Subject<boolean>;
  open?: boolean;
  title?: string;
  text?: string;
  cancel?: boolean;
}