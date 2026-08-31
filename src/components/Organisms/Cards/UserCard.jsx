import { ImageOff } from 'lucide-react'
import { Text } from '../../Atoms/Text'
import { MEDIA_API_URL } from '../../../API'

export const UserCard = ({ FullName, avatar_url, email, role, onClick }) => {
	const roles = {
		student: 'Cтудент',
		teacher: 'Преподаватель',
		moderator: 'Модератор',
	}

	return (
		<>
			<div
				onClick={onClick}
				className='w-full h-fit flex gap-3 bg-[var(--white)] rounded-2xl shadow-[var(--shadow)] p-2'
			>
				{avatar_url ? (
					<img
						className='rounded-xl w-12.5 h-12.5'
						src={MEDIA_API_URL + avatar_url}
						alt=''
					/>
				) : (
					<ImageOff className='h-12 rounded-xl object-cover aspect-square w-auto p-3 text-[var(--middle)] bg-[var(--light-middle)]' />
				)}

				<div className='flex flex-col w-full'>
					<div className='flex flex-wrap w-full items-center justify-between'>
						<Text size={'lg'} style={'primary'}>
							{FullName?.last_name} {FullName?.first_name}{' '}
							{FullName?.patronymic}
						</Text>
						<p className='text-sm bg-[var(--hero-pale)] text-[var(--hero)] px-2 rounded-full'>
							{role && <p>{roles[role]}</p>}
						</p>
					</div>
					<Text size={'sm'} style={'secondary'}>
						{email}
					</Text>
				</div>
			</div>
		</>
	)
}
