
export default [
  {
    path: '/',
    children: [
      { path: '', redirect: {name: 'dashboard'} }
    ]
  },

  {
    path: '/auth',
    component: () => import('layouts/public'),
    redirect: {name: 'login'},
    children: [
      { path: 'login', name: 'login', component: () => import('pages/auth/Login'), meta: {auth: false} },
      { path: 'register-auto', name: 'register-auto', component: () => import('pages/auth/Login'), meta: {auth: false} },
      { path: 'reset-password', name: 'reset-password', component: () => import('pages/auth/ResetPassword'), meta: {auth: false} },
      { path: 'register-success', name: 'register-success', component: () => import('pages/auth/RegisterSuccess'), meta: {auth: true} }
    ]
  },

  {
    path: '/dashboard',
    component: () => import('layouts/private'),
    redirect: {name: 'dashboard'},
    children: [
      { path: 'overview', name: 'dashboard', component: () => import('pages/dashboard/Main'), meta: {auth: true, name: 'dashboard', backButton: false, sectionName: 'dashboard'} }
    ]
  },

  {
    path: '/craft',
    component: () => import('layouts/private'),
    redirect: {name: 'craft'},
    children: [
      { path: 'overview', name: 'sweep-overview', component: () => import('pages/craft/CraftSweepOverview'), meta: {auth: true, name: 'craft', backButton: true, sectionName: 'sweep-overview'} },
      { path: 'detail', name: 'sweep-detail', component: () => import('pages/craft/CraftSweepDetail'), meta: {auth: true, name: 'documents_detail', backButton: true, sectionName: 'sweep-overview'} }
    ]
  },

  {
    path: '/upgrade',
    component: () => import('layouts/publicClear'),
    redirect: {name: 'upgrade'},
    children: [
      { path: 'index', name: 'upgrade', component: () => import('pages/upgrade/Index'), meta: {auth: false} }
    ]
  },

  {
    path: '/unsubscribe',
    component: () => import('layouts/publicUnsubscribe'),
    redirect: {name: 'unsubscribe'},
    children: [
      { path: 'index', name: 'unsubscribe', component: () => import('pages/unsubscribe/Index'), meta: {auth: false} }
    ]
  },

  {
    path: '/meter',
    component: () => import('layouts/private'),
    redirect: {name: 'meter-list'},
    children: [
      { path: 'detail', name: 'meter-detail', component: () => import('pages/meter/Overview'), meta: {auth: true, name: 'detail_meters', backButton: true, sectionName: 'energy-overview'} },
      { path: 'edit', name: 'meter-edit', component: () => import('pages/meter/MeterEdit'), meta: {auth: true, name: 'edit_meters', backButton: false, sectionName: 'energy-overview'} },
      { path: 'add', name: 'meter-add', component: () => import('pages/meter/MeterEdit'), meta: {auth: true, name: 'add_meters', backButton: false, sectionName: 'energy-overview'} }
    ]
  },
  {
    path: '/energy',
    component: () => import('layouts/private'),
    redirect: {name: 'energy-overview'},
    children: [
      { path: 'overview', name: 'energy-overview', component: () => import('pages/energy/EnergyOverview'), meta: {auth: true, name: 'meters', backButton: true, sectionName: 'energy-overview'} }
    ]
  },
  {
    path: '/reading',
    component: () => import('layouts/private'),
    redirect: {name: 'reading-list'},
    children: [
      { path: 'list', name: 'reading-list', component: () => import('pages/reading/Readings'), meta: {auth: true, name: 'reading', backButton: true, sectionName: 'energy-overview'} }
    ]
  },

  {
    path: '/message',
    component: () => import('layouts/private'),
    redirect: {name: 'message-list'},
    children: [
      { path: 'list', name: 'message-list', component: () => import('pages/message/Messages'), meta: {auth: true, name: 'message', backButton: true, sectionName: 'message-list'} }
    ]
  },

  {
    path: '/document',
    component: () => import('layouts/private'),
    redirect: {name: 'section-list'},
    children: [
      { path: 'documents', name: 'document-list', component: () => import('pages/document/Documents'), meta: {auth: true, name: 'documents', backButton: true, sectionName: 'documents-grid'} },
      { path: 'documents-grid', name: 'documents-grid', component: () => import('pages/document/DocumentsGrid'), meta: {auth: true, name: 'documents', backButton: true, sectionName: 'documents-grid'} },
      { path: 'documents-section-grid', name: 'documents-section-grid', component: () => import('pages/document/DocumentsSectionGrid'), meta: {auth: true, name: 'documents', backButton: true, sectionName: 'documents-section-grid'} },
      { path: 'documents-favourite', name: 'documents-list-favourite', component: () => import('pages/document/FavouriteDocuments'), meta: {auth: true, name: 'favourite_documents', backButton: true, sectionName: 'documents-grid'} },
      { path: 'documents-insurance', name: 'documents-list-insurance', component: () => import('pages/document/SpaceInsuranceDocuments'), meta: {auth: true, name: 'insurance', backButton: true, sectionName: 'documents-section-grid'} },
      { path: 'sections', name: 'section-list', component: () => import('pages/document/Overview'), meta: {auth: true, name: 'documents', backButton: true, sectionName: 'documents-grid'} },
      { path: 'edit', name: 'document-edit', component: () => import('pages/document/DocumentEdit'), meta: {auth: true, name: 'documents_edit', backButton: false, sectionName: 'documents-grid'} },
      { path: 'add', name: 'document-add', component: () => import('pages/document/DocumentEdit'), meta: {auth: true, name: 'documents_add', backButton: false, sectionName: 'documents-grid'} },
      { path: 'detail', name: 'document-detail', component: () => import('pages/document/DocumentDetail'), meta: {auth: true, name: 'documents_detail', backButton: true, sectionName: 'documents-grid'} },
      { path: 'insurance-detail', name: 'space-insurance-detail', component: () => import('pages/document/SpaceInsuranceDetail'), meta: {auth: true, name: 'documents_detail', backButton: true, sectionName: 'documents-grid'} },
      { path: 'finance-detail', name: 'document-finance-detail', component: () => import('pages/document/DocumentFinanceDetail'), meta: {auth: true, name: 'documents_detail', backButton: true, sectionName: 'documents-grid'} }
    ]
  },

  {
    path: '/settings',
    component: () => import('layouts/private'),
    redirect: {name: 'settings-detail'},
    children: [
      { path: 'detail', name: 'settings-detail', component: () => import('pages/settings/Detail'), meta: {auth: true, name: 'settings', backButton: true} }
    ]
  },

  {
    path: '/profile',
    component: () => import('layouts/private'),
    redirect: {name: 'profile-detail'},
    children: [
      { path: 'detail', name: 'profile-detail', component: () => import('pages/profile/Main'), meta: {auth: true, name: 'myprofile', backButton: true} },
      { path: 'edit', name: 'profile-edit', component: () => import('pages/profile/ProfileEdit'), meta: {auth: true, name: 'profile_edit', backButton: false} },
      { path: 'password_change', name: 'profile-passwd-change', component: () => import('pages/profile/ProfilePasswordChange'), meta: {auth: true, name: 'profile_passwd_change', backButton: false} }
    ]
  },
  {
    path: '/info',
    component: () => import('layouts/private'),
    redirect: {name: 'info-app'},
    children: [
      { path: 'info_app', name: 'info-app', component: () => import('pages/info/App'), meta: {auth: true, name: 'info_app', backButton: true} }
    ]
  },
  {
    path: '/consumption',
    component: () => import('layouts/private'),
    redirect: {name: 'consumption-overview'},
    children: [
      { path: 'overview', name: 'consumption-overview', component: () => import('pages/consumption/Overview'), meta: {auth: true, name: 'consumption', backButton: true, sectionName: 'energy-overview'} }
    ]
  },
  {
    path: '/tipper',
    component: () => import('layouts/private'),
    redirect: {name: 'tipper-new'},
    children: [
      { path: 'new', name: 'tipper-new', component: () => import('pages/tipper/New'), meta: {auth: true, name: 'tipper', backButton: true, sectionName: 'tipper-new'} }
    ]
  },
  {
    path: '/maps',
    component: () => import('layouts/private'),
    redirect: {name: 'preview'},
    children: [
      // {path: 'preview', name: 'preview', component: () => import('pages/maps/Preview'), meta: {auth: true, name: 'maps_menu', backButton: true}},
      { path: 'tree', name: 'tree', component: () => import('pages/maps/Tree'), meta: {auth: true, name: 'tree_menu', backButton: true} }
    ]
  },
  {
    path: '/tariff',
    component: () => import('layouts/private'),
    redirect: {name: 'tariff-versions'},
    children: [
      { path: 'versions', name: 'tariff-versions', component: () => import('pages/tariff/TariffVersions'), meta: {auth: true, name: 'tariff_versions', backButton: true, sectionName: 'energy-overview'} }
    ]
  },
  {
    path: '/wizard',
    component: () => import('layouts/wizard'),
    redirect: {name: 'wizard-introduction'},
    children: [
      { path: 'introduction', name: 'wizard-introduction', component: () => import('pages/wizard/Introduction'), meta: {auth: true, backButton: false} },
      { path: 'energy_imported', name: 'wizard-energy-imported', component: () => import('pages/wizard/EnergyImported'), meta: {auth: true, backButton: false} },
      { path: 'energy', name: 'wizard-energy', component: () => import('pages/wizard/Energy'), meta: {auth: true, backButton: false} },
      { path: 'finance', name: 'wizard-finance', component: () => import('pages/wizard/Finance'), meta: {auth: true, backButton: false} },
      { path: 'trees', name: 'wizard-trees', component: () => import('pages/wizard/Trees'), meta: {auth: true, backButton: false} },
      { path: 'documents', name: 'wizard-documents', component: () => import('pages/wizard/Documents'), meta: {auth: true, backButton: false} },
      { path: 'document_add', name: 'wizard-document-add', component: () => import('pages/wizard/DocumentAdd'), meta: {auth: true, backButton: false} }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/private'),
    redirect: {name: 'tariff-versions'},
    children: [
      { path: 'cookies', name: 'cookies', component: () => import('pages/Cookies'), meta: {auth: true, name: 'universal', backButton: true} }
    ]
  },
  {
    path: '*',
    component: () => import('layouts/private'),
    redirect: {name: '404'},
    children: [
      { path: '404', name: '404', component: () => import('pages/404'), meta: {auth: true, name: 'universal', backButton: false} }
    ]
  }
]
