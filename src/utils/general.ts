function capitalizeFirstLetter(str: string) {
  if (!str) return ""; // kiểm tra chuỗi rỗng
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export { capitalizeFirstLetter };