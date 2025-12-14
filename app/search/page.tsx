import { Input } from '@/components/ui/input';

export default function SearchPage() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Input placeholder={'URL 또는 키워드 입력'} />
      </div>
    </div>
  );
}
