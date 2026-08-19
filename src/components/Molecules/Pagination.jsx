import { useEffect, useState } from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

export const BasicPagination = ({
	count,
	onPageChange,
	page,
	siblingCount,
}) => {
	return (
		<div className='flex justify-center w-full'>
			<Stack spacing={1}>
				<Pagination
					count={count}
					page={page}
					onChange={(e, value) => onPageChange?.(value)}
					shape='rounded'
					size='medium'
					siblingCount={siblingCount}
					sx={{
						'& .MuiPaginationItem-root': {
							color: 'var(--black)',
						},
						'& .MuiPaginationItem-root.Mui-selected': {
							backgroundColor: 'var(--hero)',
							color: '#ffffff',
						},
						'& .MuiPaginationItem-root:hover': {
							backgroundColor: 'var(--hero-pale)',
							border: '2px solid var(--hero)',
							color: 'var(--hero)',
						},
					}}
					disabled={count <= 1}
				/>
			</Stack>
		</div>
	)
}
