export interface IModalKey {
  view: IViewModal;
  lightbox: ILightboxModal;
  alert: IAlertModal;
}

interface IModalBase {
  onClose: () => void;
}

export interface IViewModal extends IModalBase {
  data: {
    link: string;
    title: string;
  };
}

export interface ILightboxModal extends IModalBase {
  data: { imgUrl: string };
}

export interface IAlertModal extends IModalBase {
  data?: string;
}

export type ModalType = keyof IModalKey;
export type ModalData = {
  [K in ModalType]: IModalKey[K]['data'];
}[ModalType];
