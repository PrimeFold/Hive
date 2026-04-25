export const getMember = (userId: string) => {
  return {
    displayName: "User",
    avatar: userId.slice(0, 2).toUpperCase(),
  };
};