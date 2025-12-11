import { CalculatorForm } from "../../../widgets/CalculatorForm/CalculatorForm";
import { HistoryList } from "../../../widgets/HistoryList/HistoryList";
import { Statistics } from "../../../widgets/Statistics/Statistics";

export const HomePage = () => {
  return (
    <main className="page">
      <div className="container space-y-6 animate-fade-in">
        <CalculatorForm />
        <Statistics />
        <HistoryList />
      </div>
    </main>
  );
};