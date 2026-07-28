import { CalendarDays, HeartHandshake, Images, Map, MapPin, UsersRound, WalletCards } from 'lucide-react';
import type { ComponentType } from 'react';

type QuickMenuProps = {
  showAccount: boolean;
};

type MenuItem = {
  label: string;
  href: string;
  icon: ComponentType<{ 'aria-hidden'?: boolean }>;
};

export default function QuickMenu({ showAccount }: QuickMenuProps) {
  const menuItems: MenuItem[] = [
    { label: '예식일', href: '#schedule', icon: CalendarDays },
    { label: '오시는 길', href: '#location', icon: MapPin },
    { label: '두 사람', href: '#about-us', icon: UsersRound },
    { label: '이야기', href: '#our-story', icon: HeartHandshake },
    { label: '갤러리', href: '#gallery', icon: Images },
    { label: '포항', href: '#pohang-guide', icon: Map },
    ...(showAccount ? [{ label: '마음 전하기', href: '#account', icon: WalletCards }] : [])
  ];

  return (
    <nav className="quick-menu" aria-label="빠른 이동 메뉴">
      <div className="quick-menu-grid" style={{ '--menu-count': menuItems.length } as React.CSSProperties}>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <a key={item.label} href={item.href} className="quick-menu-btn">
              <Icon aria-hidden />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
