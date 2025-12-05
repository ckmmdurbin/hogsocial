// ====== Replace with your Firebase config ======
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM elements
const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const postCategory = document.getElementById("postCategory");
const feed = document.getElementById("feed");

// Post button click
postBtn.addEventListener("click", () => {
  const text = postText.value.trim();
  const category = postCategory.value;

  if(text === "") return;

  db.collection("posts").add({
    text,
    category,
    timestamp: Date.now()
  });

  postText.value = "";
});

// Real-time listener
db.collection("posts").orderBy("timestamp", "desc").onSnapshot(snapshot => {
  feed.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const postEl = document.createElement("div");
    postEl.classList.add("post");
    postEl.innerHTML = `<span class="category">[${data.category}]</span> ${data.text}`;
    feed.appendChild(postEl);
  });
});
