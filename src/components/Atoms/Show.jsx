export const Show = ({ when, fallback = null, children }) => {
	return when ? children : fallback
}
