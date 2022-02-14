const form = document.querySelector("#form");
const searchInput = document.querySelector("#search");
const songsContainer = document.querySelector("#songs-container");
const previAndNextContainer = document.querySelector(
  "#prev-and-next-container"
);

const apiUrl = `https://api.lyrics.ovh`;

const getMoreSongs = async (url) => {
  const response = await fetch(
    `<https://cors.bridged.cc/http://web.idtlive.com/index/api.show/index.html ${url}`
  );
  const data = await response.json();
  console.log(data);
  insertSongsIntoPage(data);
};

const insertSongsIntoPage = (songsInfo) => {
  songsContainer.innerHTML = songsInfo.data
    .map(
      (song) =>
        `<li class="song">
       <span class="song-artist"><strong>${song.artist.name}</strong> - ${song.title}</span>
       <button class="btn" data-artist ="${song.artist.name}" data-song-title="${song.title}">Ver letra</button>
    </li>`
    )
    .join("");

  if (songsInfo.prev || songsInfo.next) {
    previAndNextContainer.innerHTML = `
      ${
        songsInfo.prev
          ? `<button class="btn" onclik="getMoreSongs('${songsInfo.prev}')">Anteriore</button>`
          : ""
      }
      ${
        songsInfo.next
          ? `<button class="btn" onclik="getMoreSongs('${songsInfo.next}')">Próximas</button>`
          : ""
      }`;
    return;
  }

  previAndNextContainer.innerHTML = "";
};

const fetchSongs = async (term) => {
  const response = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await response.json();

  insertSongsIntoPage(data);

  /*
  fetch(`${apiUrl}/suggest/${term}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
    */
};

form.addEventListener("submit", (Event) => {
  Event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    songsContainer.innerHTML = `<li class="warning-message">Por favor, digite um termo válido </li>`;
    return;
  }

  fetchSongs(searchTerm);
});

const fetchLyrics = async (artist, songTitle) => {
  const response = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
  const data = await response.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  songsContainer.innerHTML = `
  <li class="lyrics-container">
  <h2><strong> ${songTitle}</strong> - ${artist}</h2>
  <p class="l
  yrics">${lyrics}</P
  </li>
  `;
};

songsContainer.addEventListener("click", (Event) => {
  const clickedElement = Event.target;

  if (clickedElement.tagName === "BUTTON") {
    const artist = clickedElement.getAttribute("data-artist");
    const songTitle = clickedElement.getAttribute("data-song-title");

    previAndNextContainer.innerHTML = "";

    fetchLyrics(artist, songTitle);
  }
});
