export const getCroppedImg = (imageSrc, pixelCrop, fileName, rotation = 0) => {
  const image = new Image()
  image.src = imageSrc
  
  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      const maxSize = Math.max(image.width, image.height)
      const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

      canvas.width = safeArea
      canvas.height = safeArea

      // Translate canvas context to a central location to allow rotating around the center of the canvas
      ctx.translate(safeArea / 2, safeArea / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-safeArea / 2, -safeArea / 2)

      ctx.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
      )
      const data = ctx.getImageData(0, 0, safeArea, safeArea)

      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      ctx.putImageData(
        data,
        0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
        0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
      )

      // As Base64 string
      return canvas.toDataURL('image/jpeg')
    }
  })
}

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export const getRadianAngle = (degreeValue) => (degreeValue * Math.PI) / 180
