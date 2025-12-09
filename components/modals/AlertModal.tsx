import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import DarkLogo from '@/public/logo-dark.png';
import Logo from '@/public/logo.png';

interface AlertModalProps {
  onClose: () => void;
  data?: string;
}

export default function AlertModal({ onClose, data }: AlertModalProps) {
  const { theme } = useTheme();
  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="bg-secondary max-w-[18rem] border-2 p-4">
        <AlertDialogHeader>
          <AlertDialogTitle className={'flex justify-center'}>
            <Image
              src={theme === 'dark' ? DarkLogo : Logo}
              className={'w-[100px]'}
              alt={'logo'}
              preload
            />
          </AlertDialogTitle>
          <AlertDialogDescription
            className={
              'text-0.5xs text-foreground mt-3 px-1.5 text-center font-semibold'
            }
          >
            {data}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <button className={'btn-submit w-full text-sm'} onClick={onClose}>
          OK
        </button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
