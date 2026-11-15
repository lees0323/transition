const segments = [
	['A', '0:00–0:46', '1uKtXELvvfYnYYCZNRQZmv0BV4DvXiIWF', 46],
	['A′', '0:46–1:47', '1lz0glvtN4MQMhQci7Vd5MbiZa64rNzoH', 61],
	['A″', '1:47–2:48', '1dBl76FaHGGTDgudnBYfuIMcyhTjByk4A', 61],
	['B', '2:48–3:29', '1rpt0l2M5H_u9Rums1gS4ORqUz8MbgD56', 41],
	['A‴', '3:29–3:49', '1ZtDqAdKWhWJFsjncexLv-6DjlGK3igqK', 20],
	['Coda', '3:49–5:03', '11cgtKQqrOib8wY1ig20S2CgwDkgLkTDr', 74]
];

const key = 'buccaneers-act-iii-v1';
const empty = () => ({
	transition: { preference: [], front: '', brass: '', notes: '' },
	segments: segments.map(() => ({ rating: 0, music: [], visual: [], notes: '' })),
	picks: [],
	ending: '',
	rationale: '',
	name: '',
	role: '',
	overall: ''
});

let state = empty(),
	stage = 0,
	active = 0,
	storage = true;

try {
	const saved = JSON.parse(localStorage.getItem(key));
	if (saved && saved.segments?.length === 6 && saved.transition && Array.isArray(saved.picks)) {
		state = { ...state, ...saved };
	}
} catch (e) {
	storage = false;
}

const view = document.querySelector('#view');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
}[c]));

function save() {
	try {
		localStorage.setItem(key, JSON.stringify(state));
		document.querySelector('#save').textContent = '✓ Draft saved in this browser';
	} catch (e) {
		storage = false;
		document.querySelector('#save').textContent = 'Memory only · export to keep your draft';
	}
}

function toast(t) {
	const e = document.querySelector('#toast');
	e.textContent = t;
	e.style.display = 'block';
	setTimeout(() => e.style.display = 'none', 3500);
}

function audio(id, label = "Listen to the music") {
	const full = label.includes("full reference");
	return `<a class="audio" href="https://drive.google.com/file/d/${id}/view?usp=sharing" target="_blank" rel="noopener noreferrer">▶ ${full ? "Listen to the full song · 5:03" : "Listen to the music"} ↗</a><p class="muted">Click to hear the recording in Google Drive (opens a new tab).</p>`;
}

function chips(options, values, group) {
	return `<div class="chips">${options.map(x => `<button class="chip" data-group="${group}" data-value="${esc(x)}" aria-pressed="${values.includes(x)}">${esc(x)}</button>`).join('')}</div>`;
}

function field(label, path, value, placeholder) {
	return `<label class="section-label" for="${path}">${label}</label><textarea id="${path}" data-path="${path}" placeholder="${placeholder}">${esc(value)}</textarea>`;
}

function footer(text, label, next) {
	return `<div class="footer"><span class="muted">${text}</span><button class="primary" data-stage="${next}">${label} →</button></div>`;
}

