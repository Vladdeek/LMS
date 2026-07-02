import { useState } from 'react'
import { InputDefault } from '../components/Inputs'
import { useEffect } from 'react'
import { Login, Registration } from '../../service/APIs/Authorization'
import { useLocation, useNavigate } from 'react-router-dom'
import { executeWithAuthCheck } from '../../service/utils/apiHelper'

const AuthToggle = ({ select, setSelect }) => {
	return (
		<div className='bg-[var(--white)] relative shadow-inner w-2/3 h-12 rounded-xl border border-[#25252507] overflow-hidden'>
			{/* Переключатель (фон) */}
			<div
				className={`absolute top-[2px] left-[2px] w-[calc(50%-4px)] h-[calc(100%-4px)] bg-[var(--black)] rounded-[10px] transition-transform duration-300`}
				style={{
					transform: `translateX(${select === 1 ? '100%' : '0%'})`,
				}}
			/>

			{/* Текст */}
			<div className='relative flex h-full w-full items-center z-10'>
				<p
					onClick={() => setSelect?.(0)}
					className={`w-1/2 text-center cursor-pointer font-medium transition-colors duration-300 ${
						select === 0 ? 'text-[var(--white)]' : 'text-[var(--black)]'
					}`}
				>
					Авторизация
				</p>
				<p
					onClick={() => setSelect?.(1)}
					className={`w-1/2 text-center cursor-pointer font-medium transition-colors duration-300 ${
						select === 1 ? 'text-[var(--white)]' : 'text-[var(--black)]'
					}`}
				>
					Регистрация
				</p>
			</div>
		</div>
	)
}

