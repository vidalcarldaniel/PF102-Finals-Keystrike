    // keys for left game
    const lanes = [
      document.getElementById('lane0'),
      document.getElementById('lane1'),
      document.getElementById('lane2'),
      document.getElementById('lane3')
    ];
    const keys = ['a', 's', 'd', 'f'];

    // keys for right game
    const lanes2 = [
      document.getElementById('lane4'),
      document.getElementById('lane5'),
      document.getElementById('lane6'),
      document.getElementById('lane7')
    ];
    const keys2 = ['h', 'j', 'k', 'l'];

    // Game state
    let activeNotes = [];
    let spawned = 0;
    let score = 0;
    let fallingSpeed = 4;
    let startTime = 0;
    let notesMissed = 0;

    let activeNotes2 = [];
    let spawned2 = 0;
    let score2 = 0;
    let fallingSpeed2 = 4;
    let startTime2 = 0;
    let notesMissed2 = 0;

    // Predefined charts (same structure, different timing density)
    const notesCharts = {
      easy: [
        [1.0, 0], [2.0, 1], [3.0, 2], [4.0, 3],
        [5.0, 0], [6.0, 1], [7.0, 2], [8.0, 3],
        [9.0, 0], [10.0, 1], [11.0, 2], [12.0, 3]
      ],
      medium: [
        [1.0, 0], [1.5, 1], [2.0, 2], [2.5, 3],
        [3.0, 0], [3.5, 1], [4.0, 2], [4.5, 3],
        [5.0, 0], [5.5, 1], [6.0, 2], [6.5, 3],
        [7.0, 0], [7.5, 1]
      ],
      hard: [
        [0.5, 0], [0.8, 1], [1.1, 2], [1.4, 3],
        [1.7, 0], [2.0, 1], [2.3, 2], [2.6, 3],
        [2.9, 0], [3.2, 1], [3.5, 2], [3.8, 3],
        [4.1, 0], [4.4, 1], [4.7, 2], [5.0, 3]
      ]
    };

    // Add a separate notes chart for the right game (lanes2)
    const notesCharts2 = {
      easy: [
        [1.2, 0], [2.2, 1], [3.2, 2], [4.2, 3],
        [5.2, 0], [6.2, 1], [7.2, 2], [8.2, 3],
        [9.2, 0], [10.2, 1], [11.2, 2], [12.2, 3]
      ],
      medium: [
        [1.2, 0], [1.7, 1], [2.2, 2], [2.7, 3],
        [3.2, 0], [3.7, 1], [4.2, 2], [4.7, 3],
        [5.2, 0], [5.7, 1], [6.2, 2], [6.7, 3],
        [7.2, 0], [7.7, 1]
      ],
      hard: [
        [0.7, 0], [1.0, 1], [1.3, 2], [1.6, 3],
        [1.9, 0], [2.2, 1], [2.5, 2], [2.8, 3],
        [3.1, 0], [3.4, 1], [3.7, 2], [4.0, 3],
        [4.3, 0], [4.6, 1], [4.9, 2], [5.2, 3]
      ]
    };

    let notesChart = [];
    let notesChart2 = [];

    function createNote(laneIndex) {
      const note = document.createElement('div');
      note.classList.add('note');
      note.style.top = '-20px';
      lanes[laneIndex].appendChild(note);
      activeNotes.push({ el: note, lane: laneIndex, top: -20 });
    }

    function updateNotes() {
      for (let i = activeNotes.length - 1; i >= 0; i--) {
        const note = activeNotes[i];
        note.top += fallingSpeed;
        note.el.style.top = note.top + 'px';
        if (note.top > 600) {
          note.el.remove();
          activeNotes.splice(i, 1);
          notesMissed++; // Count missed note for left game
        }
      }
    }

    function spawnNotesFromChart(currentTime) {
      while (spawned < notesChart.length && notesChart[spawned][0] <= currentTime) {
        const [_, lane] = notesChart[spawned];
        createNote(lane);
        spawned++;
      }
    }

    function createNote2(laneIndex) {
      const note = document.createElement('div');
      note.classList.add('note');
      note.style.top = '-20px';
      lanes2[laneIndex].appendChild(note);
      activeNotes2.push({ el: note, lane: laneIndex, top: -20 });
    }

    function updateNotes2() {
      for (let i = activeNotes2.length - 1; i >= 0; i--) {
        const note = activeNotes2[i];
        note.top += fallingSpeed2;
        note.el.style.top = note.top + 'px';
        if (note.top > 600) {
          note.el.remove();
          activeNotes2.splice(i, 1);
          notesMissed2++; // Count missed note for right game
        }
      }
    }

    function spawnNotesFromChart2(currentTime) {
      while (spawned2 < notesChart2.length && notesChart2[spawned2][0] <= currentTime) {
        const [_, lane] = notesChart2[spawned2];
        createNote2(lane);
        spawned2++;
      }
    }

    document.addEventListener('keydown', (e) => {
      // Left game (a s d f)
      const key = e.key.toLowerCase();
      const laneIndex = keys.indexOf(key);
      if (laneIndex !== -1) {
        const laneNotes = activeNotes.filter(n => n.lane === laneIndex);
        if (laneNotes.length > 0) {
          const note = laneNotes[0];
          // Get hit-bar position and note position
          const laneElem = lanes[laneIndex];
          const hitBar = laneElem.querySelector('.hit-bar');
          const hitBarRect = hitBar.getBoundingClientRect();
          const noteRect = note.el.getBoundingClientRect();
          // Check if note is inside hit-bar
          if (
            noteRect.bottom > hitBarRect.top &&
            noteRect.top < hitBarRect.bottom
          ) {
            note.el.remove();
            activeNotes.splice(activeNotes.indexOf(note), 1);
            score += 100;
            document.getElementById('score').textContent = 'Score: ' + score;
          }
        }
      }
      // Right game (h j k l)
      const laneIndex2 = keys2.indexOf(key);
      if (laneIndex2 !== -1) {
        const laneNotes2 = activeNotes2.filter(n => n.lane === laneIndex2);
        if (laneNotes2.length > 0) {
          const note2 = laneNotes2[0];
          const laneElem2 = lanes2[laneIndex2];
          const hitBar2 = laneElem2.querySelector('.hit-bar');
          const hitBarRect2 = hitBar2.getBoundingClientRect();
          const noteRect2 = note2.el.getBoundingClientRect();
          if (
            noteRect2.bottom > hitBarRect2.top &&
            noteRect2.top < hitBarRect2.bottom
          ) {
            note2.el.remove();
            activeNotes2.splice(activeNotes2.indexOf(note2), 1);
            score += 100; // Use the same score variable
            document.getElementById('score').textContent = 'Score: ' + score;
          }
        }
      }
    });

    function gameLoop() {
      const currentTime = (Date.now() - startTime) / 1000;
      spawnNotesFromChart(currentTime);
      updateNotes();
      // Right game
      const currentTime2 = (Date.now() - startTime2) / 1000;
      spawnNotesFromChart2(currentTime2);
      updateNotes2();
      checkGameEnd();
      requestAnimationFrame(gameLoop);
    }

    function startGame() {
      startTime = Date.now();
      startTime2 = Date.now();
      score = 0;
      score2 = 0;
      notesMissed = 0;
      notesMissed2 = 0;
      document.getElementById('score').textContent = 'Score: 0';
      activeNotes = [];
      activeNotes2 = [];
      spawned = 0;
      spawned2 = 0;
      gameLoop();
    }

    function goToModeSelection() {
      document.getElementById('start-page').style.display = 'none';
      document.getElementById('mode-page').style.display = 'flex';
    }

    function backToStart() {
      document.getElementById('mode-page').style.display = 'none';
      document.getElementById('controls-page').style.display = 'none';
      document.getElementById('credits-page').style.display = 'none';
      document.getElementById('main-game').style.display = 'none';
      document.getElementById('start-page').style.display = 'flex';
    }

    function goToControls() {
      document.getElementById('start-page').style.display = 'none';
      document.getElementById('controls-page').style.display = 'flex';
    }

    function goToCredits() {
      document.getElementById('start-page').style.display = 'none';
      document.getElementById('credits-page').style.display = 'flex';
    }

    function selectMode(mode) {
      let modeLabel = '';
      if (mode === 'easy') {
        fallingSpeed = 3;
        notesChart = notesCharts.easy;
        notesChart2 = notesCharts2.easy;
        modeLabel = 'Easy';
      } else if (mode === 'medium') {
        fallingSpeed = 4;
        notesChart = notesCharts.medium;
        notesChart2 = notesCharts2.medium;
        modeLabel = 'Medium';
      } else if (mode === 'hard') {
        fallingSpeed = 6;
        notesChart = notesCharts.hard;
        notesChart2 = notesCharts2.hard;
        modeLabel = 'Hard';
      }
      document.getElementById('mode-page').style.display = 'none';
      document.getElementById('main-game').style.display = 'flex';
      document.getElementById('difficulty').textContent = `${modeLabel}`;
    }

    // Store highest score in localStorage
    function getHighestScore() {
      return parseInt(localStorage.getItem('highestScore') || '0', 10);
    }
    function setHighestScore(newScore) {
      localStorage.setItem('highestScore', newScore);
    }

    // Call this function when the game ends
    function endGame() {
      // Update highest score if needed
      const highest = getHighestScore();
      if (score > highest) setHighestScore(score);

      // Show modal with details
      const modal = document.getElementById('game-over-modal');
      const details = document.getElementById('modal-details');
      details.innerHTML = `
        <p><b>Your Score:</b> ${score}</p>
        <p><b>Highest Score:</b> ${Math.max(score, highest)}</p>
        <p><b>Difficulty:</b> ${document.getElementById('difficulty').textContent}</p>
        <p><b>Notes Hit:</b> ${score / 100}</p>
        <p><b>Notes Missed (Left):</b> ${notesMissed}</p>
        <p><b>Notes Missed (Right):</b> ${notesMissed2}</p>
        <p><b>Thank you for playing!</b></p>
      `;
      modal.style.display = 'flex';
    }

    function closeGameOverModal() {
      document.getElementById('game-over-modal').style.display = 'none';
      window.location.href = "index.html";
    }

    // Check if the game is over (all notes spawned and cleared)
    function checkGameEnd() {
      if (
        spawned >= notesChart.length &&
        spawned2 >= notesChart2.length &&
        activeNotes.length === 0 &&
        activeNotes2.length === 0
      ) {
        endGame();
      }
    }