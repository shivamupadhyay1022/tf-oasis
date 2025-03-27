import Card from "./Card";
import { fetchAndAddToDB,updateCardStatus } from "./KanbanHelper";
const Column = ({ title, column, cards, setCards, isMobile }) => {
  const filteredCards = cards.filter((c) => c.status === column);

  const handleDrop = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    if (column === "add_to_db") {
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      fetchAndAddToDB(cardId);
    } else {
      updateCardStatus(cardId, column);
    }
  };

  const setColor = (title) =>{
    switch (title) {
      case "pending":
        return "bg-red-200 border-2 border-red-600";
      case "in_progress":
        return "bg-yellow-200 border-2 border-yellow-600";
      case "waiting_reply":
        return "bg-blue-200 border-2 border-blue-600";
      case "resolved":
        return "bg-red-200 border-2 border-red-600";
      default:
        return "bg-green-200 border-2 border-green-600";
    }
  }

  return (
    <div
      className={`p-4 bg-white rounded-lg shadow-md ${isMobile ? "w-full min-h-[150px]" : "w-full min-h-[300px]"}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
        <div className="flex justify-between">
      <h2 className="text-lg font-semibold mb-3 capitalize">{title.replace("_", " ")}</h2>
      <div className={`w-6 h-6 flex items-center justify-center rounded-full ${setColor(title)} `}></div>

      </div>
      {filteredCards.map((card) => (
        <Card key={card.id} card={card} setCards={setCards} />
      ))}
    </div>
  );
};

export default Column;
