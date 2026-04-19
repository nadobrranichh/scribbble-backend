function randomLetters(length: number) {
  return Array.from({ length }, () =>
    String.fromCharCode(65 + Math.random() * 26),
  ).join("");
}
function randomNumbers(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

export function generateRoomId() {
  return `${randomLetters(4)}-${randomNumbers(4)}-${randomLetters(4)}`;
}
