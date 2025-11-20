const shortenAddress = (address) => {
  if (!address) return "";

  const parts = address.split(",");
  if (parts.length >= 2) {
    return `${parts[0].trim()}, ${parts[parts.length - 1].trim()}`;
  }
  return address.length > 40 ? address.slice(0, 40) + "..." : address;
};
export default shortenAddress;
