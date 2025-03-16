const read_address = (id) => {
  switch (id) {
    case 1:
      return "Toshkent shahri";
      break;
    case 2:
      return "Toshkent viloyati";
      break;
    case 3:
      return "Andijon viloyati";
      break;
    case 4:
      return "Buxoro viloyati";
      break;
    case 5:
      return "Farg'ona viloyati";
      break;
    case 6:
      return "Jizzax viloyati";
      break;
    case 7:
      return "Xorazm viloyati";
      break;
    case 8:
      return "Namangan viloyati";
      break;
    case 9:
      return "Navoiy viloyati";
      break;
    case 10:
      return "Qashqadaryo viloyati";
      break;
    case 11:
      return "Qoraqalpog'iston Respublikasi";
      break;
    case 12:
      return "Samarqand viloyati";
      break;
    case 13:
      return "Sirdaryo viloyati";
      break;
    case 14:
      return "Surxondaryo viloyati";
      break;
    default:
      return "Nomalum Mazil";
      break;
  }
};

module.exports = read_address;
