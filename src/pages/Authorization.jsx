import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/Molecules/InputFields/Input'
import { Link } from '../components/Atoms/Link'
import { Login } from '../api/Authorization'
import { toast } from 'sonner'

const Authorization = ({ isRegister = false }) => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const emailValidate = value => /.+/.test(value)
	const passwordValidate = value =>
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)

	const validateAuthForm = formData => {
		return emailValidate(formData.email) && passwordValidate(formData.password)
	}

	const [showMessage, setShowMessage] = useState(null)

	const showMessageFunc = message => {
		setShowMessage(message)
		const timer = setTimeout(() => {
			setShowMessage(null)
		}, 5000)

		return () => clearTimeout(timer)
	}

	const handleSubmit = async e => {
		console.log('event')
		e.preventDefault()

		const data = { email: formData.email, password: formData.password }

		try {
			await Login(data)
			navigate('/')
		} catch (error) {}
	}

	return (
		<div className='relative'>
			<p
				className={`absolute transition-all bg-[var(--red-bg)] text-[var(--red-text)]  px-6 py-2 rounded-lg shadow-[var(--shadow)] left-1/2 -translate-x-1/2 ${
					showMessage ? 'top-5 opacity-100' : '-top-25 opacity-50'
				} `}
			>
				{showMessage}
			</p>
			<div className='mx-4 sm:mx-10 md:mx-20 lg:mx-40 h-screen flex justify-center items-center'>
				<div className='w-full xl:grid grid-cols-[1fr_auto_2fr] gap-3'>
					<div className='flex flex-col w-full xl:justify-between'>
						<p className='text-8xl max-2xl:text-7xl max-sm:text-5xl max-xs:text-4xl  mb-15 max-sm:mb-7.5 text-[var(--hero)] flex gap-3 font-bold w-full'>
							{import.meta.env.VITE_SERVICE_NAME}
						</p>
						<p className='font-base text-[var(--black)] text-[64px] max-2xl:text-6xl max-md:text-4xl max-sm:text-xl flex flex-col items-start w-full h-50 max-sm:h-25'>
							<span>Твои курсы</span>
							<span>под рукой</span>
						</p>
					</div>

					<div className='max-xl:hidden flex items-center'>
						<div className='border-[1px] border-[var(--hero)] h-full'></div>
					</div>

					<div className='xl:grid grid-cols-[1fr_7fr] gap-3'>
						<div></div>
						<div className=' flex flex-col '>
							<form
								onSubmit={handleSubmit}
								className='flex flex-col gap-10 xl:mt-20'
							>
								<Input
									title='Почта'
									name='email'
									placeholder='Введите почту...'
									value={formData.email}
									onChange={handleChange}
								/>

								<Input
									title='Пароль'
									name='password'
									type='password'
									placeholder='Введите пароль...'
									value={formData.password}
									onChange={handleChange}
								/>
								<Link
									to={'https://my.melsu.ru/request-access'}
									title={'Нет аккаунта? Запросить доступ'}
									textSize='lg'
								/>
								<input
									type='submit'
									disabled={!validateAuthForm}
									className={`${
										validateAuthForm
											? 'active:scale-99 active:brightness-90 hover:bg-[var(--hero)] hover:text-white  cursor-pointer'
											: 'opacity-25 cursor-not-allowed'
									} bg-[var(--black)] text-[var(--white)] rounded-xl h-full flex gap-4 items-center justify-center transition-all py-4`}
									value={'Войти'}
								/>
							</form>
							<div className='flex justify-between items-center mt-25'>
								<div className='flex gap-3'></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default Authorization
