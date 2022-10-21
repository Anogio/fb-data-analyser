import { defineStore } from "pinia";

interface Photo {
  uri: string;
  creation_timetamp: number;
}

interface Reaction {
  reaction: string;
  actor: string;
}

interface Message {
  conversationName: string;
  conversationId: string;
  conversationType: string;
  sender: string;
  timestamp: number;
  text: string;
  photos: Photo[];
  reactions: Reaction[];
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
