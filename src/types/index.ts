export interface RomanticConfig {
  recipientName: string;
  senderName: string;
  startDate: string; // YYYY-MM-DD
  letterText: string;
  musicEnabled: boolean;
}

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  tag: string;
}
