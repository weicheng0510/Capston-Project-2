const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`

const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', 'parts_search_product')

    const res = await fetch(url, {
        method: 'post',
        body: formData
    })

    return res.json()
}

export default uploadImage;