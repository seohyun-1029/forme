document.addEventListener("DOMContentLoaded", () => {
  // 기존 퀘스트1 배지/타이틀 관련 (변동 없음)
  const badge = document.getElementById("rank-mark");
  const title = document.getElementById("rank-title");
  const message = document.getElementById("message");

  if (badge && title && message) {
    badge.addEventListener("click", () => {
      badge.src = "images/second.png";
      title.textContent = "🪖일병 박슬겸🪖";
      message.classList.remove("hidden");
    });

    message.addEventListener("click", () => {
      window.location.href = "quest1.html";
    });
  }

  // 퍼즐 관련 (변동 없음)
  const puzzleContainer = document.getElementById("puzzle-container");
  const reward = document.getElementById("puzzle-reward");
  const nextQuestBtn = document.getElementById("nextQuestBtn"); // 변수명 충돌 피하기 위해 변경

  if (puzzleContainer) {
    initPuzzle(puzzleContainer, reward, nextQuestBtn);
  }

  nextQuestBtn.addEventListener("click",()=>{
    window.location.href="quest2.html";
  })
});


function initPuzzle(puzzleContainer, reward, nextQuestBtn) {
  const PUZZLE_IMAGES = Array(16).fill(null).map((_, i) => `images/puzzle1/${i}.png`);
  let order = [...Array(16).keys()];
  shuffleArray(order);

  puzzleContainer.innerHTML = "";
  order.forEach(i => {
    const piece = document.createElement("div");
    piece.classList.add("puzzle-piece");
    piece.setAttribute("draggable", "true");
    piece.dataset.index = i;
    piece.style.backgroundImage = `url('${PUZZLE_IMAGES[i]}')`;

    piece.addEventListener("dragstart", dragStart);
    piece.addEventListener("dragover", dragOver);
    piece.addEventListener("drop", drop);
    piece.addEventListener("dragenter", dragEnter);
    piece.addEventListener("dragleave", dragLeave);

    puzzleContainer.appendChild(piece);
  });

  let dragSrcEl = null;

  function dragStart(e) {
    dragSrcEl = e.target;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
    e.target.classList.add("dragging");
  }

  function dragOver(e) {
    e.preventDefault();
    e.target.classList.add("over");
  }

  function dragEnter(e) {
    e.target.classList.add("over");
  }

  function dragLeave(e) {
    e.target.classList.remove("over");
  }

  function drop(e) {
    e.preventDefault();
    if (dragSrcEl !== e.target) {
      swapElements(dragSrcEl, e.target);
      checkComplete();
    }
    e.target.classList.remove("over");
  }

  function swapElements(el1, el2) {
    const parent = el1.parentNode;
    const next1 = el1.nextSibling === el2 ? el1 : el1.nextSibling;
    parent.insertBefore(el1, el2);
    parent.insertBefore(el2, next1);
  }

  function checkComplete() {
    const pieces = Array.from(document.querySelectorAll(".puzzle-piece"));
    for (let i = 0; i < pieces.length; i++) {
      if (parseInt(pieces[i].dataset.index) !== i) return false;
    }
    showReward();
    return true;
  }

  function showReward() {
  puzzleContainer.style.display = "none"; 
  const completedWrapper = document.getElementById("completed-image");
  const completedImage = document.getElementById("completedImage");

  completedWrapper.classList.remove("hidden");
  setTimeout(() => completedWrapper.classList.add("show"), 50);

 
  completedImage.addEventListener("click", () => {
    completedWrapper.classList.remove("show");
    completedWrapper.style.display = "none";
    reward.classList.remove("hidden");
    setTimeout(() => reward.classList.add("show"), 50);
    nextQuestBtn.classList.remove("hidden");
  });
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

}
