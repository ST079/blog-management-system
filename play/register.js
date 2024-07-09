const sendData = async () => {
  try {
    const form = document.getElementById("register");
    const formData = new FormData(form);
    const result = await axios.post(
      "http://localhost:8000/api/v1/users/register",
      formData
    );
    if (result) {
      document.getElementById("msg").classList.remove("d-none");
      document.getElementById("msg").innerHTML = result.data.data;
    }
  } catch (error) {
    console.log(error);
  }
};
