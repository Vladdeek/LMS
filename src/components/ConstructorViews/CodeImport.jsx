import { useState, useEffect } from 'react'
import { X, Copy, Trash } from 'lucide-react'
import { CodeBlock, github, a11yDark } from 'react-code-blocks'
import { FileUploaderZone, RemoveButton } from './FileUploaderZone'
import { languageMap } from '../../../service/data/lanaguagesMap'

export const CodeUploader = ({
	isEdit = true,
	value = null, // { code: string, language: string }
	onChange,
	onDelete,
	isUploading = false,
	uploadProgress = 0,
	data,
}) => {
	const [codeData, setCodeData] = useState(data)
	const [copied, setCopied] = useState(false)

	//Создаем стейт под тему, чтобы триггерить ререндер
	const [theme, setTheme] = useState(
		() => document.documentElement.getAttribute('data-theme') || 'light',
	)

	const themes = { light: github, dark: a11yDark }

	//Следим за изменением атрибута на теге <html>
	useEffect(() => {
		const targetNode = document.documentElement

		// Функция, которая сработает при мутации
		const observerCallback = mutationsList => {
			for (const mutation of mutationsList) {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'data-theme'
				) {
					const currentTheme = targetNode.getAttribute('data-theme') || 'light'
					setTheme(currentTheme)
				}
			}
		}

		const observer = new MutationObserver(observerCallback)

		// Настраиваем обсервер конкретно на атрибуты html
		observer.observe(targetNode, {
			attributes: true,
			attributeFilter: ['data-theme'],
		})

		// Не забываем отписаться при размонтировании компонента, чтобы не плодить утечки памяти
		return () => observer.disconnect()
	}, [])

	const getLanguage = filename => {
		const ext = filename.split('.').pop().toLowerCase()
		return languageMap[ext] || ext
	}

	const handleCopy = async () => {
		if (!codeData?.code) return

		if (navigator.clipboard && navigator.clipboard.writeText) {
			try {
				await navigator.clipboard.writeText(codeData.code)
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
				return
			} catch (err) {
				console.error('Не удалось скопировать через Clipboard API: ', err)
			}
		}

		try {
			const textArea = document.createElement('textarea')
			textArea.value = codeData.code
			textArea.style.position = 'fixed'
			textArea.style.left = '-999999px'
			textArea.style.top = '-999999px'
			document.body.appendChild(textArea)

			textArea.focus()
			textArea.select()

			const successful = document.execCommand('copy')
			if (successful) {
				setCopied(true)
				setTimeout(() => setCopied(false), 2000)
			} else {
			}

			document.body.removeChild(textArea)
		} catch (err) {}
	}

	const handleFilesSelected = files => {
		if (!files || files.length === 0) return

		const file = files[0]
		const reader = new FileReader()
		reader.onload = e => {
			const result = {
				code: e.target.result,
				language: getLanguage(file.name),
				fileName: file.name,
			}
			setCodeData(result)
			onChange?.(result)
		}
		reader.readAsText(file)
	}

	if (!isEdit && !codeData) return null

	return (
		<div className='flex gap-4 w-full my-4'>
			{isEdit && <RemoveButton onDelete={onDelete} />}

			<div className='flex-1'>
				{codeData ? (
					<div className='relative bg-[var(--white)] rounded-xl shadow-[var(--shadow)] overflow-hidden border border-[var(--light-middle)]'>
						<div className='flex justify-between items-center bg-[var(--white)] pr-2 pl-3 py-2 border-b border-[var(--light-middle)]'>
							<div className='flex items-center gap-3'>
								<div className='flex gap-1.5'>
									<div className='h-2.5 w-2.5 rounded-full bg-red-400' />
									<div className='h-2.5 w-2.5 rounded-full bg-yellow-400' />
									<div className='h-2.5 w-2.5 rounded-full bg-green-400' />
								</div>
								<span className='text-[var(--middle)] text-xs uppercase font-bold tracking-wider'>
									{codeData.language}
								</span>
							</div>

							<div className='flex gap-2'>
								<button
									onClick={handleCopy}
									className={`flex items-center gap-2 px-3 py-1.5 ${copied ? 'bg-[var(--green-base)] text-[var(--green-text)]' : 'bg-[var(--light-gray)] text-[var(--middle)]'}  rounded-md text-sm hover:brightness-95 transition-all`}
								>
									<Copy size={14} />{' '}
									<span>{copied ? 'Скопировано' : 'Скопировать'}</span>
								</button>

								{isEdit && (
									<button
										onClick={() => {
											setCodeData(null)
											onChange?.(null)
										}}
										className='flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-500 rounded-md text-sm hover:bg-red-500 hover:text-white transition-all'
									>
										<Trash size={14} />
									</button>
								)}
							</div>
						</div>

						<div className='p-0 overflow-x-auto max-h-[34rem] text-sm'>
							<CodeBlock
								text={codeData.code}
								language={codeData.language}
								showLineNumbers={true}
								// ТУТ ИСПРАВЛЕНО: Передаем актуальную тему из стейта
								theme={themes[theme] || themes.light}
								customStyle={{ background: 'transparent', padding: '1rem' }}
							/>
						</div>
					</div>
				) : (
					isEdit && (
						<FileUploaderZone
							type='code'
							onFilesSelected={handleFilesSelected}
							isUploading={isUploading}
							uploadProgress={uploadProgress}
						/>
					)
				)}
			</div>
		</div>
	)
}
