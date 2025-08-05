    const names = [
      "WIN", "LOSE", "LOSE", "WIN", "LOSE",
      "LOSE", "WIN", "LOSE", "LOSE", "LOSE",
      "LOSE", "LOSE", "WIN", "LOSE", "LOSE",
      "WIN", "LOSE", "LOSE", "WIN", "LOSE"
    ];

    const canvas = document.getElementById("wheelCanvas");
    const ctx = canvas.getContext("2d");
    const spinBtn = document.getElementById("spinBtn");
    const resetBtn = document.getElementById("resetBtn");
    const result = document.getElementById("result");
    const video = document.getElementById("loseVideo");

    const winRedirectUrl = "https://www.facebook.com/gensantex"; 

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    const anglePerSlice = (2 * Math.PI) / names.length;

    function drawWheel() {
      for (let i = 0; i < names.length; i++) {
        const startAngle = i * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = i % 2 === 0 ? '#d2f57d' : '#0d8be7';
        ctx.fill();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSlice / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "12px Arial";
        ctx.fillText(names[i], radius - 10, 4);
        ctx.restore();
      }
    }

    drawWheel();

    function spinWheel() {
      if (localStorage.getItem("hasSpun") === "true") return;

      spinBtn.disabled = true;
      localStorage.setItem("hasSpun", "true");

      const randomIndex = Math.floor(Math.random() * names.length);
      const stopAngle = 360 * 5 + (360 - (randomIndex * 360 / names.length + 360 / names.length / 2));
      canvas.style.transform = `rotate(${stopAngle}deg)`;

      setTimeout(() => {
        const resultText = names[randomIndex];
        if (resultText === "WIN") {
          result.innerText = "🎉 Congratulations, You Win!";
          setTimeout(() => {
            window.location.href = winRedirectUrl;
          }, 3000);
        } else {
          result.innerText = "😢 Sorry, Try Again!";
          setTimeout(() => {
            playLoseVideo();
          }, 3000);
        }
      }, 4000);
    }

   function playLoseVideo() {
      video.style.display = "block";

      setTimeout(() => {
        // Force fullscreen
        const requestFull = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
        if (requestFull) {
          requestFull.call(video);
        }

        // Unmute and play
        video.muted = false;
        video.play();

        // Try to prevent exit from fullscreen
        document.addEventListener('fullscreenchange', () => {
          if (!document.fullscreenElement) {
          // Re-request fullscreen if exited
           requestFull.call(video);
         }
        });
      }, 2000);
    }

    if (localStorage.getItem("hasSpun") === "true") {
      spinBtn.disabled = true;
      result.innerText = "🛑 You've already spun the wheel.";
    }

    spinBtn.addEventListener("click", spinWheel);

    window.addEventListener("beforeunload", function (e) {
      if (localStorage.getItem("hasSpun") === "true") {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    resetBtn.addEventListener("click", () => {
      const correctPassword = "gtex123";
      const input = prompt("Enter admin password to reset:");
      if (input === correctPassword) {
        localStorage.removeItem("hasSpun");
        result.innerText = "✅ Spin has been reset. You can now spin again.";
        spinBtn.disabled = false;
        video.style.display = "none";
        video.pause();
        video.currentTime = 0;
      } else {
        alert("❌ Incorrect password. Access denied.");
      }
    });
