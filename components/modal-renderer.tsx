'use client';
import { useModalStore } from '@/store/modal-store';
import { ViewModal } from '@/components/modals/view-modal';
import { LightboxModal } from '@/components/modals/lightbox-modal';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  IAlertModal,
  ILightboxModal,
  IViewModal,
  ModalType,
} from '@/components/modals/interface';
import { LoginModal } from '@/components/modals/login-modal';

export default function ModalRenderer() {
  const { type, isOpen, closeModal, data } = useModalStore();

  if (!isOpen || !type) {
    return null;
  }

  const modals: Record<ModalType, any> = {
    view: <ViewModal onClose={closeModal} data={data as IViewModal['data']} />,
    lightbox: (
      <LightboxModal
        onClose={closeModal}
        data={data as ILightboxModal['data']}
      />
    ),
    alert: (
      <AlertModal onClose={closeModal} data={data as IAlertModal['data']} />
    ),
    login: <LoginModal onClose={closeModal} />,
  };

  return modals ? modals[type] : null;
}

// export function SomeComponent() {
//   const { openModal } = useModalStore();
//
//   return (
//     <div className="space-y-4">
//       {/* 로그인 모달 */}
//       <button onClick={() => openModal('login')}>로그인</button>
//
//       {/* 회원가입 모달 */}
//       <button onClick={() => openModal('signup')}>회원가입</button>
//
//       {/* 확인 모달 */}
//       <button
//         onClick={() =>
//           openModal('confirm', {
//             title: '삭제 확인',
//             message: '정말 삭제하시겠습니까?',
//             cancelText: '취소',
//             confirmText: '삭제',
//             onConfirm: () => {
//               console.log('삭제됨');
//               // 삭제 API 호출
//             },
//           })
//         }
//       >
//         삭제
//       </button>
//
//       {/* 알림 모달 */}
//       <button onClick={() => openModal('alert', 'YouTube API Key 필요')}>알림</button>
//
//       <button onClick={() => toast.error('YouTube API Key 필요')}>toast</button>
//       <button onClick={() => alert('YouTube API 키를')}>toast</button>
//     </div>
//   );
// }
