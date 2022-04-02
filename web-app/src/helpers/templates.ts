export const buildInviteText = (roomId: string): string => {
  return "Привет, я собираюсь играть в упоротые истории, присоединяйся: " + `${window.location.origin}/room/${roomId}`
};
