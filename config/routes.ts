export default [

	// ================= USER =================
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	// ================= DEFAULT MENU =================
	{
		path: '/dashboard',
		name: 'Dashboard',
		icon: 'HomeOutlined',
		component: './TrangChu',
	},

	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	{
		path: '/random-user',
		name: 'RandomUser',
		icon: 'ArrowsAltOutlined',
		component: './RandomUser',
	},

	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// ================= THUC HANH 01 =================
	{
		name: 'TH01',
		path: '/th01',
		icon: 'CodeOutlined',
		routes: [
			{
				name: 'Bài 1 - Game đoán số',
				path: 'bai-1',
				component: './TH01/Bai1',
			},
			{
				name: 'Bài 2 - Quản lý học tập',
				path: 'bai-2',
				component: './TH01/Bai2',
			},
		],
	},

	// ================= THUC HANH 02 =================
	{
		name: 'TH02',
		path: '/th02',
		icon: 'BookOutlined',
		routes: [
			{
				name: 'Bài 1',
				path: 'bai-1',
				component: './TH02/Bai1',
			},
			{
				name: 'Bài 2',
				path: 'bai-2',
				component: './TH02/Bai2',
			},
		],
	},

	// ================= NOTIFICATION =================
	{
		path: '/notification',
		layout: false,
		hideInMenu: true,
		routes: [
			{
				path: '/notification/subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: '/notification/check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: '/notification',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
	},

	// ================= EXCEPTION =================
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];