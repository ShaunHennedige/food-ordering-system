import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <p>© {currentYear} Citrus PMS - Food Ordering System. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
