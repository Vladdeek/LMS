import { useEffect, useState } from 'react'

export const useInput = ({ value, validate, onChange, onStatusChange }) => {
	const [internalValue, setInternalValue] = useState(value || '')
	const [status, setStatus] = useState(false)

	useEffect(() => {
		setInternalValue(value || '')
	}, [value])

	const handleChange = e => {
		const val = e.target.value
		setInternalValue(val)

		onChange?.(e)

		const newStatus = validate ? validate(val) : val.trim() !== ''
		setStatus(newStatus)
		onStatusChange?.(newStatus)
	}

	return {
		value: internalValue,
		status,
		handleChange,
		setInternalValue,
		setStatus,
	}
}
