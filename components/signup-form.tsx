'use client';

import React, { useState } from 'react';
import { FloatingOutlinedInput } from '@/components/ui/floating-outlined-Input';
import { Button } from '@/components/ui/button';
import { Google } from '@/assets/google';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Image from 'next/image';
import DarkLogo from '@/public/logo-dark.png';
import Logo from '@/public/logo.png';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { requestEmailVerification } from '@/services/auth.service';
import type { AxiosError } from 'axios';
import type { ServerErrorResponse } from '@/lib/axios/interface';

const signupSchema = z
  .object({
    email: z
      .email({ message: '이메일 형식이 올바르지 않습니다.' })
      .min(1, '이메일을 입력해주세요.'),
    password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다.'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onSubmit',
  });

  const [sent, setSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: requestEmailVerification,
    onSuccess: () => setSent(true),
    onError: (error: AxiosError<ServerErrorResponse>) => {
      const message = error.response?.data?.message;
      if (message) {
        form.setError('email', { type: 'value', message });
      }
    },
  });

  const onSubmit = (values: SignupFormValues) => {
    // passwordConfirm은 서버에 보낼 필요 없음
    mutate({
      email: values.email,
      password: values.password,
    });
  };

  if (sent) {
    return (
      <SuccessSendEmail
        email={form.getValues('email')}
        password={form.getValues('password')}
      />
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg p-8 shadow-lg">
      <div
        className={
          'mb-8 flex flex-col justify-center gap-5 py-2 leading-none font-semibold'
        }
      >
        <p className={'text-3xl'}>회원가입</p>
        <p className={''}>아래 내용을 입력해주세요</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingOutlinedInput
                    id="email"
                    label="이메일"
                    value={field.value}
                    onChangeValue={field.onChange}
                    isError={!!fieldState.error}
                    required
                    autoComplete="email"
                    inputMode="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingOutlinedInput
                    id="password"
                    label="비밀번호"
                    value={field.value}
                    onChangeValue={field.onChange}
                    isError={!!fieldState.error}
                    required
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* passwordConfirm */}
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingOutlinedInput
                    id="password_confirmation"
                    label="비밀번호 확인"
                    value={field.value}
                    onChangeValue={field.onChange}
                    isError={!!fieldState.error}
                    required
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            isLoading={isPending}
            className="w-full rounded-lg bg-blue-600 py-4 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            가입하기
          </Button>
        </form>
      </Form>

      <div className="auth-divider mt-6 mb-2 flex items-center gap-4">
        <div className="border-muted-foreground flex-1 border-t" />
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          간편 회원가입
        </span>
        <div className="border-muted-foreground flex-1 border-t" />
      </div>
      <div className={'flex justify-center'}>
        <div
          onClick={() =>
            (window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`)
          }
          className={
            'bg-secondary mt-1 h-fit w-fit cursor-pointer rounded-full p-1 dark:bg-white'
          }
        >
          <Google />
        </div>
      </div>
    </div>
  );
}

function SuccessSendEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { theme } = useTheme();

  const { mutate, isPending } = useMutation({
    mutationFn: requestEmailVerification,
    onSuccess: () => toast('인증 메일이 재발송되었습니다'),
    onError: (error: AxiosError<ServerErrorResponse>) => {
      const message =
        error.response?.data?.message ?? '재발송 중 오류가 발생했습니다.';
      toast.error(message);
    },
  });
  return (
    <div className="w-full max-w-md rounded-lg p-8 shadow-lg">
      <div className="text-center">
        <div className={'mb-4 flex justify-center'}>
          <Image
            src={theme === 'dark' ? DarkLogo : Logo}
            alt={'logo'}
            height={200}
          />
        </div>
        <p className="text-muted-foreground mb-6">
          <strong>{email}</strong>로<br />
          인증 메일을 발송했습니다.
        </p>
        <p className="text-muted-foreground mb-4 text-sm">
          메일함을 확인하고 인증 링크를 클릭해주세요.
        </p>

        <button
          onClick={() => mutate({ email, password })}
          disabled={isPending}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-60"
        >
          메일을 받지 못하셨나요? 재발송
        </button>
      </div>
    </div>
  );
}
