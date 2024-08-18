// popup.js

document.getElementById('save').addEventListener('click', () => {
    const topic = document.getElementById('topic').value.trim();
    if (topic) {
      chrome.storage.sync.set({ topic: topic }, () => {
        alert('Topic saved! YouTube recommendations will be updated shortly.');
      });
    } else {
      alert('Please enter a topic.');
    }
  });
  