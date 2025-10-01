export function copyToClipboard(data: string | undefined) {
  try {
    if (!data) throw new Error('Erro ao copiar link!')
    if (typeof navigator.clipboard === 'undefined') {
      const textArea = document.createElement('textarea')
      textArea.value = data
      textArea.style.position = 'fixed'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    navigator.clipboard.writeText(data)
  } catch (err) {
    console.error(err)
  }
}
