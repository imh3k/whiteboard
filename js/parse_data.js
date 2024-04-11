function compareTimesamps(a, b) {
    a_int = parseInt(a.timestamp.split('.').map(x => x.trim().padStart(2, '0')).reverse().join(''));
    b_int = parseInt(b.timestamp.split('.').map(x => x.trim().padStart(2, '0')).reverse().join(''));
    return a_int - b_int
}

function renderTags(tags) {
    return `
    <div class="tags">
    ${tags.map(tag => `<span class="tag ${tag[0]}">${tag[1]}</span>`).join('\t')}
    </div>`;
}

function renderLinks(links) {
    return `
    <div class="links">
    ${links.map(link => `<a href="${link.href}" class="file">${link.text}${link.note ? `<span class="link-note">(${link.note})</span>` : ''}</a>`).join('\t')}
    </div>`;
}

function renderTalk(data) {
    return `
    <div class="entry">
        <p class="time-stamp">${data.timestamp}</p>
        <p class="title">${data.title}</p>
        <p class="presenter">${data.presenter}</p>
        ${data.tags ? renderTags(data.tags) : ''}
        <p class="description">${data.description}</p>
    </div>`;
}

function renderProblem(data) {
    return `
    <div class="entry">
        <p class="time-stamp">${data.timestamp}</p>
        <p class="title">${data.title}</p>
        <p class="presenter">${data.presenter}</p>
        ${data.tags ? renderTags(data.tags) : ''}
        <p class="assignment">${data.assignment}</p>
        ${data.links ? renderLinks(data.links) : ''}
    </div>`;
}

async function main() {
    let upcomingTalks = document.getElementById('upcomingTalks')
    let pastTalks = document.getElementById('pastTalks');
    const talksData = await fetch('./talks.json')
        .then((res) => {
            if (!res.ok) {
                throw new Error
                (`HTTP error! Status: ${res.status}`);
            }
            return res.json();})
        .catch(error => console.error("Unable to fetch talks data:", error));

    const date = new Date()
    const dateToday = {'timestamp': `${date.getDate()}. ` + `${date.getMonth() + 1}. ` + `${date.getFullYear()}`};

    talksData.sort(compareTimesamps);
    const upcomingTalksData= [];
    const pastTalksData = [];
    talksData.forEach((x) => (compareTimesamps(x, dateToday) >= 0 ? upcomingTalksData : pastTalksData).push(x));

    upcomingTalks.innerHTML = `
        <h3>Upcoming talks</h3>
        ${upcomingTalksData.map(renderTalk).join('\n')}
    `;

    pastTalks.innerHTML = `
        <h3>Past talks</h3>
        ${pastTalksData.map(renderTalk).join('\n')}
    `;

    let problems = document.getElementById('problems');
    const problemsData = await fetch('./problems.json')
        .then((res) => {
            if (!res.ok) {
                throw new Error
                (`HTTP error! Status: ${res.status}`);
            }
            return res.json();})
        .catch(error => console.error("Unable to fetch problems data:", error));

    problems.innerHTML = `
        <h2>Problems</h2>
        ${problemsData.map(renderProblem).join('\n')}
    `;

    MathJax.typeset();
}

main()