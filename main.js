document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".simple_form");
  const input = document.getElementById("hf_urli");



  // Hàm hiện lỗi ngay dưới ô nhập
  function showErrorInline(message) {
    const box = document.getElementById("error-inline");
    const msg = document.getElementById("error-inline-msg");
    msg.textContent = message;
    box.style.display = "block";
    setTimeout(() => {
      box.style.display = "none";
    }, 4000);
  }


  form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tiktokUrl = input.value.trim();
  if (!tiktokUrl) {
    showErrorInline("Paste valid link!");
    input.focus();
    return;
  }

  try {
    const res = await fetch('/api/tiktok', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer my_super_secret_token_123' // ✅ đưa vào đúng chỗ
      },
      body: JSON.stringify({ url: tiktokUrl })
    });

    const data = await res.json();

    if (data.code === 0 && data.data.length > 0) {
      window.open(data.data[0].url, '_blank');
    } else {
      showErrorInline("Error video or server.");
    }
  } catch (err) {
    console.error(err);
    showErrorInline("Error video or server.");
  }
});

});