import { InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const getConfigurationByType = (type: string) => {
  switch (type) {
    case 'danger':
    case 'alert':
      return {
        icon: ExclamationTriangleIcon,
        title: type === 'danger' ? 'Danger' : 'Alert',
        containerClass: 'bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-500',
        iconClass: 'text-red-500 dark:text-red-400',
        titleClass: 'text-red-600 dark:text-red-400',
        bodyClass: 'text-red-700 dark:text-gray-200',
      };
    case 'warning':
      return {
        icon: ExclamationTriangleIcon,
        title: 'Warning',
        containerClass: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500 dark:border-yellow-500',
        iconClass: 'text-yellow-500 dark:text-yellow-400',
        titleClass: 'text-yellow-600 dark:text-yellow-400',
        bodyClass: 'text-yellow-700 dark:text-gray-200',
      };
    default:
      return {
        icon: InformationCircleIcon,
        title: 'Info',
        containerClass: 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 dark:border-indigo-500',
        iconClass: 'text-indigo-500 dark:text-indigo-400',
        titleClass: 'text-indigo-600 dark:text-indigo-400',
        bodyClass: 'text-indigo-700 dark:text-gray-200',
      };
  }
};

interface AdmonitionProps {
  children: React.ReactNode;
  type?: string;
  className?: string;
  title?: string;
}

export default function Admonition({ children, type = 'info', className = '', title }: AdmonitionProps) {
  const config = getConfigurationByType(type);
  const Icon = config.icon;

  return (
    <div className={`${config.containerClass} border-l-4 p-4 my-4 ${className} rounded-md not-prose`}>
      <div className="flex flex-col">
        <div className="flex items-center justify-start">
          <Icon className={`h-6 w-6 ${config.iconClass} stroke-2`} aria-hidden="true" />
          <h3 className={`ml-2 ${config.titleClass} font-bold text-md`}>{title || config.title}</h3>
        </div>
        <div className={`mt-2 ${config.bodyClass} text-md`}>{children}</div>
      </div>
    </div>
  );
}
