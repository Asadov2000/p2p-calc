export const translations = {
  ru: {
    title: "P2P Калькулятор",
    give: "СУММА",
    get: "СУММА ЗАЧИСЛЯЕМАЯ КОМАНДЕ",
    sellPrice: "Курс продажи",
    breakEven: "Себестоимость",
    profit: "Твой заработок",
    save: "Сохранить",
    support: "Поддержка",
    hints: "Подсказки",
    // Новые ключи для шагов
    step1Title: "Шаг 1. Бюджет",
    step1Text: "В поле СУММА напиши сумму в рублях, которую ты потратил на покупку.",
    step2Title: "Шаг 2. Объем",
    step2Text: "В поле СУММА ЗАЧИСЛЯЕМАЯ КОМАНДЕ напиши, сколько USDT пришло тебе на кошелек.",
    step3Title: "Шаг 3. Прибыль",
    step3Text: "Ниже введи Курс продажи. Мы покажем твой чистый заработок!",
    gotIt: "Понятно",
    
    history: "История",
    historyEmpty: "История пуста",
    clear: "Очистить"
  },
  en: {
    title: "P2P Calculator",
    give: "AMOUNT",
    get: "RECEIVE",
    sellPrice: "Selling Rate",
    breakEven: "Break-even",
    profit: "Your Profit",
    save: "Save",
    support: "Support",
    hints: "Hints",
    // Новые ключи для шагов (English)
    step1Title: "Step 1. Budget",
    step1Text: "Enter the amount in RUB you spent in the AMOUNT field.",
    step2Title: "Step 2. Volume",
    step2Text: "Enter how much USDT you received in the THE AMOUNT CREDITED TO THE TEAM field.",
    step3Title: "Step 3. Profit",
    step3Text: "Enter the Selling Rate below. We will calculate your net profit!",
    gotIt: "Got it",

    history: "History",
    historyEmpty: "History is empty",
    clear: "Clear"
  }
};

export type Language = 'ru' | 'en';
export type Theme = 'light' | 'dark';