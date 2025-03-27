import { db } from "../firebase";
import { update, remove, push, ref } from "firebase/database";
import { updateCardStatus } from "./KanbanHelper";

const Card = ({ card, setCards }) => {
  const handleDelete = () => {
    remove(ref(db, `queries/${card.id}`));
    setCards((prev) => prev.filter((c) => c.id !== card.id));
  };

  const handleStatusChange = () => {
    const newStatus =
      card.status === "pending"
        ? "in_progress"
        : card.status === "in_progress"
        ? "waiting_reply"
        : "pending";
    updateCardStatus(card.id, newStatus);
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
      className="bg-gray-100 border border-gray-300 rounded-md p-4 shadow-md mb-3 cursor-pointer"
      draggable
      onTouchStart={(e) => e.target.setAttribute("draggable", true)}
      onDragStart={(e) => e.dataTransfer.setData("cardId", card.id)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold">{card.name}</h3>
        <button onClick={handleDelete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="red"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
        {/* <TrashIcon className="w-5 h-5 text-red-500 cursor-pointer" /> */}
      </div>
      <p className="text-xs text-gray-600">{card.email}</p>
      <p className="text-xs text-gray-800 mt-2">{card.phone}</p>
      <p className="text-xs text-gray-800 mt-2">{card.message}</p>
      {console.log(card)}

      <div className="mt-3 flex justify-between items-center">
        <span className={`text-xs p-1 rounded text-gray-700 capitalize ${setColor(card.status)}`}>
          {card.status.replace("_", " ")}
        </span>
        <button
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
          onClick={handleStatusChange}
        >
          Change Status
        </button>
      </div>
    </div>
  );
};

export default Card;
