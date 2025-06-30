document.addEventListener("DOMContentLoaded", () => {
  const quizData = [
    { question: "박슬겸은 바보다😜", answer: true },
    { question: "2024년 12월 15일 우리는 데이트를 했다", answer: false },
    { question: "서현이는 택배박스를 잡아뜯는 것을 선호한다", answer: false },
    { question: "우리는 2025년 11월 16일이 800일이다", answer: false },
    { question: "우리가 제일 처음 같이 본 영화는 '잠'이다", answer: true },
    { question: "書 이 한자는 서현이 이름에 들어간다", answer: true },
    { question: "서현이의 이번 학기 성적은 4.0이다", answer: false },
    { question: "서현이는 지금 슬겸이가 보고싶다", answer: true }
  ];

  let current = 0;
  let score = 0;
  let started = false;

  const questionEl = document.getElementById("question");
  const oxContainer = document.getElementById("ox_container");
  const btnO = document.getElementById("btnO");
  const btnX = document.getElementById("btnX");
  const resultEl = document.getElementById("oxresult");
  const resultImg = document.getElementById("result-img");
  const resultBox = document.getElementById("result-box");
  const nextBtn = document.getElementById("nextBtn");

  questionEl.addEventListener("click", () => {
    if (!started) {
      started = true;
      oxContainer.classList.remove("hidden");
      showQuestion();
    }
  });

  function showQuestion() {
    if (current >= quizData.length) {
      showResult();
      return;
    }
    questionEl.textContent = quizData[current].question;
  }

  function checkAnswer(userAnswer) {
    const correct = quizData[current].answer;
    if (userAnswer === correct) {
      score++;
    }
    current++;
    setTimeout(showQuestion, 500);
  }

  function showResult() {
    questionEl.textContent = "";
    btnO.style.display = "none";
    btnX.style.display = "none";

    if (score >= 5) {
      resultImg.src = "images/reward2.png";
      resultBox.textContent = "소원권 획득! 🎉 캡쳐 후 1회 사용 가능!";
    } else {
      resultImg.src = "images/reward3.png";
      resultBox.textContent = "소원권 실패 다음 기회에!😝";
    }

    resultEl.classList.remove("hidden");
    nextBtn.classList.remove("hidden"); 
  }

  btnO.addEventListener("click", () => checkAnswer(true));
  btnX.addEventListener("click", () => checkAnswer(false));

    nextBtn.addEventListener("click", () => {
    window.location.href = "quest4.html"; 
});
});
