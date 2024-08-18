// content.js

const apiKey = 'AIzaSyBY1REpf7o80LPoA7n83lCcynfRe5gdIqY';

// Function to hide all recommended videos
function hideRecommendedVideos() {
  const elements = document.querySelectorAll('ytd-rich-grid-media, ytd-compact-video-renderer, ytd-video-renderer');
  elements.forEach(element => {
    element.style.display = 'none';
  });
}

// Function to create and display filtered content
function displayFilteredContent(videos) {
  const container = document.querySelector('ytd-rich-grid-renderer');
  if (container) {
    const videoList = document.createElement('div');
    videoList.style.display = 'grid';
    videoList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    videoList.style.gap = '10px';

    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.innerHTML = `
        <a href="${video.url}" target="_blank">
          <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%;"/>
          <h4>${video.title}</h4>
        </a>`;
      videoList.appendChild(videoElement);
    });

    container.innerHTML = '';
    container.appendChild(videoList);
  }
}

// Function to fetch videos based on the selected topic
function fetchVideosByTopic(topic) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&key=${apiKey}&type=video`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const videos = data.items.map(item => ({
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.medium.url
      }));
      displayFilteredContent(videos);
    })
    .catch(error => console.error('Error fetching videos:', error));
}

// Listen for changes in storage and update the page accordingly
chrome.storage.onChanged.addListener((changes) => {
  if (changes.topic && changes.topic.newValue) {
    hideRecommendedVideos();
    fetchVideosByTopic(changes.topic.newValue);
  }
});

// Initial run to set up the page based on saved topic
chrome.storage.sync.get('topic', (data) => {
  if (data.topic) {
    hideRecommendedVideos();
    fetchVideosByTopic(data.topic);
  }
});