function render() {
	const transitionScreen = stage === 0;
	document.querySelector('aside > .eyebrow').textContent = transitionScreen ? 'ACT II → ACT III' : 'ACT III · CLICK CLACK SYMPHONY';
	document.querySelector('aside > h1').innerHTML = transitionScreen ? 'The transition<br><em>& some<br>thoughts.</em>' : 'Act III<br><em>The music.</em>';
	document.querySelector('aside > .intro').innerHTML = transitionScreen ? 'Coming out of Act II and into Act III.<br>Two options to listen to<br>and discuss together.' : 'Listen to the six sections.<br>Share your thoughts, then choose<br>the four we could use.';
	document.querySelector('#nav').innerHTML = ['The transition', 'Listening desk', 'Build the arc', 'Your response'].map((x, i) => `<button data-stage="${i}" class="${stage === i ? 'active' : ''}" ${stage === i ? 'aria-current="step"' : ''}><b>0${i + 1}</b>${x}</button>`).join(''); document.querySelector('#chapter').textContent = `0${stage + 1} / 04 · Act III exploration`;
	if (!storage) document.querySelector('#save').textContent = 'Memory only · export to keep your draft';

    if (stage === 0) {
        view.innerHTML = `<p class="eyebrow">COMING OUT OF ACT II</p><h2>Here’s the transition—and some thoughts.</h2><p class="lead">The idea is to have the pit recapitulate the beginning of the ballad as we come out of Act II and into Act III. Then we layer in one of two Björk options: Hyperballad or Human Behavior. Listen to both transition recordings and leave your thoughts below.</p><div class="grid"><div class="card"><p class="eyebrow">TRANSITION 01</p><h3>Transition option 1</h3><p class="muted">The first recording for comparing the two transition ideas.</p>${audio('1Xox82ESl9G-MDAGxX-i8JlJDUGvhOf48')}</div><div class="card"><p class="eyebrow">TRANSITION 02</p><h3>Transition option 2</h3><p class="muted">The second recording for comparing the two transition ideas.</p>${audio('1VjuBWajUiDXEFWDO6gm7v3lJODsVORUg')}</div></div><p class="muted">Recordings open in Google Drive. Access depends on the file’s sharing permissions.</p><span class="section-label">Which transition option do you prefer?</span>${chips(['Transition 01', 'Transition 02', 'A blend of both', 'Still exploring'], state.transition.preference, 'preference')}${field('Thoughts on the pit recapitulating the beginning of the ballad?', 'transition.front', state.transition.front, 'What works here? What would you change or develop?')}${field('Thoughts on where the brass could enter?', 'transition.brass', state.transition.brass, 'Where do you hear a possible brass entrance?')}${field('Other transition ideas', 'transition.notes', state.transition.notes, 'What else do you hear or imagine?')}${footer('Working ideas for the team to discuss.', 'Continue to Act III', 1)}`;
    }

	if (stage === 1) {
		const s = segments[active], r = state.segments[active];
		view.innerHTML = `<p class="eyebrow">CLICK CLACK SYMPHONY</p><h2>Six moments. Many possibilities.</h2><p class="lead">Take one passage at a time. Capture your first instinct, then follow the musical and visual possibilities.</p>${audio('1OwNomQlEUlWNRHOSQBS0Pg0LNL_HWXC7', 'Listen to the full reference · 5:03')}<div class="segments" aria-label="Select a musical segment">${segments.map((x, i) => `<button class="segment ${i === active ? 'active' : ''}" data-segment="${i}" aria-pressed="${i === active}"><strong>${x[0]}</strong><small>${x[1]}</small><small>${state.segments[i].rating ? '● Rated' : '○ Explore'}</small></button>`).join('')}</div><div class="card"><div class="segment-head"><div><span class="segment-title">${s[0]}</span><span class="muted">${s[1]} · ${s[3]} seconds</span></div>${audio(s[2], 'Listen ↗'.replace(' ↗', ''))}</div><span class="section-label">How compelling is this passage?</span><div class="rating" aria-label="Compellingness rating">${[1, 2, 3, 4, 5].map(n => `<button data-rating="${n}" aria-label="${n} out of 5" aria-pressed="${r.rating === n}">${n}</button>`).join('')}</div><div class="rating-caption"><span>Not yet convinced</span><span>Can’t let it go</span></div><span class="section-label">Musical potential <span class="muted">· choose any</span></span>${chips(['Front ensemble feature', 'Brass arrival', 'Percussion drive', 'Build / crescendo', 'Melodic statement', 'Textural contrast', 'Transition material'], r.music, 'music')}<span class="section-label">Visual & color guard opportunities <span class="muted">· choose any</span></span>${chips(['Supporting color guard', 'Color guard feature', 'Major visual move', 'Standstill and play', 'Staging transformation', 'Movement / dance', 'Ensemble interaction'], r.visual, 'visual')}${field('Leave a creative spark', `segments.${active}.notes`, r.notes, 'What could happen here? A sound, a shape, an unexpected connection…')}<div class="footer"><button class="secondary" data-segment="${active - 1}" ${active === 0 ? 'disabled' : ''}>← Previous</button><span class="muted">${active + 1} of 6</span>${active < 5 ? `<button class="primary" data-segment="${active + 1}">Next passage →</button>` : '<button class="primary" data-stage="2">Build the arc →</button>'}</div></div>`;
	}

	if (stage === 2) {
		const duration = state.picks.reduce((n, i) => n + segments[i][3], 0);
		view.innerHTML = `<p class="eyebrow">THE PROGRAMMING CHALLENGE</p><h2>If we could keep only four…</h2><p class="lead">Pick four sections you think we could use. Then choose which of those four should be the ending. And, of course, it’s clear what the best ending is…</p><div class="topline"><strong style="color:var(--lime)">${state.picks.length} / 4 selected</strong><span>${Math.floor(duration / 60)}:${String(duration % 60).padStart(2, '0')} combined reference time</span></div><div class="grid">${segments.map((s, i) => `<label class="card pick"><input type="checkbox" data-pick="${i}" ${state.picks.includes(i) ? 'checked' : ''} ${state.picks.length === 4 && !state.picks.includes(i) ? 'disabled' : ''}><span><strong>${s[0]}</strong><small>${s[1]} · ${s[3]} seconds</small></span></label>`).join('')}</div><label class="section-label" for="ending">Which selected passage should end Act III?</label><select id="ending"><option value="">Choose the ending…</option>${state.picks.slice().sort((a, b) => a - b).map(i => `<option value="${i}" ${String(state.ending) === String(i) ? 'selected' : ''}>${segments[i][0]} · ${segments[i][1]}</option>`).join('')}</select>${field('What is the arc you imagine?', 'rationale', state.rationale, 'Tell us how these four moments connect, and why the ending lands.')}<div class="note">Reference durations are a starting point, not a proposed show length. Arrangement, pacing, and transitions can change.</div><div class="footer"><button class="secondary" data-stage="1">← Back to listening</button><button class="primary" data-stage="3" ${state.picks.length !== 4 || state.ending === '' ? 'disabled' : ''}>Review your response →</button></div>`;
	}

	if (stage === 3) {
		const valid = state.picks.length === 4 && state.ending !== '';
		view.innerHTML = `<p class="eyebrow">THE DESIGNER’S PERSPECTIVE</p><h2>Give your ideas a voice.</h2><p class="lead">A working draft, ready to revisit. Add your name and perspective, then keep a private copy of your thinking.</p><div class="grid"><div><label class="section-label" for="name">Designer name</label><input id="name" data-path="name" value="${esc(state.name)}" placeholder="Your name" autocomplete="name"></div><div><label class="section-label" for="role">Design role / perspective</label><input id="role" data-path="role" value="${esc(state.role)}" placeholder="Brass, percussion, visual, color guard…"></div></div>${field('One idea the team should not lose', 'overall', state.overall, 'What feels most important as Act III takes shape?')}<div class="card" style="margin-top:25px"><p class="eyebrow">YOUR LISTENING SNAPSHOT</p><div class="review-row"><span>Transition direction</span><strong>${esc(state.transition.preference.join(', ') || 'Still open')}</strong></div>${segments.map((s, i) => `<div class="review-row"><span>${s[0]} · ${s[1]}</span><strong>${state.segments[i].rating ? state.segments[i].rating + ' / 5' : 'Unrated'} · ${state.segments[i].music.length + state.segments[i].visual.length} ideas${state.segments[i].notes ? ' · Notes added' : ''}</strong></div>`).join('')}<div class="review-row"><span>Your four passages</span><strong>${state.picks.slice().sort((a, b) => a - b).map(i => segments[i][0]).join(' → ') || 'Not selected'}</strong></div><div class="review-row"><span>Chosen ending</span><strong>${state.ending !== '' ? segments[Number(state.ending)][0] : 'Not selected'}</strong></div><p class="muted">Passages above are listed in source order; your creative notes describe the proposed arc.</p>${!valid ? '<button class="secondary" data-stage="2">Complete the four-passage challenge →</button>' : ''}</div><div class="note"><strong>Private, local draft only.</strong> Responses are stored in this browser on this device, not sent to a team or shared database. There are no accounts or multiuser collection yet. Anyone using this browser profile can see this draft. Export a copy before clearing browser data.</div><div class="footer"><button class="secondary" id="export">Export draft (.json) ↓</button><button class="primary" id="finish" ${!valid ? 'disabled' : ''}>Save reviewed draft ✓</button></div><button class="secondary" id="clear" style="margin-top:24px">Clear this browser’s draft</button>`;
	}
}

