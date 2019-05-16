export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        redirect: '/exception/404',
      },
    ],
  },
  {
    path: '/exception/403',
    name: 'not-permission',
    component: './Exception/403',
  },
  {
    path: '/exception/404',
    name: 'not-find',
    component: './Exception/404',
  },
  {
    path: '/exception/500',
    name: 'server-error',
    component: './Exception/500',
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/dashboard/analysis',
        authority: ['root', 'manager', 'user', 'verifyer', 'leader'],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/dashboard',
            redirect: '/dashboard/analysis',
          },
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
        ],
      },
      {
        path: '/banks',
        name: 'banks',
        icon: 'bank',
        hideChildrenInMenu: true,
        authority: ['root', 'leader'],
        routes: [
          {
            path: '/banks',
            redirect: '/banks/list',
          },
          {
            path: '/banks/list',
            name: 'bankList',
            component: './Banks/Banks',
          },
          {
            path: '/banks/:bankId',
            name: 'bank',
            component: './Banks/Bank',
          },
        ],
      },
      {
        path: '/users',
        name: 'users',
        hideInMenu: true,
        routes: [
          {
            path: '/users/list',
            name: 'userList',
            component: './Banks/Users',
          },
        ],
      },
      {
        path: '/customers',
        name: 'customers',
        icon: 'user',
        hideChildrenInMenu: true,
        authority: ['root', 'manager',  'leader'],
        routes: [
          {
            path: '/customers',
            redirect: '/customers/list?tabKey=person',
          },
          {
            path: '/customers/list',
            name: 'customerList',
            component: './Customers/Customers',
          },
          {
            path: '/customers/new',
            name: 'newCustomer',
            component: './Customers/CustomerForm',
          },
          {
            path: '/customers/:customerId',
            name: 'customerForm',
            component: './Customers/CustomerForm',
          },
        ],
      },
      {
        path: '/sales',
        name: 'sales',
        icon: 'deployment-unit',
        hideChildrenInMenu: true,
        routes: [
          {
            path: '/sales',
            redirect: '/sales/list',
          },
          {
            path: '/sales/list',
            name: 'salesList',
            component: './Sales/Sales',
          },
          {
            path: '/sales/:activityId/statistic',
            name: 'statistic',
            component: './Sales/Statistic',
          },
          {
            path: '/sales/step-form',
            name: 'stepform',
            component: './Sales/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/sales/step-form',
                redirect: '/sales/step-form/info',
              },
              {
                path: '/sales/step-form/model',
                name: 'model',
                component: './Sales/StepForm/Step1',
              },
              {
                path: '/sales/step-form/group',
                name: 'group',
                component: './Sales/StepForm/Step2',
              },
              {
                path: '/sales/step-form/target',
                name: 'target',
                component: './Sales/StepForm/Step3',
              },
              {
                path: '/sales/step-form/verify',
                name: 'verify',
                component: './Sales/StepForm/Step4',
              },
              {
                path: '/sales/step-form/result',
                name: 'result',
                component: './Sales/StepForm/Step5',
              },
            ],
          },
          {
            path: '/sales/:saleActivityId',
            name: 'saleDetail',
            component: './Sales/SaleForm',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
            ],
          },
        ],
      },
      {
        redirect: '/exception/404',
      },
    ],
  },
];
