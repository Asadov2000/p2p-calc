import { CalculatorForm } from "../../../widgets/CalculatorForm/CalculatorForm";
import { HistoryList } from "../../../widgets/HistoryList/HistoryList";
import { Typography } from "../../../shared/ui/Typography/Typography";

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-tg-bg p-4 max-w-md mx-auto">
      <header className="mb-6 mt-2">
        <Typography variant="h1">P2P Калькулятор</Typography>
        <Typography variant="caption" className="mt-1">
          Считай спред и профит мгновенно
        </Typography>
      </header>

      <main>
        <CalculatorForm />
        <HistoryList />
      </main>
    </div>
  );
};