const dateToString = (date) => {
  let dateToString
  try {
    const newDate = new Date(date)
    dateToString = `${(newDate.getDate() < 10 ? '0' : '') + newDate.getDate()}/` +
    `${(newDate.getMonth() + 1)}/` +
    `${newDate.getFullYear()} ` +
    `${(newDate.getHours() < 10 ? '0' : '') + newDate.getHours()}:` +
    `${(newDate.getMinutes() < 10 ? '0' : '') + newDate.getMinutes()}:` +
    `${(newDate.getSeconds() < 10 ? '0' : '') + newDate.getSeconds()}`
  } catch {
    return dateToString
  }
  return dateToString
}

export default dateToString