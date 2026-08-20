import { ButtonCase } from '../../Atoms/Buttons/ButtonCase'
import Modal from '../../Atoms/Modal'
import { Show } from '../../Atoms/Show'
import { Text } from '../../Atoms/Text'

const CONFIRM_STYLES = {
	default: {
		bg: 'var(--black)',
		text: 'var(--white)',
		hover: 'hover:bg-[var(--hero)] hover:text-white',
	},
	danger: {
		bg: 'var(--red-base)',
		text: 'var(--white)',
		hover: 'hover:bg-[var(--red-hover)]',
	},
	warning: {
		bg: 'var(--yellow-base)',
		text: 'var(--white)',
		hover: 'hover:bg-[var(--yellow-hover)]',
	},
	peaceful: {
		bg: 'var(--green-base)',
		text: 'var(--white)',
		hover: 'hover:bg-[var(--green-hover)]',
	},
}

export const ConfirmModal = ({
	title,
	text,
	action,
	confirmLabel,
	confirmStyle,
	isOpen,
	onClose,
}) => {
	return (
		<Modal width={'w-100'} isOpen={isOpen}>
			<Show when={isOpen}>
				<div className='flex flex-col items-center gap-4'>
					{/* 1. Заголовок и Предупреждение */}
					<div className='flex flex-col items-center'>
						<Text
							size={'xl'}
							font={'semibold'}
							style={'primary'}
							className={'mb-2 text-center'}
						>
							{title}
						</Text>
						<Text className={'text-center'} style={'secondary'}>
							{text}
						</Text>
					</div>

					{/* 2. Кнопки */}
					<div className='flex justify-end gap-3 mt-4'>
						{/* Кнопка отмены всегда одинаковая */}
						<ButtonCase
							backgroundColor={'transparent'}
							textColor={'var(--middle)'}
							hoverStyles={'hover:bg-[var(--light-middle)]'}
							onClick={() => onClose?.(null)}
						>
							Отмена
						</ButtonCase>

						{/* Кнопка подтверждения берет данные из конфига */}
						<ButtonCase
							backgroundColor={CONFIRM_STYLES[confirmStyle].bg}
							textColor={CONFIRM_STYLES[confirmStyle].text}
							hoverStyles={CONFIRM_STYLES[confirmStyle].hover}
							onClick={() => {
								action
								onClose?.(null)
							}}
						>
							{confirmLabel}
						</ButtonCase>
					</div>
				</div>
			</Show>
		</Modal>
	)
}
