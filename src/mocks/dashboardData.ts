// @ts-nocheck
export const generateMockTransactions = () => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      id: `trans-${i}`,
      date: date,
      total: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1100
    };
  });
};