const Authorization = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const [selected, setSelected] = useState(0)

	const [formData, setFormData] = useState({
		username: null,
		password: '',
		repeat_password: '',
		first_name: '',
		last_name: '',
		patronymic: '',
		email: '',
	})
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const validateAuthForm = formData => {
		return (
			formData.email.trim().length > 5 && formData.password.trim().length >= 6
		)
	}
	const validateRegForm = formData => {
		return (
			formData.email.trim().length > 5 &&
			formData.first_name.trim().length > 1 &&
			formData.last_name.trim().length > 1 &&
			formData.password.trim().length >= 6 &&
			formData.repeat_password.trim().length >= 6
		)
	}

	const isAuthFormValid = validateAuthForm(formData)
	const isRegFormValid = validateRegForm(formData)

	console.log(
		'isRegFormValid: ',
		isRegFormValid,
		'\nisAuthFormValid: ',
		isAuthFormValid,
		'\nformData: ',
		formData,
	)

	const handleSubmitRegistration = async e => {
		e.preventDefault()

		try {
			await executeWithAuthCheck(() =>
				Registration(
					formData.email,
					formData.password,
					formData.repeat_password,
					formData.username,
					formData.first_name,
					formData.last_name,
					formData.patronymic,
				),
			)

			navigate('/')
		} catch (err) {
			console.log('REG ERROR:', err)
			// Здесь можно вывести ошибку пользователю в UI
		}
	}

	const handleSubmitLogin = async e => {
		e.preventDefault()

		try {
			await executeWithAuthCheck(() => Login(formData.email, formData.password))

			navigate('/')
		} catch (err) {
			console.log('LOGIN ERROR:', err)
			// Здесь можно вывести ошибку пользователю в UI
		}
	}

	return (
		<div className='w-screen h-screen flex items-center justify-center'>
			<div className='bg-[var(--white)] h-[80vh] w-2/3 rounded-4xl p-1 shadow-[var(--shadow)] overflow-hidden'>
				<div
					className='flex w-[200%] h-full transition-transform duration-500'
					style={{
						transform: `translateX(${selected === 0 ? '0%' : '-50%'})`,
					}}
				>
					<div className='w-1/2 h-full p-1 max-xl:hidden'>
						<div className='bg-[var(--black)] relative flex flex-col h-full w-full rounded-3xl shadow-[var(--shadow)] overflow-hidden '>
							<p className='text-white text-3xl font-semibold absolute top-10 left-10 leading-tight'>
								С возвращением
								<br />в систему
							</p>

							<p className='text-white text-sm opacity-70 absolute bottom-10 left-10 max-w-[60%] leading-relaxed'>
								Продолжай обучение, следи за курсами и прокачивай навыки.
							</p>

							<p className='text-white text-xs opacity-40 absolute top-10 right-10'>
								MelGU
							</p>

							<img
								lassName='text-white text-[150px] font-bold opacity-5 absolute -bottom-20 right-0 select-none'
								src='Splines1.svg'
								alt=''
							/>
						</div>
					</div>

					<div className='w-1/2 h-full flex flex-col items-center gap-5 py-10'>
						<AuthToggle select={selected} setSelect={setSelected} />
						<form
							className='flex flex-col gap-3 items-center w-full h-full p-10 overflow-visible'
							onSubmit={handleSubmitLogin}
						>
							<div className='h-2/3 w-full flex flex-col justify-center gap-5'>
								<InputDefault
									title='Почта'
									name='email'
									placeholder='Введите почту...'
									value={formData.email}
									onChange={handleChange}
								/>

								<InputDefault
									title='Пароль'
									name='password'
									type='password'
									placeholder='Введите пароль...'
									value={formData.password}
									onChange={handleChange}
								/>
							</div>

							<input
								className={`w-full py-3 font-medium text-lg rounded-2xl mt-10 transition ${
									isAuthFormValid
										? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
										: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
								}`}
								type='submit'
								value='Войти'
								disabled={!isAuthFormValid}
							/>
						</form>
					</div>
					<div className='w-1/2 h-full flex flex-col gap-4 items-center py-10'>
						<AuthToggle select={selected} setSelect={setSelected} />
						<form
							className='flex flex-col gap-3 items-center w-full h-full p-10 overflow-visible'
							onSubmit={handleSubmitRegistration}
						>
							<div className='h-full w-full flex flex-col justify-center gap-3 overflow-y-scroll'>
								<InputDefault
									title='Почта'
									name='email'
									placeholder='Введите почту...'
									value={formData.email}
									onChange={handleChange}
								/>

								<div className='grid grid-cols-3 max-lg:grid-cols-1 gap-3'>
									<InputDefault
										title='Фамилия'
										name='first_name'
										placeholder=''
										value={formData.first_name}
										onChange={handleChange}
									/>
									<InputDefault
										title='Имя'
										name='last_name'
										placeholder=''
										value={formData.last_name}
										onChange={handleChange}
									/>
									<InputDefault
										title='Отчество'
										name='patronymic'
										placeholder=''
										value={formData.patronymic}
										onChange={handleChange}
									/>
								</div>

								<InputDefault
									title='Пароль'
									name='password'
									type='password'
									placeholder='Введите пароль...'
									value={formData.password}
									onChange={handleChange}
								/>

								<InputDefault
									title='Пароль'
									name='repeat_password'
									type='password'
									placeholder='Повторите пароль...'
									value={formData.repeat_password}
									onChange={handleChange}
								/>
							</div>

							<input
								className={`w-full py-3 font-medium text-lg rounded-2xl mt-10 transition ${
									isRegFormValid
										? 'bg-[var(--black)] text-[var(--white)] cursor-pointer'
										: 'bg-[var(--light-middle)] text-[var(--middle)] cursor-not-allowed'
								}`}
								type='submit'
								value='Зарегистрироваться'
								disabled={!isRegFormValid}
							/>
						</form>
					</div>
					<div className='w-1/2 h-full p-1 max-xl:hidden'>
						<div className='bg-[var(--black)] relative flex flex-col h-full w-full rounded-3xl shadow-[var(--shadow)] overflow-hidden'>
							<p className='text-white text-3xl font-semibold absolute top-10 left-10 leading-tight'>
								Начни обучение
								<br />
								уже сейчас
							</p>

							<p className='text-white text-sm opacity-70 absolute bottom-10 left-10 max-w-[60%] leading-relaxed'>
								Создай аккаунт в сервисе Доп Проф Образования и открой для себя
								новые возможности.
							</p>

							<p className='text-white text-xs opacity-40 absolute top-10 right-10'>
								MelGU
							</p>

							<img
								lassName='text-white text-[120px] font-bold opacity-5 absolute bottom-[-20px] right-5 select-none'
								src='Splines2.svg'
								alt=''
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Authorization
