import { CalculatorForm } from "../../../widgets/CalculatorForm/CalculatorForm";
import { HistoryList } from "../../../widgets/HistoryList/HistoryList";

export const HomePage = () => {
  return (
    <main>
      <CalculatorForm />
      <HistoryList />
    </main>
  );
};