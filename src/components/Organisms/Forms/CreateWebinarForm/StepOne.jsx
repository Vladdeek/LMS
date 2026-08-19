import { HintTooltip } from '../../../Atoms/HintTooltip'
import { FileInput } from '../../../Molecules/InputFields/FileInput'
import { Input } from '../../../Molecules/InputFields/Input'
import { Text } from '../../../Atoms/Text'

export const StepOneGeneral = ({
	title,
	setTitle,
	url,
	setUrl,
	editMode,
	isFormValid,
	setImg,
	onNext,
}) => (
	<div className='sm:w-[482px] w-full inline-flex flex-col items-center gap-5'>
		<Input
			type='text'
			placeholder='Название видео-конференции'
			title={
				editMode
					? 'Название видео-конференции'
					: 'Введите название видео-конференции'
			}
			required
			value={title}
			onChange={e => setTitle(e.target.value)}
			disabled={editMode}
		/>
		<Input
			type='text'
			placeholder='https://example.ru/...'
			title={
				editMode
					? 'Редактирование ссылки видео-конференции'
					: 'Введите ссылку на видео-конференцию'
			}
			required
			value={url}
			onChange={e => setUrl(e.target.value)}
		/>
		{!editMode && (
			<div className='flex flex-col gap-3 w-full'>
				<div className='inline-flex items-center gap-[10px]'>
					<p className='text-[18px] text-[var(--middle)]'>Загрузите превью</p>
					<HintTooltip>
						<Text>
							При отсутствии загруженного изображения система автоматически
							сгенерирует превью.
						</Text>
					</HintTooltip>
				</div>
				<FileInput onFileChange={setImg} />
			</div>
		)}
		<input
			className={`px-[51px] py-[14.5px] font-medium text-xl rounded-lg w-fit transition ${
				isFormValid
					? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
					: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
			}`}
			type='button'
			value='Далее'
			disabled={!isFormValid}
			onClick={onNext}
		/>
	</div>
)
