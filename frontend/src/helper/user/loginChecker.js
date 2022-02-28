export async function isAuthenticated() {
    try {
      const response = await fetch("http://localhost:3001/api/authorization", {
        method: "GET",
        headers: { token: localStorage.jwtToken }
      });
      const token = await response.json();
      if (token === true) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error.message)
    }
}