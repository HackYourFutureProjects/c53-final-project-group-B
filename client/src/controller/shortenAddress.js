const shortenAddress = (address) => {
  if (!address) return "";

  const parts = address.split(",");
  if (parts.length >= 3) {
    return `${parts[0].trim()}, ${parts[2].trim()}`;
  }

  return address.length > 40 ? address.slice(0, 40) + "..." : address;
};
export default shortenAddress;
