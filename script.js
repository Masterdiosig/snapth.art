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
          'Authorization': 'Bearer my_super_secret_token_123' // thay đổi nếu bạn dùng token khác
        },
        body: JSON.stringify({ url: tiktokUrl })
      });

      const data = await res.json();

      if (data.code === 0 && data.data.length > 0) {
        const links = data.data.map(item => {
          return `<button style="display:block;margin:10px 0;padding:10px 15px;border:none;border-radius:6px;background:#007bff;color:#fff;font-weight:bold;cursor:pointer;" onclick="downloadFile('${encodeURIComponent(item.url)}')">
            ${item.label}
          </button>`;
        }).join('');
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

// ✅ Hàm tải video đúng cách bằng Axios + thẻ <a>
window.downloadFile = async function (url) {
  try {
    // Kiểm tra link hợp lệ trước (tuỳ chọn, có thể bỏ nếu không cần)
    await axios.get('/api/download?url=' + encodeURIComponent(url), {
      responseType: 'blob'
    });

    // Sau khi xác thực, tạo thẻ a để trình duyệt tải file
    const a = document.createElement('a');
    a.href = '/api/download?url=' + encodeURIComponent(url);
    a.setAttribute('download', ''); // để trình duyệt hiểu là tải về
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    alert("Không thể tải video. Vui lòng thử lại.");
    console.error('Lỗi khi tải file:', error);
  }
};
