export const translations = {
  ru: {
    title: "P2P Калькулятор",
    subtitle: "Считай спред профессионально",
    give: "Сумма", // Новое название
    get: "Сумма зачисляемая команде", // Новое название
    profit: "Хочу заработать", 
    commission: "Комиссия биржи",
    result: "Результат",
    breakEven: "Курс", // Просто "Курс", так как он один
    targetPrice: "Курс продажи",
    save: "Сохранить расчет",
    support: "Написать в поддержку",
    settings: "Настройки",
    hints: "Подсказки",
    hintTitle: "Как это работает?",
    hintText: "🟢 Введите общую Сумму (в рублях) и Сумму, которая придет команде (в USDT).\n\nКалькулятор покажет реальный курс обмена.",
    history: "История",
    clear: "Очистить"
  },
  en: {
    title: "P2P Calculator",
    subtitle: "Professional spread calculation",
    give: "Amount",
    get: "Credited to Team",
    profit: "Desired Profit",
    commission: "Exchange Fee",
    result: "Result",
    breakEven: "Rate",
    targetPrice: "Selling Price",
    save: "Save Calculation",
    support: "Contact Support",
    settings: "Settings",
    hints: "Hints",
    hintTitle: "How it works?",
    hintText: "🟢 Enter the Total Amount and the Amount credited to the team.\n\nThe calculator will show the actual exchange rate.",
    history: "History",
    clear: "Clear"
  }
};

export type Language = 'ru' | 'en';
export type Theme = 'light' | 'dark';