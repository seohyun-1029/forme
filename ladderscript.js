document.addEventListener("DOMContentLoaded", () => {
  
  // 사다리 관련
  const ladderCanvas = document.getElementById("ladderCanvas");
  // ✨ 중요: 캔버스 요소 존재 여부 및 2D 컨텍스트 확인 ✨
  if (!ladderCanvas) {
      console.error("Error: ladderCanvas element not found! Make sure id='ladderCanvas' is correct in HTML.");
      return; 
  }
  const ctx = ladderCanvas.getContext("2d");
  if (!ctx) {
      console.error("Error: 2D context not available for ladderCanvas! Check browser compatibility or canvas setup.");
      return;
  }

  const lines = 5;
  const width = ladderCanvas.width;
  const height = ladderCanvas.height;
  const spacing = width / (lines + 1); // 세로선 간격
  const stepY = 20; // 가로선(층) 간격
  const ladderMap = []; // 사다리 가로선 정보 저장

  const faceBtns = document.querySelectorAll(".face-btn");
  const movingFace = document.getElementById("movingFace");
  const resultBox = document.getElementById("result");
  const resultImg = document.getElementById("reward-img");
  const overlay = document.getElementById("overlay"); 

  const closeResultBtn = document.getElementById("closeResultBtn");
  const checkResultBtn = document.getElementById("checkResultBtn");
  const nextBtn = document.getElementById("nextBtn"); 

  const prizes = [
    { img: "images/result_50000.png"}, 
    { img: "images/result_500.png"},    
    { img: "images/result_100000.png"}, 
    { img: "images/result_0.png"},    
    { img: "images/result_10000.png" } 
  ];

  let finalPrizeIndex = -1; 

  // 사다리 생성 함수
  function generateLadder() {
    ladderMap.length = 0; 
    const numRows = Math.floor(height / stepY); 

    for (let r = 0; r < numRows; r++) { 
      const row = Array(lines - 1).fill(false); 
      for (let x = 0; x < lines - 1; x++) {
        if (Math.random() < 0.3 && (r === 0 || !ladderMap[r-1][x]) && (x === 0 || !row[x - 1])) {
          row[x] = true;
        }
      }
      ladderMap.push(row);
    }
  }

  // 사다리 그리기 함수
  function drawLadder() {
    ctx.clearRect(0, 0, width, height); 
    ctx.strokeStyle = "#333"; 
    ctx.lineWidth = 2; 

    for (let i = 1; i <= lines; i++) {
      ctx.beginPath();
      ctx.moveTo(spacing * i, 0);
      ctx.lineTo(spacing * i, height);
      ctx.stroke();
    }

    for (let r = 0; r < ladderMap.length; r++) {
      const y = r * stepY + stepY / 2; 
      for (let x = 0; x < lines - 1; x++) {
        if (ladderMap[r][x]) { 
          ctx.beginPath();
          ctx.moveTo(spacing * (x + 1), y); 
          ctx.lineTo(spacing * (x + 2), y); 
          ctx.stroke();
        }
      }
    }
  }

  // 라인 인덱스에 따른 X 좌표 반환 
  function getX(lineIdx) {
    return spacing * (lineIdx + 1);
  }

  // 사다리 경로 생성 함수
  function createPath(startIdx) {
  let currentLine = startIdx;
  const path = [];
  const animationStep = 5;
  const stepY = 20;
  let y = 0;

  path.push({ x: getX(currentLine), y });

  for (let floor = 0; floor < ladderMap.length; floor++) {
    const currentFloor = ladderMap[floor];

    // 1. 가로선 확인 및 수평 이동
    if (currentLine < lines - 1 && currentFloor[currentLine]) {
      // 오른쪽으로 이동
      const startX = getX(currentLine);
      const endX = getX(currentLine + 1);
      for (let x = startX; x <= endX; x += animationStep) {
        path.push({ x, y });
      }
      currentLine += 1;
      path.push({ x: getX(currentLine), y });
    } else if (currentLine > 0 && currentFloor[currentLine - 1]) {
      // 왼쪽으로 이동
      const startX = getX(currentLine);
      const endX = getX(currentLine - 1);
      for (let x = startX; x >= endX; x -= animationStep) {
        path.push({ x, y });
      }
      currentLine -= 1;
      path.push({ x: getX(currentLine), y });
    }

    // 2. 아래로 내려가기 (수직 이동)
    const startY = y;
    const targetY = y + stepY;
    for (let yStep = startY + animationStep; yStep <= targetY; yStep += animationStep) {
      path.push({ x: getX(currentLine), y: yStep });
    }
    y = targetY;
  }

  // 끝까지 수직 이동 (ladderMap 아래 남은 부분)
  for (let yStep = y + animationStep; yStep <= ladderCanvas.height; yStep += animationStep) {
    path.push({ x: getX(currentLine), y: yStep });
  }

  // 최종 위치에서 멈추고 해당 세로줄 반환
  return { path, finalIndex: currentLine };
}

  // 움직임 애니메이션 함수
  function animateMovement(path, onComplete) {
    let i = 0;
    const canvasOffsetX = ladderCanvas.offsetLeft; 
    const canvasOffsetY = ladderCanvas.offsetTop;

    function step() {
      if (i >= path.length) {
        onComplete(); 
        return;
      }
      const pos = path[i];
      movingFace.style.left = (pos.x + canvasOffsetX) + "px"; 
      movingFace.style.top = (pos.y + canvasOffsetY) + "px";
      i++;
      requestAnimationFrame(step); 
    }
    step(); 
  }

  // 초기 사다리 생성 및 그리기 
  generateLadder();
  drawLadder();

  // 얼굴 버튼 클릭 이벤트
  faceBtns.forEach(face => {
    face.addEventListener("click", () => {
      // 모든 버튼 비활성화 (사다리 타는 동안 다시 누르지 못하게)
      faceBtns.forEach(btn => btn.disabled = true); 
      checkResultBtn.disabled = true; 
      
      // 혹시 모를 상황 대비: 결과창, 오버레이, 버튼 숨기기
      resultBox.classList.add("hidden");
      overlay.classList.remove("visible"); 
      overlay.classList.add("hidden");
      checkResultBtn.classList.add("hidden");
      nextBtn.classList.add("hidden"); 
      resultBox.style.transform = "translate(-50%, -50%) scale(0.8)";

      const index = parseInt(face.dataset.index); 
      movingFace.src = face.src; 
      movingFace.style.display = "block"; 

      const { path, finalIndex } = createPath(index); 
      
      // ✨ animateMovement 콜백 안에서 finalPrizeIndex를 설정하고 checkResultBtn을 보이게 함 ✨
      animateMovement(path, () => {
        movingFace.style.display = "none"; 
        finalPrizeIndex = finalIndex;
        checkResultBtn.classList.remove("hidden"); 
        checkResultBtn.disabled = false; 
        faceBtns.forEach(btn => btn.disabled = false); 
      });
    });
  });

  // "결과 확인" 버튼 클릭 이벤트
  if (checkResultBtn) {
    checkResultBtn.addEventListener("click", () => {
      if (finalPrizeIndex !== -1) { // finalPrizeIndex가 제대로 설정되었는지 확인
        const prize = prizes[finalPrizeIndex];
        resultImg.src = prize.img;

        overlay.classList.remove("hidden");
        overlay.classList.add("visible"); 
        resultBox.classList.remove("hidden");
        resultBox.style.transform = "translate(-50%, -50%) scale(1)"; 

        checkResultBtn.classList.add("hidden"); 
      } else {
          console.error("Error: finalPrizeIndex not set. 사다리 게임이 완료되지 않았습니다.");
      }
    });
  }

  // 닫기 버튼 클릭 시 결과창 숨기고 다음 단계 버튼 보이기
  if (closeResultBtn) {
    closeResultBtn.addEventListener("click", () => {
      resultBox.classList.add("hidden");
      overlay.classList.remove("visible");
      overlay.classList.add("hidden");
      resultBox.style.transform = "translate(-50%, -50%) scale(0.8)";

      window.location.href="quest3.html";
    });
  }

  // 다음 퀘스트 버튼 클릭 이벤트
  if (nextBtn) { 
    nextBtn.addEventListener("click", () => {
      window.location.href = "quest3.html";
    });
  }
});