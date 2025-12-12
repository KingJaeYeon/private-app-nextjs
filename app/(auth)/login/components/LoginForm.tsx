'use client';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn.mutate({ identifier, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="이메일 또는 사용자명"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      <button type="submit" disabled={signIn.isPending}>
        {signIn.isPending ? '로그인 중...' : '로그인'}
      </button>
      {signIn.isError && <p>로그인 실패: {signIn.error.message}</p>}
    </form>
  );
}
