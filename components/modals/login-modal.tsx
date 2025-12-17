import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import Logo from '@/public/logo.svg';
import { ILoginModal } from '@/components/modals/interface';
import React, { useState } from 'react';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { FloatingOutlinedInput } from '@/components/ui/floating-outlined-Input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { IconClose } from '@/assets/Icon-close';
import { googleSignInAction } from '@/services/auth.service';

export function LoginModal({ onClose }: ILoginModal) {
  const { signIn } = useAuth({
    onErrorMessage: (message) => setMessage(message),
  });
  const [identifier, setIdentifier] = useState('user');
  const [password, setPassword] = useState('1234');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate({ identifier, password });
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent className="bg-secondary max-w-[22rem] border-2 p-4">
        <AlertDialogTitle className={'flex justify-end'}>
          <button
            onClick={onClose}
            className={
              'hover:bg-secondary flex cursor-pointer items-center justify-end'
            }
          >
            <IconClose />
          </button>
        </AlertDialogTitle>
        <AlertDialogHeader>
          <div
            className={
              'flex items-center justify-center gap-2 py-2 leading-none font-semibold'
            }
          >
            <Logo className={'scale-75'} />
            <p className={'text-xl'}>Private app</p>
          </div>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FloatingOutlinedInput
                  id={'Identifier'}
                  label={'이메일 또는 사용자명'}
                  value={identifier}
                  onChangeValue={(value: string) => setIdentifier(value)}
                  required
                />
              </Field>
              <Field>
                <FloatingOutlinedInput
                  id={'password'}
                  type={'password'}
                  label={'비밀번호'}
                  value={password}
                  onChangeValue={(value: string) => setPassword(value)}
                  required
                />

                {message && (
                  <p className={'text-destructive mx-1 text-sm'}>{message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" isLoading={signIn.isPending}>
                  Login
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  isLoading={signIn.isPending}
                  onClick={googleSignInAction}
                >
                  Login with Google
                </Button>
                <FieldDescription className="flex justify-center gap-2 text-center">
                  <Link href="/signup" onClick={() => onClose()}>
                    회원가입
                  </Link>
                  <Link href="/signup" onClick={() => onClose()}>
                    비밀번호 찾기
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
