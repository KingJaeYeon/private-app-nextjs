import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import React from 'react';
import Image from 'next/image';
import { IViewModal } from '@/components/modals/interface';

export function ViewModal({ onClose, data }: IViewModal) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-secondary max-w-[25rem] border-2 p-4">
        <DialogHeader>
          <DialogTitle>{data.title}</DialogTitle>
          <DialogDescription>
            <Image
              src={data.link}
              alt={'image'}
              width={500}
              height={700}
              priority
            />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
