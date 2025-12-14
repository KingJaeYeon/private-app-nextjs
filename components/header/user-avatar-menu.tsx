import { useQuery } from '@tanstack/react-query';
import { clientAxios } from '@/lib/axios/client';
import { SuccessResponse } from '@/lib/axios/interface';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import * as React from 'react';
import {
  EarthIcon,
  EarthLock,
  LogOut,
  LucideIcon,
  ScrollText,
  SearchIcon,
  TagIcon,
  VideoIcon,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Google } from '@/assets/google';
import Logo from '@/public/logo.svg';
import Link from 'next/link';

interface IUser {
  id: number;
  email: string;
  emailVerified: boolean;
  username: string;
  bio: string;
  profileIcon: string;
  createdAt: string;
  oAuthType: string;
}
const navigates = [
  { label: '채널 찾기', href: '/search', icon: SearchIcon },
  { label: '영상 검색', href: '/me/search/video', icon: VideoIcon },
  { label: '내 구독', href: '/me/subscription', icon: ScrollText },
  { label: '내 레퍼런스', href: '/me/reference', icon: EarthIcon },
  { label: '내 태그', href: '/me/tag', icon: TagIcon },
];

export function UserAvatarMenu() {
  const { data } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } =
        await clientAxios.get<SuccessResponse<IUser>>('/users/me');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5분
    retry: false, // 401은 재시도 안 함
  });

  const { logout } = useAuth({});

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer outline-2 outline-blue-600 hover:outline-4">
              <AvatarImage
                src={
                  data?.profileIcon
                    ? data.profileIcon
                    : 'https://github.com/shadcn.png'
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>프로필</p>
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent className="w-56 p-2" align="end">
        <DropdownMenuLabel className={'flex items-stretch justify-between'}>
          <div>
            <p className={'h-[24px] text-lg font-semibold'}>{data?.username}</p>
            <p className={'text-muted-foreground'}>{data?.email}</p>
          </div>
          <div
            className={'bg-secondary mt-1 h-fit rounded-full p-1 dark:bg-white'}
          >
            <UserOAuthType oAuthType={data?.oAuthType} />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navigates.map((item, i) => (
            <LinkNav {...item} key={i} />
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout.mutate()}
          className={'items-center justify-between'}
        >
          Log out
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LinkNav(props: { label: string; icon: LucideIcon; href: string }) {
  return (
    <Link href={props.href} prefetch>
      <DropdownMenuItem className={'items-center justify-between'}>
        {props.label}
        {props.icon && <props.icon />}
      </DropdownMenuItem>
    </Link>
  );
}

function UserOAuthType({ oAuthType = 'LOCAL' }) {
  return oAuthType === 'GOOGLE' ? (
    <Google className={'h-[12px] w-[12px]'} />
  ) : (
    <Logo className={'h-[12px] w-[12px]'} />
  );
}