document.addEventListener('click', e => {
	const b = e.target.closest('button');
	if (!b || b.disabled) return;
	if (b.dataset.stage !== undefined) {
		stage = +b.dataset.stage;
		render();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	} else if (b.dataset.segment !== undefined) {
		active = +b.dataset.segment;
		render();
	} else if (b.dataset.rating) {
		state.segments[active].rating = +b.dataset.rating;
		save();
		render();
	} else if (b.dataset.group) {
		const g = b.dataset.group, v = b.dataset.value;
		if (g === 'preference') {
			state.transition.preference = state.transition.preference.includes(v) ? [] : [v];
		} else {
			let a = state.segments[active][g];
			state.segments[active][g] = a.includes(v) ? a.filter(x => x !== v) : [...a, v];
		}
		save();
		render();
	} else if (b.id === 'export') {
		const blob = new Blob([JSON.stringify({
			prototype: '2027 Reading Buccaneers Act III',
			scope: 'Private local draft; no backend submission',
			exportedAt: new Date().toISOString(),
			segmentReference: segments.map(s => ({ label: s[0], time: s[1] })),
			response: state
		}, null, 2)], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'buccaneers-act-iii-draft.json';
		a.click();
		setTimeout(() => URL.revokeObjectURL(a.href), 1000);
		toast('Draft exported. Nothing was submitted.');
	} else if (b.id === 'finish') {
		save();
		toast(storage ? 'Reviewed draft saved in this browser only.' : 'Browser storage unavailable. Export your draft to keep it.');
	} else if (b.id === 'clear' && confirm('Clear all responses saved in this browser? Export first if you want to keep a copy.')) {
		state = empty();
		save();
		stage = 0;
		render();
	}
});

document.addEventListener('input', e => {
	const p = e.target.dataset.path;
	if (p) {
		const parts = p.split('.');
		let o = state;
		parts.slice(0, -1).forEach(x => o = o[x]);
		o[parts.at(-1)] = e.target.value;
		save();
	}
});

document.addEventListener('change', e => {
	if (e.target.dataset.pick !== undefined) {
		const i = +e.target.dataset.pick;
		if (e.target.checked && state.picks.length < 4) {
			state.picks.push(i);
		} else {
			state.picks = state.picks.filter(x => x !== i);
		}
		if (!state.picks.includes(+state.ending)) state.ending = '';
		save();
		render();
	} else if (e.target.id === 'ending') {
		state.ending = e.target.value;
		save();
		render();
	}
});

render();