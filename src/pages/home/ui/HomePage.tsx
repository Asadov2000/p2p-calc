import { CalculatorForm } from "../../../widgets/CalculatorForm/CalculatorForm";
import { HistoryList } from "../../../widgets/HistoryList/HistoryList";

export const HomePage = () => {
  return (
    // Добавляем safe-area для iPhone notch/Dynamic Island
    // pt-[var(--safe-top)] - падинг сверху для notch
    // pb-[var(--safe-bottom)] - падинг снизу для home indicator
    <main className="min-h-dvh bg-ios-light-bg dark:bg-ios-dark-bg text-ios-light-text dark:text-ios-dark-text transition-colors duration-300 font-sans selection:bg-ios-blue/20 p-5 pt-[max(1.25rem,var(--safe-top))] pb-[max(5rem,var(--safe-bottom))]">
      <div className="max-w-md mx-auto space-y-8 animate-ios-slide">
        <CalculatorForm />
        <HistoryList />
      </div>
    </main>
  );
};