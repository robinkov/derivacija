import DashboardIcon from '@/assets/svgs/DashboardIcon';
import { Navigation } from '@/hooks/navigation';
import PaymentsIcon from '../svgs/PaymentsIcon';

type NavAction = {
  text: string,
  icon: React.ReactNode,
  action?: () => void
}

export const ProfileNavActionData = (navigation: Navigation): NavAction[] => {
  return [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      action: () => { navigation('/dashboard'); }
    },
    {
      text: 'Payments',
      icon: <PaymentsIcon />,
      action: () => { navigation('/dashboard/payments'); }
    }
  ];
}
