document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const clickBtn = document.getElementById("clickBtn");
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("resultText");
  const letter = document.getElementById("letter");
  const nextBtn = document.getElementById("nextBtn");

  const title = document.querySelector("h1");
  const description = document.getElementById("description");

  let count = 0;
  let timeLimit = 5000;

  startBtn.addEventListener("click", () => {
    count = 0;
    startBtn.classList.add("hidden");
    clickBtn.classList.remove("hidden");

    const startTime = Date.now();

    const interval = setInterval(() => {
      if (Date.now() - startTime >= timeLimit) {
        clearInterval(interval);
        clickBtn.classList.add("hidden");
        resultBox.classList.remove("hidden");

        if (count >= 5) {
          resultText.textContent = `성공! (${count}번 클릭) 🎉 클릭해서 편지 보기`;
          resultText.style.cursor = "pointer";
        } else {
          resultText.textContent = `실패 😢 (${count}번 클릭) 처음부터 다시!`;
        }
      }
    }, 100);
  });

  clickBtn.addEventListener("click", () => {
    count++;
  });

  // ✅ 클릭하면 편지 보여주기
  resultText.addEventListener("click", () => {
    if (count >= 5) {
      // 기존 요소 숨기기
      title.style.display = "none";
      description.style.display = "none";
      startBtn.style.display = "none";
      clickBtn.style.display = "none";
      resultText.style.display = "none";

      // 편지 내용 출력
      letter.classList.remove("hidden");
      
      nextBtn.classList.remove("hidden");
    }
  });

  nextBtn.addEventListener("click", () => {
    window.location.href = "final.html"; // 다음 페이지로 이동
  });
});
