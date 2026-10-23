(() => {
  'use strict';
  const cases = window.PHP2SHELL_CASES;
  const caseButtons = [...document.querySelectorAll('.case-button')];
  const eventLog = document.querySelector('#event-log');
  const eventCounter = document.querySelector('#event-counter');
  const nextButton = document.querySelector('#next-event');
  const resultBox = document.querySelector('#replay-result');
  const diagnosis = document.querySelector('#diagnosis');
  const diagnosisFeedback = document.querySelector('#diagnosis-feedback');
  const responseOptions = [...document.querySelectorAll('.response-option')];
  const responseFeedback = document.querySelector('#response-feedback');
  const quizForm = document.querySelector('#quiz-form');
  const quizResults = document.querySelector('#quiz-results');
  const completionState = document.querySelector('#completion-state');
  const trainingFlag = document.querySelector('#training-flag');
  const state = { currentCase: 'cve-2026-109618', shown: 0, completedCases: new Set(), diagnosisCorrect: false, mitigationCorrect: false, quizScore: null };

  const quizItems = [
    { question: 'When can PHP parse multipart request data?', options: ['Only after the application calls session_start().', 'During early request handling, before application code starts.', 'Only after a logged-in administrator submits the form.'], answer: 1, why: 'PHP can process request bodies and upload-progress state during early request handling, before userland application code.' },
    { question: 'What does CVE-2026-109618 describe in the PHP advisory?', options: ['Out-of-memory corruption and invalid request state.', 'A SQL injection in WordPress.', 'A browser-only cookie theft issue.'], answer: 0, why: 'The PHP advisory is titled “RCE via OOM corruption”; it concerns unsafe state after an out-of-memory early exit.' },
    { question: 'What is central to the stale-state lifecycle in CVE-2026-109619?', options: ['A worker may retain request-owned state after its backing memory is freed.', 'The browser cache stores the PHP source file.', 'A user must upload an executable application plugin.'], answer: 0, why: 'The advisory describes worker-level global state that can outlive request-owned memory and be consumed before ordinary initialization resets it.' },
    { question: 'Which action is the complete mitigation for affected PHP installations?', options: ['Update to a PHP release containing the fix, then restart the relevant service/workers.', 'Disable application error messages only.', 'Add a front-end warning banner.'], answer: 0, why: 'The PHP project identifies releases containing the fix as the complete remediation. Configuration workarounds are partial.' },
    { question: 'What does the score and flag in this room prove?', options: ['That a real PHP server is secure.', 'Only that you completed this local learning exercise.', 'That the simulated exploit succeeded.'], answer: 1, why: 'All state is fictional. The score and flag are local training feedback, not a system assessment or exploit result.' }
  ];

  function updateCompletion() {
    const allCases = state.completedCases.size === Object.keys(cases).length;
    const ready = allCases && state.diagnosisCorrect && state.mitigationCorrect && state.quizScore !== null && state.quizScore >= 4;
    const pieces = [
      `${state.completedCases.size}/${Object.keys(cases).length} evidence replays`,
      state.diagnosisCorrect ? 'diagnosis correct' : 'diagnosis pending',
      state.mitigationCorrect ? 'mitigation correct' : 'mitigation pending',
      state.quizScore === null ? 'quiz pending' : `quiz ${state.quizScore}/5`
    ];
    completionState.textContent = ready ? 'Room complete. The flag below is a local training token.' : `Progress: ${pieces.join(' · ')}. Complete both replays, the diagnosis, the mitigation choice, and score at least 4/5.`;
    trainingFlag.hidden = !ready;
  }

  function selectCase(id) {
    if (!cases[id]) return;
    state.currentCase = id;
    state.shown = 0;
    for (const button of caseButtons) {
      const selected = button.dataset.case === id;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    }
    eventLog.replaceChildren();
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'No events shown. Start the replay to reveal the first fictional record.';
    eventLog.append(empty);
    eventCounter.textContent = 'Not started';
    nextButton.disabled = true;
    resultBox.hidden = true;
    resultBox.textContent = '';
  }

  function revealNext() {
    const item = cases[state.currentCase].events[state.shown];
    if (!item) return;
    if (state.shown === 0) eventLog.replaceChildren();
    const row = document.createElement('li');
    const time = document.createElement('span');
    const kind = document.createElement('span');
    const text = document.createElement('span');
    time.className = 'event-time'; time.textContent = item.time;
    kind.className = `event-kind${item.kind === 'ANALYSIS' ? ' analysis' : ''}`; kind.textContent = item.kind;
    text.textContent = item.text;
    row.append(time, kind, text);
    eventLog.append(row);
    state.shown += 1;
    eventCounter.textContent = `${state.shown} / ${cases[state.currentCase].events.length} events`;
    nextButton.disabled = state.shown >= cases[state.currentCase].events.length;
    if (state.shown >= cases[state.currentCase].events.length) {
      state.completedCases.add(state.currentCase);
      resultBox.textContent = cases[state.currentCase].result;
      resultBox.hidden = false;
      updateCompletion();
    }
  }

  for (const button of caseButtons) button.addEventListener('click', () => selectCase(button.dataset.case));
  document.querySelector('#start-replay').addEventListener('click', () => {
    selectCase(state.currentCase);
    revealNext();
    nextButton.disabled = false;
  });
  nextButton.addEventListener('click', revealNext);
  document.querySelector('#reset-replay').addEventListener('click', () => selectCase(state.currentCase));

  document.querySelector('#submit-diagnosis').addEventListener('click', () => {
    const correct = diagnosis.value === 'pre-app';
    state.diagnosisCorrect = correct;
    diagnosisFeedback.textContent = !diagnosis.value ? 'Choose an explanation first.' : correct ? 'Correct. The lifecycle issue can begin before application code. These local records are synthetic—not evidence from a real target.' : diagnosis.value === 'unknown' ? 'That is true about this training room, but it does not explain the PHP2Shell lifecycle. Focus on when request parsing and upload-progress handling can occur.' : 'Not quite. The room provides no evidence of an application flaw, and session_start() is not required to make early runtime processing relevant.';
    diagnosisFeedback.style.color = correct ? 'var(--green)' : 'var(--red)';
    updateCompletion();
  });

  for (const button of responseOptions) button.addEventListener('click', () => {
    for (const option of responseOptions) option.classList.remove('chosen', 'correct', 'incorrect');
    button.classList.add('chosen');
    const answer = button.dataset.answer;
    state.mitigationCorrect = answer === 'full';
    if (state.mitigationCorrect) button.classList.add('correct'); else button.classList.add('incorrect');
    responseFeedback.textContent = state.mitigationCorrect
      ? 'Correct: install a release containing the PHP core fix and restart the affected service/workers. The other controls are partial or do not repair PHP core.'
      : answer === 'partial'
        ? 'This may reduce a demonstrated path or temporarily lower exposure, but it does not cover every lifecycle path. The PHP runtime still needs the fix.'
        : 'This does not fix the PHP runtime vulnerability. Keep the application and runtime layers distinct.';
    updateCompletion();
  });

  quizItems.forEach((item, index) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'quiz-item';
    const legend = document.createElement('legend');
    legend.textContent = `${index + 1}. ${item.question}`;
    fieldset.append(legend);
    item.options.forEach((option, optionIndex) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio'; radio.name = `q${index}`; radio.value = String(optionIndex);
      const text = document.createElement('span'); text.textContent = option;
      label.append(radio, text); fieldset.append(label);
    });
    const explanation = document.createElement('p');
    explanation.className = 'quiz-explanation'; explanation.hidden = true;
    fieldset.append(explanation);
    quizForm.append(fieldset);
  });

  document.querySelector('#submit-quiz').addEventListener('click', () => {
    let score = 0;
    const fieldsets = [...quizForm.querySelectorAll('fieldset')];
    fieldsets.forEach((fieldset, index) => {
      const selected = fieldset.querySelector('input:checked');
      const explanation = fieldset.querySelector('.quiz-explanation');
      const correct = Boolean(selected && Number(selected.value) === quizItems[index].answer);
      if (correct) score += 1;
      explanation.textContent = `${correct ? 'Correct. ' : 'Review. '}${quizItems[index].why}`;
      explanation.hidden = false;
    });
    state.quizScore = score;
    quizResults.textContent = `Training score: ${score}/5. This is a knowledge-check result only; it is not a security score.`;
    updateCompletion();
  });

  document.querySelector('#reset-room').addEventListener('click', () => {
    state.completedCases.clear(); state.diagnosisCorrect = false; state.mitigationCorrect = false; state.quizScore = null;
    diagnosis.value = ''; diagnosisFeedback.textContent = ''; responseFeedback.textContent = ''; quizResults.textContent = '';
    for (const button of responseOptions) button.classList.remove('chosen', 'correct', 'incorrect');
    for (const explanation of quizForm.querySelectorAll('.quiz-explanation')) { explanation.hidden = true; explanation.textContent = ''; }
    for (const input of quizForm.querySelectorAll('input')) input.checked = false;
    selectCase('cve-2026-109618'); updateCompletion();
  });

  updateCompletion();
})();
