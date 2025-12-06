export const translations = {
  ru: {
    title: "P2P Калькулятор",
    give: "Сумма (RUB)",
    get: "Получу (USDT)",
    sellPrice: "Курс продажи на ByBit", // Новое поле
    breakEven: "Себестоимость",
    profit: "Твой заработок", // Результат
    save: "Сохранить",
    support: "Поддержка",
    hints: "Подсказки",
    hintTitle: "Как считать?",
    hintText: "1. Введите, сколько рублей вы отдали и сколько USDT получили.\n2. В поле 'Курс продажи' введите цену, по которой планируете выставить ордер на Bybit.\n3. Внизу увидите чистую прибыль.",
    history: "История",
    clear: "Очистить"
  },
  en: {
    title: "P2P Calculator",
    give: "Amount (RUB)",
    get: "Receive (USDT)",
    sellPrice: "The selling rate on ByBit",
    breakEven: "Break-even",
    profit: "Your Profit",
    save: "Save",
    support: "Support",
    hints: "Hints",
    hintTitle: "How to use?",
    hintText: "1. Enter Amount sent and USDT received.\n2. Enter the 'Sell Price' you see on Bybit.\n3. See your net profit below.",
    history: "History",
    clear: "Clear"
  }
};

export type Language = 'ru' | 'en';
export type Theme = 'light' | 'dark';