import { defineStore } from "pinia";

interface Message {
  conversationName: string;
  conversationId: string;
  conversationType: string;
  sender: string;
  timestamp: number;
  text: string;
}

interface StoreState {
  sortedMessages: Message[] | null;
  myName: string | null;
}

export const useMainStore = defineStore("main", {
  state: () => ({ sortedMessages: null, myName: null } as StoreState),
  actions: {
    setSortedMessages(messages: Message[]) {
      this.sortedMessages = messages;
    },
    setMyName(myName: string) {
      this.myName = myName;
    },
  },
});
