document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("hf_urli");
  const resultBox = document.getElementById("result");

  function showErrorInline(message) {
    const box = document.getElementById("error-inline");
    const msg = document.getElementById("error-inline-msg");
    msg.textContent = message;
    box.style.display = "block";
    setTimeout(() => {
      box.style.display = "none";
    }, 4000);
  }

  document.getElementById("submit").addEventListener("click", async (e) => {
    e.preventDefault();
    const tiktokUrl = input.value.trim();

    resultBox.innerHTML = ''; // reset kết quả cũ

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
          'Authorization': 'Bearer my_super_secret_token_123' // đổi nếu bạn dùng token khác
        },
        body: JSON.stringify({ url: tiktokUrl })
      });

      const data = await res.json();

      if (data.code === 0 && data.data.length > 0) {
        const links = data.data.map(item =>
          
          `<a href="${item.url}" target="_blank" style="display:block;margin:10px 0;color:#007bff;font-weight:bold;text-decoration:underline;">${item.label}</a>`
        ).join('');
        
        resultBox.innerHTML = links;
      } else {
        showErrorInline("Không lấy được video.");
      }
    } catch (err) {
      console.error(err);
      showErrorInline("Lỗi máy chủ hoặc kết nối.");
    }
  });
});


  
