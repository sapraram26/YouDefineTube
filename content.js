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
    videoList.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))'; // Responsive grid layout
    videoList.style.gap = '16px'; // Space between items
    videoList.style.padding = '16px'; // Padding around the grid
    videoList.style.boxSizing = 'border-box'; // Include padding in width/height calculations

    videos.forEach(video => {
      const videoElement = document.createElement('div');
      videoElement.style.backgroundColor = '#fff'; // White background for video element
      videoElement.style.borderRadius = '8px'; // Rounded corners
      videoElement.style.overflow = 'hidden'; // Clip overflow
      videoElement.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'; // Subtle shadow effect
      videoElement.style.cursor = 'pointer'; // Cursor changes to pointer on hover
      videoElement.style.transition = 'transform 0.2s'; // Smooth transition for hover effect

      videoElement.innerHTML = `
        <a href="${video.url}" style="text-decoration: none; color: inherit;">
          <img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; height: auto; border-bottom: 1px solid #e0e0e0;" />
          <div style="padding: 8px;">
            <h4 style="margin: 0; font-size: 14px; line-height: 1.2;">${video.title}</h4>
          </div>
        </a>`;
      
      // Hover effect for video elements
      videoElement.addEventListener('mouseenter', () => {
        videoElement.style.transform = 'scale(1.02)'; // Slightly enlarge video on hover
      });
      videoElement.addEventListener('mouseleave', () => {
        videoElement.style.transform = 'scale(1)'; // Reset scale on mouse leave
      });

      videoList.appendChild(videoElement);
    });

    // Clear the container and append the new video list
    container.innerHTML = '';
    container.appendChild(videoList);
  }
}



// Function to fetch videos based on the selected topic
function fetchVideosByTopic(topic) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(topic)}&key=${apiKey}&type=video&maxResults=30`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Filter videos based on title and description
      const videos = data.items
        .map(item => ({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          thumbnail: item.snippet.thumbnails.medium.url,
          description: item.snippet.description // Get the description
        }))
        .filter(video => 
          video.title.toLowerCase().includes(topic.toLowerCase()) || 
          video.description.toLowerCase().includes(topic.toLowerCase())
        ); // Filter based on title and description
      
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
