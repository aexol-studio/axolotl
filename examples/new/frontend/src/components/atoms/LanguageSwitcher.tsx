import { Globe } from 'lucide-react';
import { useDynamite } from '@aexol/dynamite';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';

type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
];

const LOCALE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds

export const LanguageSwitcher = () => {
  const { locale, t } = useDynamite();

  const handleLanguageChange = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('Switch language')}>
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
            className={cn(locale === option.code && 'bg-accent text-accent-foreground')}
          >
            <span className="mr-2">{option.flag}</span>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
