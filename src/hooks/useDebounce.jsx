import { useCallback, useRef } from 'react'
import { debounce } from '../utils/debounce'

export function useDebounce(callback, delay) {
	// useRef хранит функцию-дебаунс между рендерами
	const debouncedFunc = useRef(debounce(callback, delay))

	return debouncedFunc.current
}
