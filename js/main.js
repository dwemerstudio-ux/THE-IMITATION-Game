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
// === Терминальный экран: эффект печати ===
window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("terminalOverlay");
  const box = document.getElementById("terminalBox");
  const text = document.getElementById("terminalText");
  const buttons = document.getElementById("terminalButtons");
  const agree = document.getElementById("btnAgree");
  const refuse = document.getElementById("btnRefuse");

  if (!overlay || !text || !agree) return;

  // Список строк для вывода
  const lines = [
    "[NAR-HOZ_LAB]: ПРОТОКОЛ МАШИННОЙ ИМИТАЦИИ V2.0",
    "",
    "Правила симуляции:",
    "1. Не нарушать установленные протоколы.",
    "2. Принять участие в моральных тестах.",
    "3. Следить за стабильностью системы.",
    "4. Сохранять хладнокровие.",
    "5. Будьте спокойны.",
    "",
    "[СИСТЕМА]: для продолжения подтвердите участие..."
  ];

  let i = 0;
  text.textContent = "";
  overlay.style.opacity = 0;

  // Плавное появление терминала
  setTimeout(() => {
    overlay.style.transition = "opacity 1s ease";
    overlay.style.opacity = 1;

    // Запуск эффекта печати после появления
    setTimeout(() => typeLine(), 800);
  }, 300);

  function typeLine() {
    if (i >= lines.length) {
      buttons.style.display = "block";
      return;
    }

    const line = document.createElement("div");
    line.className = "term-line";
    text.appendChild(line);

    let j = 0;
    const chars = lines[i].split("");
    const typer = setInterval(() => {
      line.textContent += chars[j];
      j++;
      if (j >= chars.length) {
        clearInterval(typer);
        i++;
        setTimeout(typeLine, 250);
      }
    }, 25);
  }

  // Кнопки
  agree.addEventListener("click", async () => {
    overlay.classList.add("fade-out");
    await new Promise(r => setTimeout(r, 800));
    overlay.remove();

    document.getElementById("mainGame").classList.remove("hidden");
    document.getElementById("intro").classList.remove("hidden");
    document.getElementById("intro").classList.add("fade-in");

    console.log("[СИСТЕМА]: симуляция активна.");
  });

  refuse.addEventListener("click", () => {
    alert("Симуляция прервана. Сеанс завершён.");
    window.close();
  });
});
