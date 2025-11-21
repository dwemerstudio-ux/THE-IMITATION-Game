// === Игровая логика ===
window.GameState = {
  hb: 0,
  rb: 0,
  round: 0,
  total: 10,
  active: false
};

// запуск симуляции
async function startGame() {
  GameState.round = 0;
  GameState.active = true;

  const intro = document.getElementById("intro");
  intro.classList.add("fade-out");
  await Diagnostics.sleep(900);
  intro.classList.add("hidden");

  await Diagnostics.sleep(600);
  await nextScene();
}

// запуск одной сцены
async function nextScene() {
  const sceneNum = GameState.round + 1;
  const sceneEl = document.getElementById("scene");
  const textEl = document.getElementById("sceneText");
  const btnsEl = document.getElementById("sceneButtons");

  // очистка перед новой сценой
  textEl.innerHTML = "";
  btnsEl.innerHTML = "";

  // промежуточные диагностики
  if ([3, 6, 8].includes(sceneNum)) {
    await Diagnostics.runDiagnostic();
    await Diagnostics.runNeuroScan();
  }

  sceneEl.classList.remove("hidden");
  document.getElementById("sceneTitle").textContent = `Дилемма №${sceneNum}`;
  textEl.textContent = `Это дилемма №${sceneNum}. Требуется моральное решение.`;

  // плавное появление
  sceneEl.classList.add("fade-in");
  await Diagnostics.sleep(600);

  // кнопки выбора
  const btnHuman = document.createElement("button");
  btnHuman.textContent = "🧠 Выбрать человечность";
  btnHuman.onclick = async () => {
    UI.logMessage("human");
    GameState.hb++;
    await endScene();
  };

  const btnRobot = document.createElement("button");
  btnRobot.textContent = "⚙️ Выбрать рациональность";
  btnRobot.onclick = async () => {
    UI.logMessage("robot");
    GameState.rb++;
    await endScene();
  };

  btnsEl.append(btnHuman, btnRobot);
}

// завершение сцены
async function endScene() {
  const sceneEl = document.getElementById("scene");
  sceneEl.classList.remove("fade-in");
  sceneEl.classList.add("fade-out");
  await Diagnostics.sleep(600);
  sceneEl.classList.add("hidden");
  sceneEl.classList.remove("fade-out");

  GameState.round++;

  if (GameState.round >= GameState.total) {
    finishGame();
  } else {
    await Diagnostics.sleep(400);
    await nextScene();
  }
}

// завершение симуляции
async function finishGame() {
  UI.showSystemOverlay("[СИСТЕМА]: симуляция завершена.");
  const result = document.getElementById("result");
  const summary = document.getElementById("summary");
  result.classList.remove("hidden");
  summary.textContent = `HB: ${GameState.hb}, RB: ${GameState.rb}`;
}

// сброс
function restartGame() {
  location.reload();
}

// обновление подсказки уверенности
function updateConfidenceHint() {
  const val = document.getElementById("confidence").value;
  const hint = document.getElementById("confidenceHint");
  if (val < 40) hint.textContent = "— нерешительность —";
  else if (val > 70) hint.textContent = "— уверенность —";
  else hint.textContent = "— равновесие решений —";
}
// === Терминальный экран ===
window.addEventListener("DOMContentLoaded", () => {
  const agree = document.getElementById("btnAgree");
  const refuse = document.getElementById("btnRefuse");
  const overlay = document.getElementById("terminalOverlay");

  if (agree && overlay) {
    agree.addEventListener("click", async () => {
      overlay.classList.add("fade-out");
      await Diagnostics.sleep(800);
      overlay.remove();
      startGame();
    });
  }

  if (refuse) {
    refuse.addEventListener("click", () => {
      alert("Симуляция прервана. Система завершает сеанс.");
      window.close();
    });
  }
});

