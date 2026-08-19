import { TEXT_SIZES } from '../../../Constants/TextSizes'
import { RequiredBadge } from './RequiredBage'

export const InputLabel = ({
	title,
	required,
	status,
	description,
	textSize,
}) => {
	if (!title && !description) return null

	return (
		<div className='flex flex-col gap-1 ml-1'>
			{title && (
				<div className='flex items-center gap-2'>
					<p
						className={`${TEXT_SIZES.size[textSize]} text-[var(--middle)] pt-[2px]`}
					>
						{title}
					</p>
					{required && <RequiredBadge active={status} />}
				</div>
			)}
			{description && (
				<p className='text-sm text-[var(--middle)] pt-[2px]'>{description}</p>
			)}
		</div>
	)
}
