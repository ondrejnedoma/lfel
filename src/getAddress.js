export default function getAddress(address) {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000" + address;
  } else {
    return address;
  }
}
