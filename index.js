const challenges = [

  { title: 'Comment box', link: 'comment-box' },
  { title: 'Comment box 2', link: 'Comment-Box-2' },
  { title: 'New Project', link: 'new-project' },
];

const createAnchorElement = obj => {
  const a = document.createElement('a');
  a.textContent = obj.title;
  a.href = `./mc/${obj.link}/`;

  if (obj.link === '#') {
    a.classList.add('disabled');
    a.title = 'To be developed';
    a.href = '#';
  }

  return a;
};

const challengeGridEl = document.getElementById('challengeGrid');
challenges.map(createAnchorElement).forEach(el => challengeGridEl.appendChild(el));
