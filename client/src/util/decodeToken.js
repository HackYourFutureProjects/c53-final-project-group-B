import { jwtDecode } from "jwt-decode";
function decodeToken(token) {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}
export default decodeToken;
