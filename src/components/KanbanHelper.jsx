import { db } from "../firebase";
import { update, remove, push, ref, get } from "firebase/database";

// Update card status in Firebase
export const updateCardStatus = (cardId, newStatus) => {
  update(ref(db, `queries/${cardId}`), { status: newStatus });
};

// Move card to potential_leads and delete from queries
export const fetchAndAddToDB = async (cardId) => {
  const queryRef = ref(db, `queries/${cardId}`);
  const snapshot = await get(queryRef);
  const data = snapshot.val();

  if (data) {
    const leadsRef = ref(db, "potential_leads/");
    await push(leadsRef, { name: data.name, email: data.email, message: data.message });

    await remove(queryRef);
  }
};
