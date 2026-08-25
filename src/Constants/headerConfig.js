import {
	CalendarDays,
	CopyCheck,
	GraduationCap,
	ShieldAlert,
	Video,
} from 'lucide-react'

export const HEADER_CONFIG = [
	{
		teacher: [
			{
				title: 'Курсы',
				icon: GraduationCap,
				to: '/catalog/courses',
			},
			{
				title: 'Видео-конференции',
				icon: Video,
				to: '/catalog/webinars',
			},
			{
				title: 'Расписание',
				icon: CalendarDays,
				to: '/schedule',
			},
			{
				title: 'Задания',
				icon: CopyCheck,
				to: '/students',
				not_clickable: true,
			},
			// {
			// 	title: 'Журнал',
			// 	icon: CopyCheck,
			// 	to: '/score',
			// 	not_clickable: true,
			// },
		],
		student: [
			{
				title: 'Курсы',
				icon: GraduationCap,
				to: '/catalog/courses',
			},
			{
				title: 'Видео-конференции',
				icon: Video,
				to: '/catalog/webinars',
			},
			{
				title: 'Расписание',
				icon: CalendarDays,
				to: '/schedule',
			},

			{
				title: 'Оценки',
				icon: CopyCheck,
				to: '/score',
				not_clickable: true,
			},
		],
		moderator: [
			{
				title: 'Проверка курсов',
				icon: ShieldAlert,
				to: '/moderation-courses/',
			},
			// {
			// 	title: 'Пользователи',
			// 	icon: ShieldAlert,
			// 	to: '/moderation-users/',
			// },
		],
	},
]
