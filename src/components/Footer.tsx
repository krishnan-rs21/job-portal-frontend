import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="p-4 bg-gray-200 text-center">
      <p>{t('footer.copyright')}</p>
    </footer>
  );
};

export default Footer;
