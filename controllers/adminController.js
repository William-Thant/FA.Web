function buildNavItems() {
  return [
    { label: 'Cars', href: '/cars' },
    { label: 'Loan', href: '#loan' },
    { label: 'Sell', href: '#sell' },
    { label: 'More', href: '#more' }
  ];
}

exports.showProfile = function(req, res) {
  // requireAdmin middleware already ensures req.user exists and is admin
  const admin = req.user || {};
  res.render('admin/profile', {
    title: 'Admin Profile',
    navItems: buildNavItems(),
    search: '',
    admin
  });
};
