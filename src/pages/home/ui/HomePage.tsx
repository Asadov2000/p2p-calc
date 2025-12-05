import { CalculatorForm } from "../../../widgets/CalculatorForm/CalculatorForm";
import { HistoryList } from "../../../widgets/HistoryList/HistoryList";

export const HomePage = () => {
  return (
    // Перенесли стили фона сюда. min-h-screen гарантирует, что фон будет на весь экран, 
    // но контент внутри будет идти друг за другом без гигантских отступов.
    <main className="min-h-screen bg-ios-light-bg dark:bg-ios-dark-bg text-ios-light-text dark:text-ios-dark-text transition-colors duration-300 font-sans selection:bg-ios-blue/20 p-5 pb-20">
      <div className="max-w-md mx-auto space-y-8 animate-ios-slide">
        <CalculatorForm />
        <HistoryList />
      </div>
    </main>
  );
};