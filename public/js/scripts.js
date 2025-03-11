function openModal() {
    try {
      document.getElementById("stackMdl").style.display = "block";
    } catch (err) {
      console.error("Error showing modal:", err);
    }
  }