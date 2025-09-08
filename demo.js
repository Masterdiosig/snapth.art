  const form = document.getElementById("downloadForm");
    const resultBox = document.getElementById("resultBox");

    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const link = document.getElementById("videoLink").value.trim();
      if (link === "") {
        alert("Vui lòng nhập link TikTok!");
        return;
      }
      // Hiển thị kết quả (mock demo)
      resultBox.style.display = "block";
      resultBox.scrollIntoView({ behavior: "smooth" });
    });

     const videoInput = document.getElementById("videoLink");
  const pasteBtn = document.getElementById("pasteBtn");

  // Bấm Paste
  pasteBtn.addEventListener("click", async () => {
    if (pasteBtn.innerText.includes("Paste")) {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          videoInput.value = text;
          pasteBtn.innerText = "❌ Xoá";
        } else {
          alert("Clipboard trống!");
        }
      } catch (err) {
        alert("Không đọc được clipboard, hãy dán thủ công.");
      }
    } else {
      // Bấm Xoá
      videoInput.value = "";
      pasteBtn.innerText = "📋 Paste";
    }
  });

  // Khi nhập thủ công cũng đổi nút sang Xoá
  videoInput.addEventListener("input", () => {
    if (videoInput.value.trim() !== "") {
      pasteBtn.innerText = "❌ Xoá";
    } else {
      pasteBtn.innerText = "📋 Paste";
    }
  });