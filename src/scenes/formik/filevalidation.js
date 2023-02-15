export function checkIfFilesAreTooBig(files?: [File]): boolean {
    let valid = true
    if (files) {
      files.map(file => {
        const size = file.size / 1024 / 1024
        if (size > 10) {
          valid = false
        }
      })
    }
    return valid
  }
  
  export function checkIfFilesAreCorrectType(files?: [File]): boolean {
    let valid = true
    if (files) {
      files.map(file => {
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
          valid = false
        }
      })
    }
    return valid
  }