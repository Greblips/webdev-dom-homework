// export function formatDate(date) {
//   return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()}/${date.getFullYear()} ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;
// }



// // функция для даты
// export function getDate(date) {
//   const options = {
//       year: '2-digit',
//       month: 'numeric',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//   }
//   const newDate = new Date(date);
//   return newDate.toLocaleString('ru-RU', options).replace(',', '');
// }


// Функция обезопасить ввод данных
export function safeInputText(str) {
    return str.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}


// Функция для имитации запросов в API

export function delay(interval = 300) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, interval);
    });
  }
  


  