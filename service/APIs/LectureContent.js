import api, { API } from '../../src/API'

export const ReadLectureContent = async id => {
	const response = await api.get(`${API}/lecture-content/${id}`)
	return response.data
}

export const GetPresignedUrlToUploadMedia = async (id, fileMetadata) => {
	const response = await api.post(
		`${API}/lecture-content/upload-url/${id}`,
		fileMetadata,
	)
	return response.data
}

export const AppendLectureContent = async (id, type) => {
	const response = await api.post(`${API}/lecture-content/append/${id}`, {
		data: { type },
	})
	return response.data
}
export const UpdateLectureContent = async (
	lecture_content_id,
	block_content_id,
	body,
	type,
) => {
	const isText = type === 'text'
	const isSpecialBlock = ['callout', 'formula', 'code'].includes(type)

	const response = await api.put(
		`${API}/lecture-content/${lecture_content_id}/block-content/${block_content_id}`,
		{
			data: isText
				? { type, ...body }
				: isSpecialBlock
					? { type, content: { ...body } }
					: { type, file_metadata_id: body }, // Оставили data, убрали type и деструктуризацию body
		},
	)
	return response.data
}
export const DeleteBlock = async (lecture_content_id, block_content_id) => {
	const response = await api.delete(
		`${API}/lecture-content/${lecture_content_id}/block/${block_content_id}`,
	)
	return response.data
}
export const DeleteFile = async (block_content_id, file_id) => {
	const response = await api.delete(
		`${API}/lecture-content/files-block/${block_content_id}/file/${file_id}`,
	)
	return response.data
}
