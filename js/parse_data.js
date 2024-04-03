function renderTags(tags) {
    return `
    <div class="tags">
    ${tags.map(tag => `<span class="tag ${tag[0]}">${tag[1]}</span>`).join('\t')}
    </div>`;
}

function renderLecture(data) {
    return `
    <div class="entry">
        <p class="time-stamp">${data.timestamp}</p>
        <p class="title">${data.title}</p>
        <p class="presenter">${data.presenter}</p>
        ${data.tags ? renderTags(data.tags) : ''}
        <p class="description">${data.description}</p>
    </div>`;
}

async function main() {
    let talks = document.getElementById('talks');
    const talksData = await fetch('./lectures.json')
        .then((res) => {
            if (!res.ok) {
                throw new Error
                (`HTTP error! Status: ${res.status}`);
            }
            return res.json();})
        .catch(error => console.error("Unable to fetch data:", error));

    talks.innerHTML = `
        <h2>Upcoming talks</h2>
        ${talksData.map(renderLecture).join('\n')}
    `;
}

main();