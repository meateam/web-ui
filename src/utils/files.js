export function checkConflict(files, items) {
    if (typeof items === 'undefined' || items === null) {
        items = []
      }

      let conflict = false
      for (let i = 0; i < files.length; i++) {
        let res = items.findIndex(function hasConflict (element) {
          return (element.name === this)
        }, files[i].name)

        if (res >= 0) {
          conflict = true
          break
        }
      }

      return conflict;
}
